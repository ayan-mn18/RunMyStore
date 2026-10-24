import {AgenticOrg} from 'agenticorg-sdk';
import {channels,clone,month,money,totals,periodMetrics,uid,validateBudget,requestApproval,type State,type Channel,type Site,type Creative,type Budget} from './domain.ts';
// "Ask RunMyStore" on an AgenticOrg agent. Configured by VITE_* env vars; without a key and agent id the assistant keeps its prepared answers.
// import.meta.env is absent in the esbuild open-demo bundle and under node tests, hence the fallback.
const env:Record<string,string|undefined>=(import.meta as {env?:Record<string,string|undefined>}).env??{};
const read=(key:string)=>(env[key]||'').trim();
const apiKey=read('VITE_AGENTICORG_API_KEY'),agentId=read('VITE_RMS_AGENT_ID');
// AgenticOrg blocks cross-origin browser calls, so by default go through this origin's /api/v1 (proxied in vite.config.ts).
const baseUrl=read('VITE_AGENTICORG_DIRECT')!=='true'&&typeof location!=='undefined'?location.origin:read('VITE_AGENTICORG_BASE_URL')||'https://app.agenticorg.ai';
export const agentLive=Boolean(apiKey&&agentId);
let client:AgenticOrg|null=null;
export type Turn={role:'user'|'assistant';text:string};
export type Action=
 |{type:'budget_proposal';channels:Record<Channel,number>;rationale?:string}
 |{type:'storefront_revision';title:string;subtitle:string;look?:Site['look'];cta?:string;hero?:string}
 |{type:'product_listing';productId:string;description:string;seoTitle?:string;seoDescription?:string}
 |{type:'ad_creative';productId:string;platform:Channel;headline:string;body:string;cta:string}
 |{type:'navigate';path:string};
export type Reply={reply:string;actions:Action[]};

// The store view the agent's system prompt describes. Money is integer cents; "formatted" carries the same amounts
// as dollar strings, because the model otherwise slips when converting cents for its reply.
export function storeSnapshot(s:State,productId=''){
 const mtd=(campaignId?:string)=>{const t=totals(periodMetrics(s,'month',campaignId));return {...t,roas:t.spend?Number((t.revenue/t.spend).toFixed(2)):null,ctr:t.impressions?`${(t.clicks/t.impressions*100).toFixed(2)}%`:null,formatted:{spend:money(t.spend),revenue:money(t.revenue),cpa:t.purchases?money(Math.round(t.spend/t.purchases)):null}};};
 const b=s.budgets[month(s)];
 return {
  store:{name:s.store.name,category:s.store.category,audience:s.store.audience,tone:s.store.tone,currency:s.store.currency,email:s.site.email},
  simulated_date:s.simulatedDate,
  products:s.products.filter(p=>p.status!=='Archived').map(p=>({id:p.id,title:p.title,price:p.price,price_formatted:money(p.price),material:p.material||null,stock:p.stock,status:p.status,collection:p.collection})),
  selected_product:s.products.find(p=>p.id===productId)??null,
  campaigns:s.campaigns.map(c=>({id:c.id,name:c.name,platform:c.platform,status:c.status,objective:c.objective,month_to_date:mtd(c.id)})),
  month_to_date:mtd(),
  budget:b?{month:b.month,cap:b.cap,channels:b.channels,campaigns:b.campaigns,formatted:{cap:money(b.cap),channels:Object.fromEntries(channels.map(c=>[c,money(b.channels[c])]))}}:null,
  site:{look:s.site.look,title:s.site.title,subtitle:s.site.subtitle,cta:s.site.cta},
  pending_approvals:s.approvals.filter(a=>a.status==='Pending').length,
 };
}

