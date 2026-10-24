import {createHash} from 'node:crypto';

export function voicePlan(scenes){
 return scenes.map(s=>({id:s.id,start:s.start,duration:s.duration,text:s.captions.map(c=>c[2]).join(' ')}));
}
export function signature(scenes){
 return createHash('sha256').update(JSON.stringify(voicePlan(scenes))).digest('hex');
}
