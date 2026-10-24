import {readFile,writeFile,mkdir,rename,mkdtemp} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,join,resolve} from 'node:path';
import {voicePlan,signature} from './voice-plan.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const scenes=JSON.parse(await readFile(join(root,'scenes.json'),'utf8'));
const lines=voicePlan(scenes);
const voice=process.env.DEEPGRAM_VOICE||'aura-2-jupiter-en';
const dry=process.argv.includes('--dry-run');
if(dry){console.log(JSON.stringify({provider:'Deepgram',voice,lines,signature:signature(scenes),networkRequests:0},null,2));process.exit(0);}

// Secret input never reaches files, shell history, browser HTML or logs.
async function secretPrompt(){
 if(!process.stdin.isTTY)throw Error('Use an interactive terminal or set DEEPGRAM_API_KEY in the process environment.');
 process.stdout.write('Deepgram API key (hidden): ');
 process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
 return new Promise((resolveKey,reject)=>{
  let value='';
  const done=(error)=>{process.stdin.off('data',receive);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');error?reject(error):resolveKey(value.trim());};
  function receive(chunk){for(const c of chunk){if(c==='\u0003')return done(Error('Cancelled'));if(c==='\r'||c==='\n')return done();if(c==='\u007f')value=value.slice(0,-1);else if(c>=' ')value+=c;}}
  process.stdin.on('data',receive);
 });
}
let key=process.env.DEEPGRAM_API_KEY||await secretPrompt();
delete process.env.DEEPGRAM_API_KEY;
if(!key)throw Error('Deepgram API key is required.');
function run(bin,args){const r=spawnSync(bin,args,{encoding:'utf8',maxBuffer:8*1024*1024});if(r.status!==0)throw Error(`${bin} failed: ${(r.stderr||r.error?.message||'').slice(0,500)}`);return r.stdout;}
function duration(file){return Number(run('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file]).trim());}
const audio=join(root,'assets/audio');await mkdir(audio,{recursive:true});
const working=await mkdtemp(join(audio,'.voice-build-'));
const measured=[];
for(const line of lines){
 const digest=createHash('sha256').update(voice+'\n'+line.text).digest('hex');
 const raw=join(audio,`${line.id}-${digest.slice(0,12)}.wav`);
 if(!existsSync(raw)){
  const params=new URLSearchParams({model:voice,encoding:'linear16',sample_rate:'48000',container:'wav'});
  const response=await fetch(`https://api.deepgram.com/v1/speak?${params}`,{method:'POST',headers:{Authorization:`Token ${key}`,'Content-Type':'application/json'},body:JSON.stringify({text:line.text}),signal:AbortSignal.timeout(45000)});
  if(!response.ok)throw Error(`Deepgram returned HTTP ${response.status}. No fallback voice was used.`);
  const bytes=Buffer.from(await response.arrayBuffer());
  if(bytes.length<1000||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')throw Error(`Deepgram did not return valid WAV audio for ${line.id}.`);
  const temp=join(working,line.id+'.wav');await writeFile(temp,bytes);const d=duration(temp);
  if(!Number.isFinite(d)||d<.2||d>30)throw Error(`Unexpected audio duration for ${line.id}.`);
  await rename(temp,raw);
 }
 const d=duration(raw),slot=line.duration-.25;
 if(!Number.isFinite(d)||d<.2||d>30)throw Error(`Invalid cached narration: ${line.id}.`);
 // Refuse to cut words or aggressively accelerate the voice to fit the scene.
 const rate=Math.max(1,d/slot);
 if(rate>1.08)throw Error(`${line.id} needs ${d.toFixed(2)}s but has ${slot.toFixed(2)}s. Shorten its narration or extend its scene; refusing to truncate speech.`);
 const prepared=join(working,line.id+'-aligned.wav');
 run('ffmpeg',['-v','error','-y','-i',raw,'-af',`atempo=${rate},adelay=100:all=1,apad,atrim=duration=${line.duration}`,'-ar','48000','-ac','1','-c:a','pcm_s16le',prepared]);
 measured.push({...line,sourceDuration:d,playbackRate:rate,path:prepared});
 console.log(`${line.id}: ${d.toFixed(2)}s narration in ${line.duration}s scene`);
}
key='';
const args=measured.flatMap(x=>['-i',x.path]);
const merged=join(working,'narration.wav');
run('ffmpeg',['-v','error','-y',...args,'-filter_complex',`${measured.map((_,i)=>`[${i}:a]`).join('')}concat=n=${measured.length}:v=0:a=1[a]`,'-map','[a]','-c:a','pcm_s16le',merged]);
const length=duration(merged);if(Math.abs(length-90)>.04)throw Error('Narration must be exactly 90 seconds.');
const mp3=join(working,'narration.mp3');run('ffmpeg',['-v','error','-y','-i',merged,'-c:a','libmp3lame','-b:a','128k',mp3]);
const metadata={provider:'Deepgram',voice,duration:90,sceneSignature:signature(scenes),mp3Sha256:createHash('sha256').update(await readFile(mp3)).digest('hex'),lines:measured.map(({path,...line})=>line),captionMode:'Scene summaries, not word-aligned transcript',verified:true};
await rename(merged,join(audio,'narration.wav'));await rename(mp3,join(audio,'narration.mp3'));
await writeFile(join(audio,'narration.json'),JSON.stringify(metadata,null,2));
run(process.execPath,[join(root,'build/pitch.mjs')]);
console.log('Deepgram narration generated and embedded in presentation.html. Rehearse it before presenting.');
