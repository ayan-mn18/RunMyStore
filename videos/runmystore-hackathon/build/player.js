const $=id=>document.getElementById(id);
const narration=$('narration');
let time=0,playing=false,lastStamp=null,raf=null,currentScene=-1,voiceEnabled=!!narration,settled=true,audioEpoch=0;
const clips=[...document.querySelectorAll('#root .clip')];
function fit(){const box=$('screen');const scale=Math.min(box.clientWidth/1920,box.clientHeight/1080);$('scale-box').style.transform=`scale(${scale})`;}
function activeAt(t){return Math.max(0,SCENES.findIndex(s=>t>=s.start&&t<s.start+s.duration));}
function render(t){
 time=Math.max(0,Math.min(89.999,t));
 for(const a of window.runMyStoreAnimations)a.currentTime=time*1000;
 for(const c of clips){const a=Number(c.dataset.start),b=a+Number(c.dataset.duration);c.style.visibility=time>=a&&time<b?'visible':'hidden';c.style.pointerEvents=time>=a&&time<b?'auto':'none';}
 $('scrubber').value=String(t);$('time-label').textContent=`${fmt(t)} / 01:30`;
 const n=activeAt(time),s=SCENES[n];
 $('chapter-label').textContent=`${String(n+1).padStart(2,'0')} / ${s.chapter}`;
 if(n!==currentScene){currentScene=n;$('note-title').textContent=s.title;$('note-body').textContent=s.notes;document.querySelectorAll('[data-scene]').forEach(b=>b.classList.toggle('active',Number(b.dataset.scene)===n));}
 if(narration&&!playing){try{narration.currentTime=time;}catch{}}
}
function fmt(t){const n=Math.floor(t);return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
function tick(stamp){if(!playing)return;if(voiceEnabled&&narration){if(!narration.paused)render(Math.min(90,narration.currentTime));}else if(lastStamp!==null)render(Math.min(90,time+(stamp-lastStamp)/1000));lastStamp=stamp;if(time>=89.998){pause();$('time-label').textContent='01:30 / 01:30';$('scrubber').value='90';$('play').textContent='Replay pitch';return;}raf=requestAnimationFrame(tick);}
function pause(){playing=false;lastStamp=null;audioEpoch++;if(raf)cancelAnimationFrame(raf);$('play').textContent='Play pitch';narration?.pause();}
function startNarration(){if(!voiceEnabled||!narration)return;const epoch=++audioEpoch;narration.currentTime=time;const attempt=narration.play();attempt?.then(()=>{if(!playing||!voiceEnabled)narration.pause();}).catch(()=>{if(epoch!==audioEpoch)return;voiceEnabled=false;lastStamp=null;$('voice').setAttribute('aria-pressed','false');$('voice').textContent='Enable voice';$('voice').title='Playback was blocked. Click to retry recorded narration.';});}
function play(){if(playing)return;if(time>=89.9)time=0;else if(settled)time=SCENES[currentScene].start;settled=false;playing=true;lastStamp=null;$('play').textContent='Pause';render(time);startNarration();raf=requestAnimationFrame(tick);}
function go(n,showSettled=true){pause();settled=showSettled;const s=SCENES[Math.min(SCENES.length-1,Math.max(0,n))];render(s.start+(showSettled?s.duration-.5:0));}
function toggleNotes(){const hidden=$('speaker-notes').hidden;$('speaker-notes').hidden=!hidden;$('notes-toggle').setAttribute('aria-expanded',String(hidden));fit();}
function full(){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen?.().catch(()=>{$('full').title='Use your browser full-screen command';});}
$('play').addEventListener('click',()=>playing?pause():play());$('prev').addEventListener('click',()=>go(currentScene-1));$('next').addEventListener('click',()=>go(currentScene+1));$('restart').addEventListener('click',()=>go(0,false));$('full').addEventListener('click',full);$('notes-toggle').addEventListener('click',toggleNotes);
$('scrubber').addEventListener('input',e=>{pause();settled=false;render(Number(e.target.value));});
$('voice').addEventListener('click',()=>{if(!narration)return;voiceEnabled=!voiceEnabled;audioEpoch++;lastStamp=null;$('voice').setAttribute('aria-pressed',String(voiceEnabled));$('voice').textContent=voiceEnabled?'Deepgram voice on':'Voice off';if(!voiceEnabled)narration.pause();else if(playing)startNarration();});
document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.scene))));
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select')||(e.key===' '&&e.target.matches('button,a')))return;if([' ','ArrowLeft','ArrowRight','Home'].includes(e.key))e.preventDefault();if(e.key===' ')playing?pause():play();if(e.key==='ArrowRight')go(currentScene+1);if(e.key==='ArrowLeft')go(currentScene-1);if(e.key==='Home')go(0,false);if(e.key.toLowerCase()==='f')full();if(e.key.toLowerCase()==='n')toggleNotes();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
document.addEventListener('fullscreenchange',()=>{document.body.classList.toggle('fullscreen',!!document.fullscreenElement);fit();});
addEventListener('resize',fit);document.fonts.ready.then(fit);
if(!narration){$('voice').disabled=true;$('voice').textContent='Narration pending';$('voice').title='Deepgram narration has not been generated. No browser voice fallback is used.';}else{$('voice').textContent='Deepgram voice on';$('voice').setAttribute('aria-pressed','true');narration.addEventListener('ended',()=>{render(90);pause();$('play').textContent='Replay pitch';});narration.addEventListener('error',()=>{voiceEnabled=false;audioEpoch++;lastStamp=null;$('voice').setAttribute('aria-pressed','false');$('voice').textContent='Audio unavailable';$('voice').disabled=true;});}
fit();const requested=new URLSearchParams(location.search).get('t');render(requested!==null?Number(requested)||0:7.5);
// Exposed only on the presentation, for read-only browser verification and controlled seeks.
window.pitchPlayer={seek:t=>{pause();settled=false;render(t);},play,pause,scene:n=>go(n),get time(){return time;},get playing(){return playing;}};
