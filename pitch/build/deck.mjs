import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {Presentation, PresentationFile} from '@oai/artifact-tool';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BUILD=path.join(ROOT,'build');
const SKILL='/Users/bizer/.codex/plugins/cache/openai-primary-runtime/presentations/26.923.10815/skills/presentations';
const PYTHON='/Users/bizer/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
process.env.RUNTIME_NODE_MODULES ??= '/Users/bizer/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')));
const facts=JSON.parse(await fs.readFile(path.join(ROOT,'research/sources.json'),'utf8'));
const C={paper:'#F7F3E8',ink:'#263E35',accent:'#A75132',muted:'#657269',pale:'#E8DFCE',white:'#FFFFFF'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
const imageRoot=path.join(ROOT,'../public/assets');
let serial=0;
function text(s,t,x,y,w,h,size=28,opt={}) {
  const sh=s.shapes.add({name:opt.name||`text-${++serial}`,geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:opt.fill||'none',line:{fill:'none',width:0}});
  sh.text=t;
  sh.text.style={fontSize:size,typeface:opt.serif?'Georgia':'Arial',color:opt.color||C.ink,bold:!!opt.bold,italic:!!opt.italic,autoFit:'none',verticalAlignment:'top',wrap:'square',insets:{left:opt.pad||0,right:opt.pad||0,top:opt.pad||0,bottom:opt.pad||0},...opt.style};
  return sh;
}
function slide(title,{dark=false,label='',notes=''}={}){
  const s=p.slides.add();s.background.fill=dark?C.ink:C.paper;
  const ink=dark?C.paper:C.ink;
  text(s,'RunMyStore',56,34,260,30,18,{bold:true,color:ink});
  if(label)text(s,label,720,34,504,30,16,{color:dark?'#C8D4C9':C.muted,style:{alignment:'right'}});
  if(title)text(s,title,56,98,1168,130,50,{serif:true,color:ink});
  text(s,String(p.slides.items.length).padStart(2,'0'),1178,675,46,25,15,{color:dark?'#C8D4C9':C.muted,style:{alignment:'right'}});
  s.speakerNotes.textFrame.setText(notes);
  return s;
}
async function photo(s,name,x,y,w,h){
  const sharp=(await import('sharp')).default;
  const b=await sharp(path.join(imageRoot,name+'.webp')).png().toBuffer();
  s.images.add({blob:b,contentType:'image/png',alt:`Northwind demo product: ${name}`,fit:'cover',position:{left:x,top:y,width:w,height:h}});
}
function footer(s,t){text(s,t,56,659,1090,48,13,{color:C.muted});}
function line(s,title,body,x,y,w=510){text(s,title,x,y,w,42,29,{bold:true});text(s,body,x,y+49,w,100,24,{color:C.muted});}

// 1. Editorial cover. All headings remain native, editable text.
{
 const s=slide('',{label:'AI FOR COMMERCE'});
 await photo(s,'cat-studio',802,104,422,504);
 text(s,'RunMyStore',56,163,732,112,84,{serif:true});
 text(s,'More time for\nyour product.',56,293,710,174,62,{serif:true,italic:true,color:C.accent});
 text(s,'A connected workspace for the work\nbehind an online store.',56,507,685,88,28);
 footer(s,'Hackathon prototype. All AI actions and commerce data in the demo are simulated.');
 s.speakerNotes.textFrame.setText('Open with the founder, not the technology. RunMyStore aims to reduce the coordination work behind an online store. This is a frontend prototype, not a live autonomous business. Image: existing RunMyStore demo asset, public/assets/cat-studio.webp.');
}
// 2. Problem.
{
 const s=slide('The owner becomes the integration',{label:'THE PROBLEM'});
 text(s,'One product.\nA growing list\nof admin work.',56,252,610,230,54,{serif:true});
 text(s,'Product facts get copied between tools.\nEvery change creates another handoff.',56,526,645,88,26,{color:C.muted});
 const tasks=[['Catalog','Write the listing'],['Website','Update the storefront'],['Ads','Create and resize assets'],['Campaigns','Compare results'],['Budgets','Decide what deserves spend']];
 tasks.forEach(([a,b],i)=>{text(s,a,774,226+i*79,430,35,28,{bold:true});text(s,b,774,262+i*79,430,31,23,{color:C.muted});});
 s.speakerNotes.textFrame.setText('Problem hypothesis: independent merchants carry product context across several tools and repeatedly coordinate work themselves. Public anecdotes suggest app overhead and occasional latency, but we have not measured prevalence or interviewed our own customer cohort yet. Sources S3, S4 and S5 in research/sources.json.');
}
// 3. Audience and initial wedge.
{
 const s=slide('The founder behind the brand',{label:'WHO WE SERVE'});
 await photo(s,'linen-tote',56,248,394,369);
 text(s,'Independent consumer brands\nwith a small operating team',514,244,700,98,38,{serif:true});
 line(s,'They already have a product','They need to launch, improve listings and run recurring campaigns.',514,372,690);
 line(s,'They are still doing the handoffs','The founder reviews creative, fixes store content and decides where to spend.',514,517,690);
 s.speakerNotes.textFrame.setText('Proposed initial customer profile, not a validated segmentation study: owner-operated consumer brands selling physical products, initially in English and eventually globally. Prioritize merchants with an existing catalog and recurring campaign work. Avoid enterprise migrations and regulated product claims during the first pilot. Image: existing demo asset linen-tote.webp.');
}
// 4. The only market/numbers/social-post slide.
{
 const s=slide('Market opportunity and merchant friction',{label:'MARKET MODEL + ILLUSTRATIONS'});
 text(s,'14.0M',56,218,344,73,60,{serif:true});
 text(s,'Live stores detected globally',56,298,344,40,23);
 text(s,'$1.66B',458,218,344,73,60,{serif:true,color:C.accent});
 text(s,'Indicative annual software TAM',458,298,344,40,23);
 text(s,'$376M',860,218,364,73,60,{serif:true,color:C.accent});
 text(s,'Initial Shopify SAM scenario',860,298,364,40,23);
 text(s,'USD model: live stores × 10% assumed fit × $99/month × 12. Shopify subset: 3.16M.',56,355,1168,36,19,{color:C.muted});
 const posts=facts.socialCards.posts;
 posts.forEach((post,i)=>{
   const x=56+i*600;
   text(s,`Fictional merchant ${i?'B':'A'}\nILLUSTRATIVE POST, NOT A REAL TWEET`,x,414,568,205,17,{fill:'#FFFFFF',pad:18,bold:true,color:C.accent});
   text(s,post,x+18,476,532,129,22,{color:C.ink});
 });
 footer(s,'Source: Store Leads, 16 Oct 2026. Domains ≠ unique merchants. Price and fit are assumptions.\nPosts are invented illustrations, not evidence. Forum anecdotes do not prove Shopify is slow overall.');
 const market=facts.market;
 const computed=market.liveStores*market.qualificationAssumption*market.monthlyPriceAssumptionUSD*12;
 if(Math.abs(computed-market.tamAnnualUSD)>.01)throw Error('TAM mismatch');
 if(Math.abs(market.shopifyStores*.1*99*12-market.samAnnualUSD)>.01)throw Error('SAM mismatch');
 s.speakerNotes.textFrame.setText(`Sources accessed 24 Oct 2026. Store Leads report updated 16 Oct 2026: ${market.source}. Detected live domains: 14,005,842 worldwide; Shopify subset: 3,163,099. Domains are not unique businesses. Some may not buy this product. Hypotheses: 10% qualify and an annual subscription of $99 × 12 = $1,188. Indicative annual TAM $1,663,894,029.60; Shopify SAM $375,776,161.20. Neither is measured demand, a revenue forecast or GMV. We must deduplicate brands and validate qualification and willingness to pay. At 5% and 15% fit the TAM sensitivity is approximately $832M to $2.50B. These are model scenarios, not confidence bounds.\n\nBoth visible post cards are fictional illustrations. No real person said this wording; they are not X screenshots. Real anecdotal support: Central_Hobbies, 29 Apr 2026, Shopify Community: “It takes several seconds to over a minute for anything I do on the admin page or sidekick to respond.” https://community.shopify.com/t/admin-and-sidekick-slow-to-respond/615291\nApp cost anecdote: https://www.reddit.com/r/ShopifyeCommerce/comments/1wbhux6/i_feel_like_its_all_getting_too_much/\nCounter-context: https://help.shopify.com/en/manual/online-store/web-performance/improving-web-performance describes theme/app/media performance factors and Shopify's CDN and hosting optimizations. Admin latency and storefront performance differ. RunMyStore has no comparative speed benchmark.`);
}
// 5. Product overview.
{
 const s=slide('One workflow, shared product context',{label:'THE SOLUTION',dark:true});
 const titles=['Catalog','Website','Ads','Campaigns','Budgets'];
 const bodies=['Confirmed facts\nand reusable assets','A storefront built\nfrom the catalog','Creative based on\nthe same product','One view of\ncampaign results','A proposed action\nwithin your limits'];
 titles.forEach((t,i)=>{const x=56+i*238;text(s,t,x,270,224,51,34,{serif:true,color:C.paper});text(s,bodies[i],x,347,218,115,23,{color:'#CBD5CA'});});
 text(s,'You review the work.\nYou authorize the action.',56,528,1168,100,40,{serif:true,color:C.paper});
 s.speakerNotes.textFrame.setText('Walk through the connected workflow. The same product facts and selected creative travel downstream. The current frontend demonstrates this state flow with mock generation and local persistence. Future integrations should keep an approval and execution receipt for each external action.');
}
// 6. Catalog and website.
{
 const s=slide('A product becomes a storefront',{label:'CATALOG + WEBSITE'});
 await photo(s,'cat-detail',56,247,334,369);
 text(s,'Catalog Studio',454,249,694,50,34,{serif:true});
 text(s,'Supply product facts. Prepare a listing.\nReview claims before publishing.',454,318,711,89,28);
 text(s,'Website Builder',454,446,700,50,34,{serif:true});
 text(s,'Choose sections, refine the brand and\npreview the same catalog on mobile.',454,515,711,89,28);
 footer(s,'Working UI flow with prepared outputs. Publishing creates a local demo snapshot.');
 s.speakerNotes.textFrame.setText('Show Catalog Studio and Website Builder. Merchant input supplies factual attributes. Unknown dimensions, materials and product claims stay unknown until confirmed. The website builder uses the catalog, offers section editing and mobile preview. Publishing is local, not a public deployed store. Source: prototype code and PRD.md. Image: cat-detail.webp.');
}
// 7. Advertising and tracking.
{
 const s=slide('Creative and campaign results stay connected',{label:'ADS + CAMPAIGNS'});
 await photo(s,'cat-window',826,247,398,369);
 line(s,'Ad generation','Prepare channel-specific creative using the approved product and brand.',56,252,700);
 line(s,'Campaign tracking','Connect each selected creative to a campaign and compare its results.',56,423,700);
 text(s,'Every number in the live demo is mock data.',56,605,700,40,21,{color:C.accent,bold:true});
 s.speakerNotes.textFrame.setText('Ad variants are prepared fixtures. Campaign activation and metrics are simulated. Do not describe the demo ROAS or revenue as customers, traction, product impact or model performance. The intended production flow associates approved creative with live channel identifiers and retrieves attributable results. Image: cat-window.webp.');
}
// 8. Control over budget.
{
 const s=slide('The merchant controls the spend',{label:'BUDGETS + APPROVALS'});
 text(s,'A recommendation\nis ready for review.',56,250,610,210,56,{serif:true});
 text(s,'The owner makes the commitment.',56,531,647,66,29,{color:C.accent});
 line(s,'A fixed spending cap','The proposed allocation must stay within the merchant’s limit.',762,234,448);
 line(s,'A reason for the change','Show the signal, proposed movement and likely trade-off.',762,390,448);
 line(s,'An approval receipt','Record what changed, who approved it and whether it completed.',762,544,448);
 s.speakerNotes.textFrame.setText('Existing UI demonstrates reallocation inside a fixed monthly cap. It does not write to advertising platforms. Future production needs idempotent execution, authenticated approval, an audit log and rollback or compensation where supported. Recommendations require margin and attribution context, not ROAS alone.');
}
// 9. AgenticOrg truthfully scoped.
{
 const s=slide('AgenticOrg coordinates the work',{label:'PINE LABS / PROPOSED INTEGRATION',dark:true});
 text(s,'Shared context',56,251,650,62,44,{serif:true,color:C.paper});
 text(s,'Brand guidelines, product facts, goals\nand approved spending limits.',56,326,663,93,29,{color:'#CBD5CA'});
 text(s,'Specialist roles',783,251,442,62,39,{serif:true,color:C.paper});
 text(s,'Catalog\nStorefront\nCreative\nCampaign analyst\nBudget planner',783,326,442,239,27,{color:'#CBD5CA'});
 text(s,'Drafts need your approval.\nEvery completed action needs a receipt.',56,548,690,92,29,{color:C.paper});
 text(s,'Current demo: simulated agents.\nAgenticOrg execution is the next integration step.',56,665,1090,39,15,{color:'#CBD5CA'});
 s.speakerNotes.textFrame.setText('AgenticOrg by Pine Labs is a hackathon requirement. This slide is a proposed architecture, not a claim that the requirement is already implemented. We must verify AgenticOrg APIs and map these roles to supported execution primitives. Use shared typed context, a coordinator and human approval before publishing or spending. The frontend presently simulates agent jobs; there is no live backend or AgenticOrg run.');
}
// 10. Honest competitor context, avoiding false feature comparisons.
{
 const s=slide('A strong field, with a focused opportunity',{label:'EXISTING SOLUTIONS'});
 const rows=[['Shopify Sidekick','Store-aware assistance and multi-step actions inside Shopify.'],['AdCreative.ai','AI creative generation and creative scoring for advertising.'],['Klaviyo','Customer data and automated lifecycle marketing.']];
 rows.forEach(([a,b],i)=>{text(s,a,56,249+i*98,329,53,32,{serif:true});text(s,b,427,253+i*98,784,72,26,{color:C.muted});});
 text(s,'Our hypothesis',56,569,300,44,27,{bold:true,color:C.accent});
 text(s,'A simpler cross-tool workflow for small teams, with product context\nand budget approvals carried through each handoff.',427,559,784,82,26);
 footer(s,'Sources: Shopify Help, AdCreative.ai and Klaviyo. Capability descriptions, not performance comparisons.');
 s.speakerNotes.textFrame.setText('Research accessed 24 Oct 2026. Shopify Sidekick already has product context, multi-step work and reviews before applying changes: https://help.shopify.com/en/manual/ai-powered-tools/sidekick . AdCreative.ai describes ad creative, video and scoring capabilities: https://www.adcreative.ai/ . Klaviyo describes customer data, marketing automation and ecommerce integrations: https://www.klaviyo.com/ . These overlap with RunMyStore. The proposed differentiation is workflow simplicity across tools and consistent approvals, which requires validation. StoreOS was the supplied visual/product inspiration, not proof of an exclusive market gap. We do not claim any competitor cannot add these features.');
}
// 11. North Star and how to measure it.
{
 const s=slide('Owner hours returned, every week',{label:'PROPOSED NORTH STAR'});
 text(s,'Verified hours saved\nper active store',56,247,727,169,60,{serif:true,color:C.accent});
 text(s,'Measure at the weekly median.',56,435,750,48,28);
 text(s,'Manual baseline time\nless review, correction and rework time',56,522,711,91,30);
 line(s,'Count completed work','Use unique execution receipts. Exclude failed or duplicate jobs.',839,244,374);
 line(s,'Keep quality intact','Track claim errors, reversals, spend limits and merchant retention.',839,429,374);
 footer(s,'Proposed metric. No time-saving result has been measured in this prototype.');
 s.speakerNotes.textFrame.setText('North Star definition: weekly median of net verified owner hours saved per weekly active store. For each workflow type establish a paired manual baseline with pilot merchants. Subtract actual review, correction and rework time. Keep negative results; do not clamp them away. Sum only unique completed workflows per store, then take the median across active stores. Count a task only once when an external execution receipt confirms completion. Record manual baseline minutes, human work minutes, workflow ID, merchant ID and completion status. Guardrails: product-claim errors, reversals, unauthorized spend, overspend and retention. Do not optimize for raw number of generations or agent messages. Baseline, active-store definition and willingness to pay require pilot validation.');
}
// 12. Live demo / next test.
{
 const s=slide('',{label:'LIVE DEMO'});
 await photo(s,'aura-bottle',906,172,318,444);
 text(s,'More product.\nLess busywork.',56,181,824,208,72,{serif:true});
 text(s,'RunMyStore',56,432,793,80,52,{serif:true,color:C.accent});
 text(s,'Let’s follow a product through the workflow\nand approve a campaign decision.',56,537,792,96,28);
 footer(s,'Next: integrate AgenticOrg, connect a real test store and validate owner time saved.');
 s.speakerNotes.textFrame.setText('Switch to the live frontend demo. Follow one confirmed product into the website, select ad creative, inspect mock campaign results and review a budget recommendation. Disclose simulation before demonstrating it. Next validation: interview owner-operated brands, time the same workflow manually, run a sandbox integration with approval receipts, then test willingness to pay. No claimed traction or conversion uplift. Image: existing aura-bottle.webp.');
}

await fs.mkdir(path.join(ROOT,'.codex-finalizer'),{recursive:true});
const draft=path.join(BUILD,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(draft);
await fs.writeFile(path.join(BUILD,'presentation.json'),JSON.stringify(p.toProto()));
for(let i=0;i<p.slides.items.length;i++){
  const s=p.slides.items[i];
  const png=await p.export({slide:s,format:'png',scale:1});
  await fs.writeFile(path.join(BUILD,`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));
  const layout=await s.export({format:'layout'});
  await fs.writeFile(path.join(BUILD,`slide-${i+1}.layout.json`),await layout.text());
}
const finalPath=path.join(ROOT,'output',process.env.DECK_FILENAME||'RunMyStore-Hackathon.pptx');
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath,pythonExecutable:PYTHON,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:12,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Georgia','Arial']},verifyArtifactToolImport:true,receiptPath:path.join(ROOT,'.codex-finalizer',path.basename(finalPath)+'.validation.json')});
console.log(JSON.stringify({finalPath,slides:p.slides.items.length,result},null,2));
