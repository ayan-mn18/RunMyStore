import {readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve, join} from 'node:path';
import {createHash} from 'node:crypto';
import {signature} from './voice-plan.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, '../../public/assets');
const imgNames = ['cat-studio.webp','cat-window.webp','cat-detail.webp','cat-before.webp','linen-tote.webp','aura-bottle.webp'];
mkdirSync(join(root, 'assets'), {recursive:true});
for (const name of [...imgNames, 'Inter-var.woff2', 'JetBrainsMono-var.woff2']) copyFileSync(join(source,name),join(root,'assets',name));
const esc = v => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const photo = (name, cls='', extra='') => `<img class="${cls}" src="assets/${name}.webp" alt="${name.includes('cat')?'Northwind ceramic mug':'Northwind product'}" ${extra}>`;
const on = (t, mode='rise') => `data-reveal="${t}" data-motion="${mode}"`;
const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>';
const badge = (text,t=0,cls='') => `<span class="badge ${cls}" ${on(t,'fade')}>${check}${text}</span>`;
const label = (text,t=.1) => `<p class="kicker" ${on(t,'fade')}><span class="spark">✳</span>${text}</p>`;
const steps = (active) => `<div class="workflow-rail">${['Catalog','Website','Ads','Campaigns','Budgets'].map((x,i)=>`<span class="${i===active?'active':''}"><i>${String(i+1).padStart(2,'0')}</i>${x}</span>`).join('')}</div>`;
const stateLabel = '<span class="demo-label">FRONTEND PROTOTYPE · MOCK DATA</span>';
const scenes = [
{id:'01-problem',title:'One store. Too many jobs.',duration:8,chapter:'The problem',captions:[
 [0,2,'You started a store.'],[2,6,'Website. Listings. Ads. Reports. The work piles up.'],
 [6,8,'Who connects it? You do.']
],notes:'Open on the merchant, not on AI. The problem is coordination: a small merchant has to carry the same product facts across separate tools and make spending decisions from separate reports. This is a problem hypothesis, not a quantified market finding.',body:`
 <div class="problem-layout">
  <div class="problem-copy">${label('AI for Commerce / The problem')}
   <h1 class="hero-title"><span ${on(.25)}>You started</span><span ${on(.55)}>a <em>store.</em></span></h1>
   <p class="statement" ${on(2.0)}>Then you inherited<br>six different jobs.</p>
   <div class="thesis" ${on(6.0,'left')}>The owner becomes the integration.</div>
  </div>
  <div class="work-stack">
   <div class="product-slice" ${on(.7,'left')}>${photo('cat-studio')}<span>ONE GREAT PRODUCT.</span></div>
   <div class="task-stack">${[['01','Website','Update the storefront'],['02','Catalog','Write the listing'],['03','Advertising','Make the creative'],['04','Campaigns','Read the results'],['05','Budgets','Decide where to spend'],['06','Customers','Keep every promise']].map(([n,x,y],i)=>`<div class="task-row" ${on(1.3+i*.7,'left')}><span>${n}</span><div><strong>${x}</strong><small>${y}</small></div><i>↗</i></div>`).join('')}</div>
  </div>
 </div>`},
{id:'02-solution',title:'One connected workspace.',duration:8,chapter:'The solution',captions:[
 [0,3,'Meet RunMyStore. One connected workspace.'],[3,8,'From product to storefront. From creative to campaign. With you in control.']
],notes:'Position RunMyStore as the connected merchant workspace. Its central value is that product context and approvals travel through the workflow. The AI actions are simulated for this hackathon UI prototype.',body:`
 ${label('The solution')}
 <div class="solution-header"><h1 class="brand-title" ${on(.4)}>RunMyStore<span class="brand-dot">✳</span></h1><p class="lead" ${on(1.2)}>The work connects.<br>Your business moves.</p></div>
 <div class="connected-path">${['Product','Storefront','Creative','Campaign','Budget'].map((x,i)=>`<div class="path-stage" ${on(2+i*.72,'left')}><span class="path-no">0${i+1}</span><strong>${x}</strong><div class="path-icon">${i===0?photo('cat-studio'):i===1?'<div class="mini-site"><b></b><i></i><i></i><i></i></div>':i===2?'<div class="mini-ad">Made<br>for everyday.</div>':i===3?'<div class="mini-chart"><i></i><i></i><i></i><i></i></div>':'<div class="mini-budget">$<span>Within your cap</span></div>'}</div>${i<4?`<span class="path-arrow">${arrow}</span>`:''}</div>`).join('')}</div>
 <div class="connected-end" ${on(6.1,'fade')}><span class="thin-line"></span>${check}<strong>You approve the decisions.</strong><span class="thin-line"></span></div>`},
{id:'03-catalog',title:'Start with the product truth.',duration:10,chapter:'Catalog Studio',captions:[
 [0,3,'Start with a product and the facts you know.'],[3,6.6,'Prepare descriptions, images and search metadata.'],[6.6,10,'Review the listing before it moves downstream.']
],notes:'Catalog Studio supports product fields, SKU validation, image input and listing preparation. The demo uses prepared output; it does not infer factual claims from a photograph. Unknown material or dimensions must be supplied by the merchant. The approved artifact is reusable downstream.',body:`
 ${steps(0)}<div class="feature-heading">${label('01 / Catalog Studio')}<h1 ${on(.4)}>A product. <em>A clear story.</em></h1></div>
 <div class="catalog-layout"><div class="catalog-photo" ${on(.8,'left')}>${photo('cat-studio')}<div class="photo-stamp">NORTHWIND<br><span>Everyday collection</span></div></div>
 <div class="catalog-input" ${on(1.2,'rise')}><p class="panel-label">MERCHANT INPUT</p><h2>What do we know?</h2><div class="fact"><span>Product</span><strong>Everyday ceramic mug</strong></div><div class="fact" ${on(2.1)}><span>Price</span><strong>$40.00</strong></div><div class="fact" ${on(2.8)}><span>Material</span><strong>Ceramic <small>Confirmed</small></strong></div><p class="input-note" ${on(4.6,'fade')}>Facts come from the merchant.<br>Unknown details stay unknown.</p></div>
 <div class="catalog-result" ${on(3.5,'left')}><p class="panel-label">EDITABLE LISTING</p><h2>Make room for<br>the everyday.</h2><p>A ceramic mug for the moments between everything else.</p><div class="seo-result" ${on(5.6)}><small>SEARCH PREVIEW</small><strong>Everyday ceramic mug · Northwind</strong><span>Considered essentials for everyday living.</span></div>${badge('Reviewed for the demo',7.5)}<div class="artifact-tag" ${on(8.3,'fade')}>PRODUCT / p1 ${arrow} Ready for your storefront</div></div></div>`},
{id:'04-website',title:'A storefront that feels like you.',duration:10,chapter:'Website Builder',captions:[
 [0,3,'Build a storefront around the same catalog.'],[3,6.5,'Edit sections, refine your brand, check mobile.'],[6.5,10,'Then review and publish your demo.']
],notes:'Use Website Builder in the live demo: edit the hero and sections, preview desktop or mobile, and review the draft. Publication creates an immutable local demo snapshot, not a public live store. Approved catalog products are available to this builder.',body:`
 ${steps(1)}<div class="feature-heading">${label('02 / Website Builder')}<h1 ${on(.4)}>Your brand, <em>on every screen.</em></h1></div>
 <div class="builder-stage"><div class="editor-tools" ${on(.8,'left')}><span class="panel-label">YOUR SECTIONS</span><div class="selected">01 / Hero ${check}</div><div ${on(2)}>02 / Collection</div><div ${on(2.7)}>03 / Story</div><div ${on(3.4)}>04 / Newsletter</div><span class="panel-label lower">PALETTE</span><div class="swatches"><i></i><i></i><i></i></div><p>Draft → Review → Publish</p></div>
 <div class="store-desktop" ${on(1,'rise')}><div class="store-nav"><strong>northwind.</strong><span>Shop &nbsp;&nbsp; Our story &nbsp;&nbsp; Bag (0)</span></div><div class="store-hero"><div><small>LESS, BUT BETTER.</small><h2>Good things.<br>Every day.</h2><p>Considered essentials.<br>A little more intention.</p><span class="store-cta">Explore the collection ${arrow}</span></div>${photo('cat-studio')}</div><div class="store-products" ${on(3.5,'fade')}>${['cat-studio','linen-tote','aura-bottle'].map(x=>photo(x)).join('')}<div>Made for<br><em>your everyday.</em></div></div></div>
 <div class="store-mobile" ${on(5.1,'left')}><div class="mobile-notch"></div><strong>northwind.</strong><h2>Good things.<br>Every day.</h2>${photo('cat-studio')}<span>Explore collection →</span></div>
 <div class="publish-receipt" ${on(7.7,'rise')}>${check}<span><strong>Published to demo</strong><small>Approved revision · same catalog</small></span></div></div>`},
{id:'05-ads',title:'One product. Three introductions.',duration:10,chapter:'Ad Studio',captions:[
 [0,3,'Turn that product into ad concepts.'],[3,6.8,'Compare variations for Meta, Google and TikTok.'],[6.8,10,'Edit the copy. Save a creative. Attach it to a campaign.']
],notes:'The UI creates prepared editable concepts tied to the selected catalog product, with platform previews and a versioned creative library. These visuals illustrate concept preparation, not live ads. Static artwork and carousel cards can export as PNG; generated video is currently a storyboard.',body:`
 ${steps(2)}<div class="feature-heading">${label('03 / Ad Studio')}<h1 ${on(.4)}>One product. <em>Three introductions.</em></h1></div>
 <div class="ad-brief" ${on(1,'left')}><strong>THE BRIEF</strong><span>Everyday ceramic mug · Warm & considered · Explore the collection</span></div>
 <div class="ad-grid"><div class="ad-panel studio" ${on(2,'rise')}><div class="ad-platform">META / FEED CONCEPT <span>01</span></div><div class="ad-art">${photo('cat-studio')}<div class="ad-type">Your daily<br><em>pause.</em></div><span class="ad-brand">NORTHWIND</span></div><p>A little ritual. All yours.</p></div>
 <div class="ad-panel lifestyle" ${on(3.6,'rise')}><div class="ad-platform">GOOGLE / IMAGE CONCEPT <span>02</span></div><div class="ad-art">${photo('cat-window')}<div class="ad-type">A good day<br>starts here.</div><span class="ad-brand">NORTHWIND</span></div><p>Make room for the everyday.</p><div class="selected-creative" ${on(7,'fade')}>${check}Selected creative · v1</div></div>
 <div class="ad-panel detail" ${on(5.2,'rise')}><div class="ad-platform">TIKTOK / STORYBOARD CONCEPT <span>03</span></div><div class="ad-art">${photo('cat-detail')}<div class="ad-type">The small<br>things matter.</div><span class="ad-brand">NORTHWIND</span></div><p>One detail. A different feeling.</p></div></div>
 <div class="ad-handoff" ${on(8,'left')}>Catalog p1 ${arrow} Saved creative ${arrow} Campaign draft</div>`},
{id:'06-campaigns',title:'See what the campaign is doing.',duration:11,chapter:'Campaign tracking',captions:[
 [0,3.5,'Track spend, revenue and purchases together.'],[3.5,7.2,'See campaign status and compare channels.'],[7.2,11,'Seeded demo figures illustrate the decisions a merchant needs to make.']
],notes:'All numbers are October 1–24, 2026 fixtures from the app: $31,920 attributed revenue, $9,000 ad spend, 399 purchases. ROAS is 31,920 divided by 9,000, rounded to 3.55. This is not company traction, a causal lift claim, or a forecast. New demo campaigns begin with zero history; next-day events are simulated.',body:`
 ${steps(3)}<div class="feature-heading">${label('04 / Campaign tracking')}<h1 ${on(.4)}>Make the next move <em>with context.</em></h1></div>
 <div class="analytics-meta" ${on(.8,'fade')}><span>NORTHWIND / OCT 01–24, 2026</span><strong>SEED DATA · ILLUSTRATIVE, NOT REAL RESULTS</strong></div>
 <div class="metric-grid">${[['$9,000','Ad spend','Across three active demo campaigns'],['$31,920','Attributed revenue','Linked to the seeded order ledger'],['399','Purchases','Each reconciled to a demo order']].map(([n,l,d],i)=>`<div class="metric" ${on(1.2+i*1.3)}><span>${l}</span><strong>${n}</strong><small>${d}</small></div>`).join('')}</div>
 <div class="analytics-bottom"><div class="channel-chart" ${on(4.2,'fade')}><div class="panel-head"><strong>Spend by channel</strong><span>USD · Demo data</span></div>${[['Meta',4200,1],['Google',3300,3300/4200],['TikTok',1500,1500/4200]].map(([name,n,pct],i)=>`<div class="chart-row"><span>${name}</span><div class="chart-track"><i style="width:${pct*100}%" data-grow="${4.8+i*.55}"></i></div><strong>$${n.toLocaleString('en-US')}</strong></div>`).join('')}</div><div class="roas" ${on(7.2,'left')}><span>RETURN ON AD SPEND</span><strong>3.55<span>×</span></strong><p>$31,920 revenue ÷ $9,000 spend</p><small>Visibility for a decision. Not a promise of profit.</small></div></div>`},
{id:'07-budget',title:'Move the money. Keep the limit.',duration:11,chapter:'Budgeting & approval',captions:[
 [0,4,'Move $500 from Meta and $300 from TikTok to Google.'],[4,7.8,'The $12,000 monthly cap stays fixed.'],[7.8,11,'You review the proposal and approve the change.']
],notes:'This is the exact planning scenario in the app. Meta moves from $6,000 to $5,500; Google from $3,600 to $4,400; TikTok from $2,400 to $2,100. The total stays at $12,000. The recommendation responds to seeded pacing, not a proven performance optimization. Show Review, then Approve & apply, then the decision journal.',body:`
 ${steps(4)}<div class="feature-heading">${label('05 / Budgeting & approval')}<h1 ${on(.4)}>A better allocation. <em>The same limit.</em></h1></div>
 <div class="budget-layout"><div class="budget-anchor" ${on(.9,'left')}><span class="panel-label">MONTHLY CAP</span><strong>$12,000</strong><p>Fixed before.<br>Fixed after.</p><div class="budget-move" ${on(3.7)}><span>PROPOSED MOVE</span><strong>$800</strong><small>Meta + TikTok → Google</small></div></div>
 <div class="budget-table" ${on(1.2,'fade')}><div class="budget-table-head"><span>CHANNEL</span><span>BEFORE</span><span>AFTER</span></div>${[['Meta','$6,000','$5,500','− $500'],['Google','$3,600','$4,400','+ $800'],['TikTok','$2,400','$2,100','− $300']].map(([n,a,b,delta],i)=>`<div class="budget-tr"><strong>${n}</strong><span>${a}</span><div ${on(3+i*1.5,'left')}><strong>${b}</strong><small>${delta}</small></div></div>`).join('')}<div class="budget-total" ${on(7.7,'fade')}><span>APPROVED LIMIT</span><strong>$12,000 ${check}</strong></div></div></div>
 <div class="approval-strip" ${on(8.7,'rise')}><span>Planning example · no live funds moved</span><div>${check}<strong>Merchant approval required</strong><span>Decision recorded</span></div></div>`},
{id:'08-agents',title:'Agentic by design. Human by decision.',duration:13,chapter:'AgenticOrg plan',dark:true,captions:[
 [0,4,'The intended orchestration layer: AgenticOrg by Pine Labs.'],[4,8.5,'Shared context. Specialist roles. Approval before action.'],[8.5,13,'Today the connected UI uses mock data. Agent execution is simulated.']
],notes:'Be explicit with judges: AgenticOrg is a proposed integration; current role handoffs are simulated. Proposed flow: a request carries shared product/catalog context; specialists prepare artifacts; the operator presents a diff; a merchant approves; a scoped tool executes and records a receipt. Real AgenticOrg, model and external provider calls remain next steps, not completed features.',body:`
 ${label('AgenticOrg by Pine Labs / Intended integration')}<h1 class="agent-head" ${on(.4)}>Agentic by design.<br><em>Human by decision.</em></h1>
 <div class="agent-request" ${on(1.1,'left')}><span>MERCHANT REQUEST</span><strong>“Help me launch this collection.”</strong><small>Product facts · Brand context · Budget limit</small></div>
 <div class="agent-flow"><div class="orchestrator" ${on(3,'rise')}><span>PROPOSED ORCHESTRATION</span><strong>AgenticOrg</strong><small>Plan → route → coordinate</small></div><span class="connector" ${on(3.6,'fade')}>${arrow}</span><div class="role-list">${['Catalog','Store Builder','Creative Studio','Campaign Analyst','Budget Planner'].map((x,i)=>`<div ${on(4+i*.55,'left')}><span>0${i+1}</span>${x}</div>`).join('')}</div><span class="connector" ${on(7,'fade')}>${arrow}</span><div class="human-gate" ${on(7.5,'left')}>${check}<strong>Your approval</strong><span>Review → Approve → Act</span><small>Record the decision</small></div></div>
 <div class="prototype-disclosure" ${on(9.4,'rise')}><div><strong>WORKING PROTOTYPE</strong><span>Connected UI · persistent mock data · local approvals</span></div><div><strong>NEXT: LIVE EXECUTION</strong><span>AgenticOrg, model calls and provider integrations</span></div><b>Agent workflow shown here is simulated.</b></div>`},
{id:'09-close',title:'You run the business.',duration:9,chapter:'The live demo',captions:[
 [0,4.5,'You run the business. RunMyStore runs the store.'],[4.5,9,'Let’s walk through the prototype: one product, one campaign, one approved decision.']
],notes:'Switch to the live prototype. Start in Catalog Studio and open the draft mug. Confirm material, prepare and approve the listing. Show Website Builder, then Ad Studio, attach a saved creative to a draft campaign, and close by reviewing the budget recommendation. State that all external actions are simulated.',body:`
 <div class="closing-copy">${label('RunMyStore / AI for Commerce')}<h1><span ${on(.4)}>You run</span><span ${on(1.1)}>the <em>business.</em></span></h1><p ${on(3)}>RunMyStore runs the store.</p><div class="live-invite" ${on(5,'left')}><strong>Let’s open the prototype.</strong>${arrow}</div><div class="demo-path" ${on(6.2,'fade')}>One product <span>→</span> One campaign <span>→</span> One approved decision</div></div>
 <div class="closing-product" ${on(.8,'left')}>${photo('cat-studio')}<div class="close-stamp">A little more<br><em>room to grow.</em><span>RUNMYSTORE</span></div></div>`}
];
let at=0; scenes.forEach(s=>{s.start=at;at+=s.duration});
if(at!==90)throw new Error('Pitch duration must be 90 seconds');
const css = readFileSync(join(root,'build/style.css'),'utf8')+'\n'+readFileSync(join(root,'build/refinements.css'),'utf8');
const runtime = readFileSync(join(root,'build/motion.js'),'utf8');
const player = readFileSync(join(root,'build/player.js'),'utf8');
const wrap = s => `<section id="scene-${s.id}" class="scene clip ${s.dark?'dark':''}" data-start="${s.start}" data-duration="${s.duration}" data-track-index="0" aria-label="${esc(s.title)}"><div class="scene-inner">${s.body}<div class="scene-foot"><span>RunMyStore</span>${stateLabel}<span>${s.id.slice(0,2)} / 09</span></div></div></section>`;
const caps = scenes.flatMap(s=>s.captions.map(([a,b,t],i)=>`<div class="caption clip" id="caption-${s.id}-${i}" data-start="${s.start+a}" data-duration="${b-a}" data-track-index="1" data-layout-allow-caption-zone>${esc(t)}</div>`)).join('\n');
let hasNarration=false;
const mp3Path=join(root,'assets/audio/narration.mp3'),metaPath=join(root,'assets/audio/narration.json');
if(existsSync(mp3Path)&&existsSync(metaPath)){
 const meta=JSON.parse(readFileSync(metaPath,'utf8'));
 hasNarration=meta.provider==='Deepgram'&&meta.verified&&meta.duration===90&&meta.sceneSignature===signature(scenes)&&meta.mp3Sha256===createHash('sha256').update(readFileSync(mp3Path)).digest('hex');
 if(!hasNarration)console.warn('Recorded narration is stale or invalid. Run npm run voice to regenerate.');
}
const audioMarkup=hasNarration?'<audio id="narration" src="assets/audio/narration.mp3" data-start="0" data-duration="90" data-track-index="10" preload="auto"></audio>':'';
const composition = `<div id="root" data-composition-id="runmystore-hackathon" data-no-timeline data-start="0" data-duration="90" data-width="1920" data-height="1080">${scenes.map(wrap).join('\n')}${caps}${audioMarkup}<div class="film-progress" aria-hidden="true"><i id="film-fill"></i></div></div>`;
const head = `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>RunMyStore — AI for Commerce</title><style>${css}</style>`;
const index=`<!doctype html><html lang="en"><head>${head}</head><body>${composition}<script>${runtime}</script></body></html>`;
writeFileSync(join(root,'index.html'),index);
const serialized=JSON.stringify(scenes.map(({id,title,duration,chapter,start,notes,captions})=>({id,title,duration,chapter,start,notes,captions}))).replaceAll('<','\\u003c');
let presentation=`<!doctype html><html lang="en"><head>${head}<style>${readFileSync(join(root,'build/player.css'),'utf8')}</style></head><body class="presentation"><header class="player-header"><span class="player-brand"><b>✳</b> RunMyStore</span><span>AI FOR COMMERCE / HACKATHON PITCH</span><button id="notes-toggle" type="button" aria-expanded="false">Speaker notes</button></header><main id="screen"><div id="scale-box">${composition}</div></main><section id="player-controls" aria-label="Presentation controls"><div class="button-group"><button id="prev" title="Previous scene (Left arrow)" aria-label="Previous scene">←</button><button id="play" class="play-button" title="Play or pause (Space)">Play pitch</button><button id="next" title="Next scene (Right arrow)" aria-label="Next scene">→</button><button id="restart" title="Restart (Home)" aria-label="Restart">↺</button></div><div class="timeline-control"><div><span id="chapter-label"></span><span id="time-label">00:00 / 01:30</span></div><input type="range" id="scrubber" min="0" max="90" step="0.05" value="0" aria-label="Pitch timeline"></div><div class="button-group"><button id="voice" type="button" title="Optional browser voice; availability and quality depend on your system" aria-pressed="false">Voice off</button><button id="full" title="Full screen (F)" aria-label="Toggle full screen">⛶</button><a class="demo-link" href="../../open-demo.html#/app/overview" target="_blank" rel="noopener">Open demo ↗</a></div></section><aside id="speaker-notes" hidden><h2 id="note-title"></h2><p id="note-body"></p><div class="chapters">${scenes.map((s,i)=>`<button data-scene="${i}">${String(i+1).padStart(2,'0')} ${esc(s.chapter)}</button>`).join('')}</div><p class="keyboard-help">Space: play/pause · ←/→: scenes · Home: restart · F: full screen · N: notes. Manual scene navigation shows the completed scene. Browser voice is optional and is not a rendered soundtrack.</p></aside><script>${runtime}</script><script>const SCENES=${serialized};\n${player}</script></body></html>`;
// Portable: the entire presentation, including images and fonts, is one file.
for (const name of [...imgNames,'Inter-var.woff2','JetBrainsMono-var.woff2',...(hasNarration?['audio/narration.mp3']:[])]) {
 const mime=name.endsWith('.woff2')?'font/woff2':name.endsWith('.mp3')?'audio/mpeg':'image/webp';
 presentation=presentation.replaceAll(`assets/${name}`,`data:${mime};base64,${readFileSync(join(root,'assets',name)).toString('base64')}`);
}
presentation=presentation.replace('data-composition-id="runmystore-hackathon"','data-presentation-id="runmystore-hackathon"');
presentation=presentation.replace('Optional browser voice; availability and quality depend on your system','Recorded Deepgram narration, synchronized with the presentation').replace('Browser voice is optional and is not a rendered soundtrack.',hasNarration?'Recorded Deepgram narration follows playback, pause and seek.':'Recorded narration is pending. Browser speech has been removed.');
writeFileSync(join(root,'presentation.html'),presentation);
const sheet=`<!doctype html><html lang="en"><head>${head}<style>html,body{width:auto;height:auto;overflow:auto;background:#e8dfce}body{padding:32px}.sheet-title{font:28px Inter;margin:0 0 24px}.sheet-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.sheet-frame{aspect-ratio:16/9;position:relative;overflow:hidden;background:#f7f3e8}.sheet-scale{width:1920px;height:1080px;transform-origin:top left}.scene{position:relative}.caption{display:none}.sheet-label{font:15px Inter;margin:10px 0 20px}.scene-inner{position:absolute;inset:0}</style></head><body><h1 class="sheet-title">RunMyStore / 90-second hackathon pitch</h1><div class="sheet-grid">${scenes.map(s=>`<article><div class="sheet-frame"><div class="sheet-scale">${wrap(s)}</div></div><p class="sheet-label">${s.id.slice(0,2)} · ${esc(s.title)} · ${s.start}–${s.start+s.duration}s</p></article>`).join('')}</div><script>function fit(){document.querySelectorAll('.sheet-frame').forEach(x=>x.firstElementChild.style.transform='scale('+x.clientWidth/1920+')')}addEventListener('resize',fit);fit();</script></body></html>`;
writeFileSync(join(root,'storyboard.html'),sheet);
writeFileSync(join(root,'scenes.json'),JSON.stringify(scenes.map(({body,...s})=>s),null,2));
const script='# RunMyStore — speaker script\n\n**Delivery:** warm, direct, measured; approximately 90 seconds including reading pauses.\n**Audio:** '+(hasNarration?'Deepgram narration is embedded.':'Deepgram narration is pending. Use this script live; browser speech is disabled.')+'\n\n'+scenes.map((s,i)=>`## Line ${i+1} — ${s.title} (Frame ${i+1})\n\n**Time:** ${s.start}–${s.start+s.duration}s\n\n    ${s.captions.map(x=>x[2]).join(' ')}\n\n**Presenter note:** ${s.notes}\n`).join('\n');
writeFileSync(join(root,'SCRIPT.md'),script);
// Individual static scene files provide convenient per-frame review surfaces.
for(const s of scenes){
 const local=wrap({...s,start:0});
 writeFileSync(join(root,'compositions/frames',s.id+'.html'),`<template><style>${css}</style><div data-composition-id="frame-${s.id}" data-no-timeline data-start="0" data-duration="${s.duration}" data-width="1920" data-height="1080" style="width:100%;height:100%">${local}</div><script>${runtime.replace('90000',String(s.duration*1000))}</script></template>`);
}
console.log(`Built ${scenes.length} scenes / ${at}s; presentation.html ${(Buffer.byteLength(presentation)/1024/1024).toFixed(2)} MB; local assets embedded.`);