type Obj=Record<string,unknown>;
const isObj=(x:unknown):x is Obj=>!!x&&typeof x==='object'&&!Array.isArray(x);
const text=(x:unknown)=>typeof x==='string'&&x.trim()?x.trim():'';
const opt=(x:unknown)=>text(x)||undefined;
const cents=(x:unknown)=>Number.isSafeInteger(x)&&(x as number)>=0;
export function toAction(x:unknown):Action|null{
 if(!isObj(x))return null;
 switch(x.type){
  case 'budget_proposal':{const c=x.channels;return isObj(c)&&channels.every(k=>cents(c[k]))?{type:x.type,channels:{Meta:c.Meta as number,Google:c.Google as number,TikTok:c.TikTok as number},rationale:opt(x.rationale)}:null;}
  case 'storefront_revision':return text(x.title)&&text(x.subtitle)?{type:x.type,title:text(x.title),subtitle:text(x.subtitle),look:['Warm','Bold','Minimal'].includes(x.look as string)?x.look as Site['look']:undefined,cta:opt(x.cta),hero:typeof x.hero==='string'&&x.hero.startsWith('/assets/')?x.hero:undefined}:null;
  case 'product_listing':return text(x.productId)&&text(x.description)?{type:x.type,productId:text(x.productId),description:text(x.description),seoTitle:opt(x.seoTitle),seoDescription:opt(x.seoDescription)}:null;
  case 'ad_creative':return text(x.productId)&&channels.includes(x.platform as Channel)&&text(x.headline)&&text(x.body)?{type:x.type,productId:text(x.productId),platform:x.platform as Channel,headline:text(x.headline),body:text(x.body),cta:text(x.cta)||'Shop now'}:null;
  case 'navigate':return typeof x.path==='string'&&x.path.startsWith('/app/')?{type:x.type,path:x.path}:null;
  default:return null;
 }
}
function json(s:string):unknown{
 const c=(s.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]??s).trim();
 for(const candidate of [c,c.slice(c.indexOf('{'),c.lastIndexOf('}')+1)]){if(!candidate.startsWith('{'))continue;try{return JSON.parse(candidate);}catch{}}
 return undefined;
}
// The agent should reply {"reply","actions"}. AgenticOrg wraps output it could not parse as {raw_output:"<string>"},
// and models sometimes add fences or break the JSON; never show raw JSON to the owner.
export function parseReply(output:unknown,depth=0):Reply{
 if(depth>4)return {reply:'',actions:[]};
 if(typeof output==='string'){
  const parsed=json(output);if(isObj(parsed))return parseReply(parsed,depth+1);
  const trimmed=output.trim();if(!/^(```|\{)/.test(trimmed))return {reply:trimmed,actions:[]};
  const m=trimmed.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/);let reply='';if(m){try{reply=JSON.parse(`"${m[1]}"`) as string;}catch{reply=m[1];}}
  return {reply,actions:[]};
 }
 if(!isObj(output))return {reply:output==null?'':String(output),actions:[]};
 if('reply' in output||'actions' in output)return {reply:text(output.reply),actions:(Array.isArray(output.actions)?output.actions:[]).map(toAction).filter((a):a is Action=>!!a)};
 for(const key of ['output','raw_output','result','text','answer','response','content','message'])if(key in output)return parseReply(output[key],depth+1);
 return {reply:'',actions:[]};
}
export async function askAgent(message:string,history:Turn[],s:State,productId:string):Promise<Reply>{
 // grantexToken and baseUrl are passed explicitly: the SDK otherwise reads process.env, which does not exist in the browser.
 client??=new AgenticOrg({apiKey,grantexToken:'',baseUrl,timeout:60000});
 const r=await client.agents.run(agentId,{inputs:{message,history:history.slice(-8),product_id:productId||null},context:{store:storeSnapshot(s,productId)}});
 if(r.error||/^(failed|error)$/i.test(r.status))throw new Error(r.error||`Agent run ${r.status}`);
 return parseReply(r.output);
}

// Agent actions become local drafts and approval requests, never direct changes. ok=false means the change was refused;
// its text explains why and should be shown to the owner.
export type Run=(role:string,request:string,steps:string[],complete:(s:State)=>string|void)=>void;
export type Outcome={ok:boolean;text:string;path?:string};
const split=(b:Budget)=>channels.map(c=>`${c} ${money(b.channels[c])}`).join(' · ');
export function applyAction(a:Action,s:State,run:Run,request:string):Outcome{
 switch(a.type){
  case 'budget_proposal':{
   const current=s.budgets[month(s)];if(!current)return {ok:false,text:'There is no budget for this month yet. Open Budgets to set one up.',path:'/app/budgets'};
   const proposed=clone(current);
   channels.forEach(c=>{const delta=a.channels[c]-current.channels[c];proposed.channels[c]=a.channels[c];const id=s.campaigns.find(x=>x.platform===c&&x.status!=='Draft')?.id;if(id&&delta)proposed.campaigns[id]=(proposed.campaigns[id]||0)+delta;});
   if(channels.every(c=>proposed.channels[c]===current.channels[c]))return {ok:false,text:'That split matches your current budget, so there is nothing to propose.',path:'/app/budgets'};
   const errors=validateBudget(s,proposed);if(errors.length)return {ok:false,text:`I couldn't prepare that budget proposal: ${errors.join(' ')}`,path:'/app/budgets'};
   const gains=channels.filter(c=>proposed.channels[c]>current.channels[c]);
   const title=gains.length===1?`Move ${money(proposed.channels[gains[0]]-current.channels[gains[0]])} to ${gains[0]}`:'Rebalance channel budgets';
   run('Budget Planner',request,['Reading monthly spend and allocations','Checking the proposed reallocation','Preparing the proposal for your approval'],d=>requestApproval(d,'budget',proposed.month,proposed,title,split(current),split(proposed),proposed.version));
   return {ok:true,text:'',path:'/app/approvals'};
  }
  case 'storefront_revision':
   run('Store Builder',request,['Reading catalog and brand settings','Preparing a storefront revision','Saving a change for your approval'],d=>{const before=d.site.title;d.site={...d.site,look:a.look??d.site.look,title:a.title,subtitle:a.subtitle,cta:a.cta??d.site.cta,hero:a.hero??d.site.hero,version:d.site.version+1};return requestApproval(d,'website','site',{site:d.site,products:d.products.filter(p=>p.status==='Published')},'A considered new storefront',before,d.site.title,d.site.version);});
   return {ok:true,text:'',path:'/app/approvals'};
  case 'product_listing':{
   const p=s.products.find(x=>x.id===a.productId);if(!p)return {ok:false,text:'I could not find that product in your catalog. Choose it in the product selector and try again.'};
   if(!p.material)return {ok:false,text:`${p.title} is missing a confirmed material. Add it in Catalog Studio so the listing does not invent product details.`,path:'/app/catalog/'+p.id};
   run('Catalog',request,['Checking confirmed product facts','Preparing the catalog description','Saving a reviewable draft'],d=>{const item=d.products.find(x=>x.id===p.id);if(!item)throw new Error('This product was removed before the draft was ready.');item.description=a.description;item.seoTitle=a.seoTitle||item.title+' | '+d.store.name;item.seoDescription=a.seoDescription||a.description;item.alt||=item.title;item.status='Draft';item.version++;return '/app/catalog/'+p.id;});
   return {ok:true,text:'',path:'/app/catalog/'+p.id};
  }
  case 'ad_creative':{
   const p=s.products.find(x=>x.id===a.productId);if(!p)return {ok:false,text:'I could not find that product in your catalog. Choose it in the product selector and try again.'};
   const id=uid('ad');
   run('Creative Studio',request,['Reading the selected product','Preparing a product-led ad concept','Saving the creative draft'],d=>{const creative:Creative={id,productId:p.id,platform:a.platform,format:'Static',headline:a.headline,body:a.body,cta:a.cta,audience:d.store.audience,region:'Global',objective:'Sales',tone:d.store.tone,offer:'',destination:'/store/'+d.store.slug,image:p.image,crop:'Cover',style:0,scenes:[p.title,'The details','Shop the collection'],version:1,status:'Draft'};d.creatives.unshift(creative);return '/app/ads/'+id;});
   return {ok:true,text:'',path:'/app/ads/'+id};
  }
  case 'navigate':return {ok:true,text:'',path:a.path};
 }
}
