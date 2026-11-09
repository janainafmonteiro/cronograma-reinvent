import {useState} from 'react';import {Plus,Trash2,Pencil,MessageSquareText,Copy,Search} from 'lucide-react';import {Sheet} from './Sheets';import {Files,dropFiles} from './Files';import {nid} from './data';import {today} from './extras';import {followAI,getCfg} from './ai';
const inp='mt-1 w-full rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac';
export default function People({X,setX}){
  const [sel,setSel]=useState(null),[q,setQ]=useState(''),[msg,setMsg]=useState(null),cur=X.people.find(p=>p.id===sel);
  const list=X.people.filter(p=>(p.name+' '+p.note).toLowerCase().includes(q.toLowerCase())).slice().reverse();
  const patch=(id,p)=>setX(x=>({...x,people:x.people.map(v=>v.id===id?{...v,...p}:v)}));
  const add=()=>{const p={id:nid(),name:'',note:'',date:today(),files:[]};setX(x=>({...x,people:[...x.people,p]}));setSel(p.id)};
  const del=async p=>{await dropFiles(p.files);setX(x=>({...x,people:x.people.filter(y=>y.id!==p.id)}));setSel(null)};
  const draft=async p=>{setMsg({p,t:'Gerando…'});const fb=`Hi ${p.name.split(' ')[0]||''}! It was great to meet you at AWS re:Invent. I really enjoyed our conversation. I’d love to stay in touch. Best, Janaina`;
    if(!getCfg().key){setMsg({p,t:fb});return}try{const r=await followAI(p.name,p.note);setMsg({p,t:r.message||fb})}catch{setMsg({p,t:fb,off:true})}};
  return <div className="flex flex-col gap-3">
    <div className="relative"><Search size={18} className="absolute left-4 top-3.5 text-mute"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome ou assunto" aria-label="Buscar" className="w-full h-12 rounded-full bg-card pl-11 pr-4 text-[16px] outline-none focus:ring-2 ring-lilac placeholder-mute"/></div>
    <button onClick={add} className="h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-1"><Plus size={18}/>Adicionar pessoa</button>
    {list.map(p=><div key={p.id} className="rounded-3xl bg-card border-2 border-card2 p-3"><div className="flex justify-between gap-2"><div className="min-w-0"><div className="font-extrabold">{p.name||'Sem nome'}</div><div className="text-[11px] text-mute">{p.date.split('-').reverse().join('/')}</div></div>
      <div className="flex"><button aria-label="Mensagem" onClick={()=>draft(p)} className="w-11 h-11 text-sky flex items-center justify-center"><MessageSquareText size={20}/></button><button aria-label="Editar" onClick={()=>setSel(p.id)} className="w-11 h-11 text-lilac flex items-center justify-center"><Pencil size={18}/></button></div></div>
      {p.note&&<p className="text-sm mt-1 leading-snug">{p.note}</p>}
      {p.files.length>0&&<div className="mt-2"><Files files={p.files} max={2} onChange={f=>patch(p.id,{files:f})}/></div>}</div>)}
    {list.length===0&&<p className="text-sm text-mute">Ninguém aqui ainda. Logo depois de conversar, anote o nome e o assunto.</p>}
    {cur&&<Sheet title="Pessoa" onClose={()=>setSel(null)}>
      <label className="block text-xs font-bold text-mute mt-3">Nome<input autoFocus value={cur.name} onChange={e=>patch(cur.id,{name:e.target.value})} className={inp+' h-12'}/></label>
      <label className="block text-xs font-bold text-mute mt-3">Sobre o que conversaram<textarea value={cur.note} onChange={e=>patch(cur.id,{note:e.target.value})} rows={3} placeholder="Ex: conversamos sobre o programa SBCL" className={inp+' py-2'}/></label>
      <div className="text-xs font-bold text-mute mt-3 mb-2">Fotos (QR code ou print do LinkedIn, até 2)</div><Files files={cur.files} max={2} onChange={f=>patch(cur.id,{files:f})}/>
      <div className="flex gap-2 mt-4"><button onClick={()=>del(cur)} className="flex-1 h-12 rounded-full bg-card2 text-pink font-extrabold flex items-center justify-center gap-1"><Trash2 size={16}/>Excluir</button><button onClick={()=>setSel(null)} className="flex-1 h-12 rounded-full bg-pink text-ink font-extrabold">Pronto</button></div></Sheet>}
    {msg&&<Sheet title={`Mensagem para ${msg.p.name||'contato'}`} onClose={()=>setMsg(null)}><p className="mt-3 text-[15px] leading-relaxed whitespace-pre-wrap">{msg.t}</p>{msg.off&&<p className="text-xs text-mute mt-2">Gemini indisponível: usei um modelo simples.</p>}
      <button onClick={()=>navigator.clipboard?.writeText(msg.t)} className="mt-4 w-full h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1"><Copy size={16}/>Copiar</button></Sheet>}</div>}
