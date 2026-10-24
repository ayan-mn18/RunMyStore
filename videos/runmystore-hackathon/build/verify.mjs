import assert from 'node:assert/strict';
import {readFileSync,existsSync,writeFileSync} from 'node:fs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,join} from 'node:path';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const scenes=JSON.parse(readFileSync(join(root,'scenes.json'),'utf8'));
const html=readFileSync(join(root,'index.html'),'utf8');
const presentation=readFileSync(join(root,'presentation.html'),'utf8');
const {seed,totals,recommendBudget}=await import(pathToFileURL(resolve(root,'../../src/domain.ts')));
const state=seed(),stats=totals(state.metrics);
assert.equal(scenes.length,9);let end=0;
for(const s of scenes){assert.equal(s.start,end);end+=s.duration;let edge=0;for(const [a,b,text] of s.captions){assert.equal(a,edge);assert(b>a&&b<=s.duration);assert(text.length>0);edge=b;}assert.equal(edge,s.duration);}
assert.equal(end,90);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'unique HTML ids');
for(const match of html.matchAll(/(?:src="|url\(')(assets\/[^"')]+)/g))assert(existsSync(join(root,match[1])),match[1]);
assert(!/src="https?:|url\('https?:/.test(presentation));assert(!/src="assets\/|url\('assets\//.test(presentation),'portable assets must be embedded');
assert(!presentation.includes('data-composition-id='),'presentation cannot be discovered as a duplicate HF root');
assert.equal(stats.revenue,3192000);assert.equal(stats.spend,900000);assert.equal(stats.purchases,399);
assert.equal((stats.revenue/stats.spend).toFixed(2),'3.55');
const spend=state.campaigns.slice(0,3).map(c=>totals(state.metrics.filter(m=>m.campaignId===c.id)).spend/100);
assert.deepEqual(spend,[4200,3300,1500]);
for(const n of spend)assert(html.includes('$'+n.toLocaleString('en-US')),'channel figure appears in film');
const plan=recommendBudget(state);assert.equal(plan.cap,1200000);assert.deepEqual(plan.channels,{Meta:550000,Google:440000,TikTok:210000});
assert.equal(Object.values(plan.channels).reduce((a,b)=>a+b,0),plan.cap);
assert(html.includes('Agent workflow shown here is simulated.'));
assert(html.includes('SEED DATA · ILLUSTRATIVE, NOT REAL RESULTS'));
for(const file of ['build/pitch.mjs','build/motion.js','build/player.js']){
 const code=readFileSync(join(root,file),'utf8');
 if(file.endsWith('.js'))new vm.Script(code,{filename:file});
}
// Exercise the controller's time and navigation behavior without pretending to test layout.
const elements=new Map(),listeners=new Map(),clips=scenes.map(s=>({dataset:{start:String(s.start),duration:String(s.duration)},style:{}}));
function element(id){if(id==='narration')return null;if(!elements.has(id))elements.set(id,{id,hidden:id==='speaker-notes',style:{},clientWidth:1440,clientHeight:810,value:'',textContent:'',dataset:{},classList:{toggle(){}},setAttribute(){},addEventListener(type,fn){listeners.set(id+':'+type,fn);}});return elements.get(id);}
const window={runMyStoreAnimations:[{currentTime:0}]};
const context=vm.createContext({window,SCENES:scenes,console,URLSearchParams,location:{search:''},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},addEventListener:()=>{},document:{getElementById:element,querySelectorAll:s=>s==='#root .clip'?clips:[],fonts:{ready:Promise.resolve()},body:{classList:{toggle(){},add(){}}},addEventListener(){},documentElement:{}}});
vm.runInContext(readFileSync(join(root,'build/player.js'),'utf8'),context);
assert.equal(window.pitchPlayer.time,7.5);
window.pitchPlayer.play();assert.equal(window.pitchPlayer.time,0,'first play begins at the beginning');window.pitchPlayer.pause();
window.pitchPlayer.scene(5);assert.equal(window.pitchPlayer.time,56.5);
window.pitchPlayer.play();assert.equal(window.pitchPlayer.time,46,'manual scene play begins at scene start');
window.pitchPlayer.pause();window.pitchPlayer.seek(36.25);window.pitchPlayer.play();assert.equal(window.pitchPlayer.time,36.25,'resume preserves explicit seek');
window.pitchPlayer.pause();window.pitchPlayer.seek(90);assert.equal(clips.filter(c=>c.style.visibility==='visible').length,1,'final frame remains visible');
window.pitchPlayer.play();assert.equal(window.pitchPlayer.time,0,'replay starts at zero');window.pitchPlayer.pause();
assert(!presentation.includes('speechSynthesis'),'browser speech fallback removed');
assert.equal(element('voice').disabled,true,'missing audio is clearly unavailable');
// Recorded-audio mode: seeks align; pause/mute stop audio; media is the master clock.
const audioListeners=new Map();
const mockAudio={paused:true,currentTime:0,playCalls:0,pause(){this.paused=true;},play(){this.paused=false;this.playCalls++;return Promise.resolve();},addEventListener(type,fn){audioListeners.set(type,fn);}};
const audioWindow={runMyStoreAnimations:[{currentTime:0}]};let onFrame;
const audioContext=vm.createContext({window:audioWindow,SCENES:scenes,console,URLSearchParams,location:{search:''},requestAnimationFrame:fn=>{onFrame=fn;return 1;},cancelAnimationFrame:()=>{},addEventListener:()=>{},document:{getElementById:id=>id==='narration'?mockAudio:element(id),querySelectorAll:s=>s==='#root .clip'?clips:[],fonts:{ready:Promise.resolve()},body:{classList:{toggle(){},add(){}}},addEventListener(){},documentElement:{}}});
vm.runInContext(readFileSync(join(root,'build/player.js'),'utf8'),audioContext);
audioWindow.pitchPlayer.play();await Promise.resolve();assert.equal(mockAudio.currentTime,0);assert.equal(mockAudio.paused,false);
mockAudio.currentTime=12.4;onFrame(1000);assert.equal(audioWindow.pitchPlayer.time,12.4,'visuals follow audio clock');
audioWindow.pitchPlayer.pause();assert.equal(mockAudio.paused,true);
audioWindow.pitchPlayer.seek(37.2);assert.equal(mockAudio.currentTime,37.2);audioWindow.pitchPlayer.play();await Promise.resolve();
listeners.get('voice:click')();assert.equal(mockAudio.paused,true,'mute stops recorded playback');
listeners.get('voice:click')();await Promise.resolve();assert.equal(mockAudio.paused,false,'unmute resumes aligned playback');
audioWindow.pitchPlayer.pause();
// A previous play() promise must not pause a newer play after a rapid scene change.
let resolveOld;
mockAudio.play=function(){this.paused=false;return new Promise(resolve=>{resolveOld=resolve;});};
audioWindow.pitchPlayer.play();const old=resolveOld;audioWindow.pitchPlayer.pause();
mockAudio.play=function(){this.paused=false;return Promise.resolve();};
audioWindow.pitchPlayer.play();await Promise.resolve();old();await Promise.resolve();assert.equal(mockAudio.paused,false,'stale play completion preserves newest intent');audioWindow.pitchPlayer.pause();
const report={ok:true,scenes:9,duration:90,assetReferences:'present',standalonePresentation:'embedded images and fonts',fixtureReconciliation:'passed',playerStateChecks:'passed (no browser layout)',browserVisualQA:'blocked by automatic approval review infrastructure 404',mp4:'not rendered'};
writeFileSync(join(root,'verification.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
