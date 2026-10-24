// Native WAAPI adapter: every state derives from the absolute Hyperframes time.
// No network, wall-clock animation, callbacks, or random state in the composition.
const motions=[];
function animate(el,frames,options){const a=el.animate(frames,{fill:'both',iterations:1,...options});a.pause();a.currentTime=0;motions.push(a);return a;}
document.querySelectorAll('.scene').forEach(scene=>{
 const start=Number(scene.dataset.start)*1000;
 scene.querySelectorAll('[data-reveal]').forEach(el=>{
  const mode=el.dataset.motion;
  const from=mode==='left'?'translateX(65px)':mode==='fade'?'translateY(0px)':'translateY(38px)';
  animate(el,[{opacity:0,transform:from},{opacity:1,transform:'translate(0px,0px)'}],{duration:760,delay:start+Number(el.dataset.reveal)*1000,easing:'cubic-bezier(0.16,1,0.3,1)'});
 });
 scene.querySelectorAll('[data-grow]').forEach(el=>animate(el,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:1000,delay:start+Number(el.dataset.grow)*1000,easing:'cubic-bezier(0.16,1,0.3,1)'}));
});
const fill=document.getElementById('film-fill');
if(fill)animate(fill,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:90000,easing:'linear'});
// A direct-file player uses the same animation objects; Hyperframes owns them in index.html.
window.runMyStoreAnimations=motions;
