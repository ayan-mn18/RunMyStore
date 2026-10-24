import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {seed,clone,uid,activity,invalidateChangedApprovals,type State,type AgentRun} from './domain';
const KEY='runmystore.workspace.v1';
type StoreContext={state:State;change:(fn:(draft:State)=>void)=>boolean;notice:(text:string)=>void;toast:string;storageError:string;reset:()=>void;run:(role:string,request:string,steps:string[],complete:(s:State)=>string|void)=>void;cancelRun:(id:string)=>void;retryRun:(id:string)=>void};
const Context=createContext<StoreContext>(null!);
export function Provider({children}:{children:React.ReactNode}){
 const [initial]=useState(()=>{try{const raw=localStorage.getItem(KEY);if(!raw)return {state:seed(),error:''};const parsed=JSON.parse(raw);if(parsed.schemaVersion!==1||!['products','campaigns','metrics','revisions','creatives','orders','conversations','approvals','runs','activity'].every(k=>Array.isArray(parsed[k]))||!parsed.budgets?.[parsed.simulatedDate?.slice(0,7)]||!parsed.site?.blocks||!parsed.store?.slug||!parsed.preferences||!parsed.integrations)throw Error();parsed.runs=parsed.runs.map((r:AgentRun)=>['Running','Queued'].includes(r.status)?{...r,status:'Failed'}:r);return{state:parsed as State,error:''};}catch{return{state:seed(),error:'Saved workspace could not be read. A temporary sample is open; export it or reset to replace the stored data.'};}});
 const [state,setState]=useState<State>(initial.state); const current=useRef(state);const [toast,setToast]=useState('');const [storageError,setStorageError]=useState(initial.error);const blocked=useRef(Boolean(initial.error));const timers=useRef(new Map<string,ReturnType<typeof setTimeout>>());const handlers=useRef(new Map<string,(s:State)=>string|void>());
 useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id);},[toast]);
 useEffect(()=>()=>{timers.current.forEach(clearTimeout);},[]);
 function change(fn:(draft:State)=>void){try{const next=clone(current.current);fn(next);invalidateChangedApprovals(next);current.current=next;setState(next);if(!blocked.current){try{localStorage.setItem(KEY,JSON.stringify(next));setStorageError('');}catch{setStorageError('Browser storage is full. Your current edits are still here. Export your workspace before closing this tab.');}}return true;}catch(e){setToast(e instanceof Error?e.message:'This change could not be saved.');return false;}}
 function advance(id:string,retry=false){const s=current.current;const r=s.runs.find(x=>x.id===id);if(!r||r.status==='Cancelled')return;
  const delay=s.preferences.speed==='Fast'?80:450;
  const timer=setTimeout(()=>{const latest=current.current.runs.find(x=>x.id===id);if(!latest||latest.status==='Cancelled')return;
   if(!retry&&current.current.preferences.scenario!=='Success'&&latest.step===1){change(d=>{const t=d.runs.find(x=>x.id===id)!;t.status=d.preferences.scenario==='Missing input'?'Needs input':'Failed';});return;}
   if(latest.step>=latest.steps.length){let failure='';change(d=>{const before=clone(d);const task=d.runs.find(x=>x.id===id)!;try{const ref=handlers.current.get(id)?.(d);task.artifact=ref||'';task.status=d.approvals.some(a=>a.id===ref&&a.status==='Pending')?'Awaiting approval':'Completed';activity(d,`${task.role} finished a demo task`,'/app/agents');}catch(e){Object.assign(d,before);d.runs.find(x=>x.id===id)!.status='Failed';failure=e instanceof Error?e.message:'Task could not finish. Retry the saved draft.';}});setToast(failure||'Your draft is ready to review.');return;}
   change(d=>{const t=d.runs.find(x=>x.id===id)!;t.step++;t.status='Running';});advance(id,retry);
  },delay);timers.current.set(id,timer);
 }
 function run(role:string,request:string,steps:string[],complete:(s:State)=>string|void){const id=uid('run');handlers.current.set(id,complete);change(d=>{d.runs.unshift({id,role,request,steps,status:'Queued',step:0,artifact:'',date:d.simulatedDate});});advance(id);}
 function retryRun(id:string){if(!handlers.current.has(id)){setToast('This task was interrupted by a reload. Open its module and submit the saved draft again.');return;}change(d=>{const r=d.runs.find(x=>x.id===id)!;r.status='Queued';r.step=0;});advance(id,true);}
 function cancelRun(id:string){clearTimeout(timers.current.get(id));change(d=>{const r=d.runs.find(x=>x.id===id);if(r&&['Queued','Running','Failed','Needs input'].includes(r.status))r.status='Cancelled';});}
 function reset(){timers.current.forEach(clearTimeout);handlers.current.clear();blocked.current=false;const next=seed();current.current=next;setState(next);try{localStorage.setItem(KEY,JSON.stringify(next));setStorageError('');}catch{setStorageError('Browser storage unavailable. This demo will last for this tab only.');}setToast('Fresh start. Northwind is ready to explore.');}
 return <Context.Provider value={{state,change,notice:setToast,toast,storageError,reset,run,cancelRun,retryRun}}>{children}</Context.Provider>;
}
export const useStore=()=>useContext(Context);
