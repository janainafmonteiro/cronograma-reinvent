import {useEffect,useState} from 'react';import {Paperclip,X,FileText} from 'lucide-react';import {putF,getF,delF} from './idb';import {nid} from './data';
export function Files({files,max,onChange}){
  const [urls,setUrls]=useState({}),[view,setView]=useState(null),sig=files.map(f=>f.id).join();
  useEffect(()=>{let off=false;const made=[];(async()=>{const o={};for(const f of files){try{const b=await getF(f.id);if(b){const u=URL.createObjectURL(b);made.push(u);o[f.id]=u}}catch{}}if(!off)setUrls(o)})();return()=>{off=true;made.forEach(u=>URL.revokeObjectURL(u))}},[sig]);
  const add=async e=>{const nf=[];for(const f of [...e.target.files].slice(0,max-files.length)){const id='f'+nid();try{await putF(id,f);nf.push({id,name:f.name,type:f.type})}catch{}}e.target.value='';onChange([...files,...nf])};
  const rm=async f=>{try{await delF(f.id)}catch{}onChange(files.filter(x=>x.id!==f.id))};
  return <div><div className="flex flex-wrap gap-3">{files.map(f=>{const u=urls[f.id],img=f.type.startsWith('image/');return <div key={f.id} className="relative">
    {img&&u?<button onClick={()=>setView(u)} aria-label={'Abrir '+f.name}><img src={u} alt={f.name} className="w-20 h-20 rounded-2xl object-cover"/></button>
      :<a href={u} target="_blank" rel="noopener" className="w-20 h-20 rounded-2xl bg-card2 flex flex-col items-center justify-center text-[10px] text-lilac p-1 text-center break-all"><FileText/>{f.name.slice(0,14)}</a>}
    <button aria-label="Remover anexo" onClick={()=>rm(f)} className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-pink text-ink flex items-center justify-center"><X size={16}/></button></div>})}
    {files.length<max&&<label className="w-20 h-20 rounded-2xl border-2 border-dashed border-lilac text-lilac flex flex-col items-center justify-center text-[11px] font-bold cursor-pointer"><Paperclip/>Anexar<input type="file" multiple accept="image/*,application/pdf" onChange={add} className="sr-only"/></label>}</div>
    {view&&<div className="fixed inset-0 z-[60] bg-black flex items-center justify-center" onClick={()=>setView(null)}><img src={view} alt="" className="max-w-full max-h-full object-contain"/></div>}</div>}
export const dropFiles=async fs=>{for(const f of fs){try{await delF(f.id)}catch{}}};
