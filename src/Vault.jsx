import {useState} from 'react';import {Plus,Plane,Hotel,Ticket,FileText,CheckCircle2} from 'lucide-react';import {Sheet} from './Sheets';import {Files,dropFiles} from './Files';import {nid} from './data';
const CATS={voo:['Voos',Plane],hotel:['Hospedagem',Hotel],ingresso:['Ingressos',Ticket],outro:['Outros',FileText]};
const inp='mt-1 w-full rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac';
export function VaultList({X,setX,ev}){
  const [sel,setSel]=useState(null),[cat,setCat]=useState('all'),items=X.vault.filter(v=>(ev==null||v.ev===ev)&&(cat==='all'||v.cat===cat)),cur=X.vault.find(v=>v.id===sel);
  const patch=(id,p)=>setX(x=>({...x,vault:x.vault.map(v=>v.id===id?{...v,...p}:v)}));
  const add=()=>{const it={id:nid(),title:'',cat:'outro',note:'',ev:ev||null,files:[]};setX(x=>({...x,vault:[...x.vault,it]}));setSel(it.id)};
  const del=async v=>{await dropFiles(v.files);setX(x=>({...x,vault:x.vault.filter(y=>y.id!==v.id)}));setSel(null)};
  return <div>
    {ev==null&&<div className="flex gap-2 overflow-x-auto pb-2">{[['all','Tudo'],...Object.entries(CATS).map(([k,v])=>[k,v[0]])].map(([k,l])=><button key={k} onClick={()=>setCat(k)} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${cat===k?'bg-pink text-ink':'bg-card text-lilac'}`}>{l}</button>)}</div>}
    <div className="flex flex-col gap-2">{items.map(v=>{const Ic=CATS[v.cat][1];return <button key={v.id} onClick={()=>setSel(v.id)} className="rounded-3xl bg-card border-2 border-card2 p-3 flex items-center gap-3 text-left min-h-16"><Ic className="text-lilac shrink-0"/><div className="flex-1 min-w-0"><div className="font-extrabold text-[15px] truncate">{v.title||'Sem título'}</div><div className="text-xs text-mute truncate">{v.note||CATS[v.cat][0]}</div></div>
      {v.files.length?<span className="text-[11px] font-extrabold rounded-full bg-mint text-ink px-2 py-1 flex items-center gap-1"><CheckCircle2 size={12}/>{v.files.length} offline</span>:<span className="text-[11px] font-extrabold rounded-full bg-peach text-ink px-2 py-1">Anexar</span>}</button>})}
      {items.length===0&&<p className="text-sm text-mute py-3">Nada aqui ainda.</p>}</div>
    <button onClick={add} className="mt-3 w-full h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1"><Plus size={18}/>Adicionar {ev?'reserva ou ingresso':'documento'}</button>
    {cur&&<Sheet title="Documento" onClose={()=>setSel(null)}>
      <label className="block text-xs font-bold text-mute mt-3">Título<input value={cur.title} onChange={e=>patch(cur.id,{title:e.target.value})} className={inp+' h-12'}/></label>
      <label className="block text-xs font-bold text-mute mt-3">Tipo<select value={cur.cat} onChange={e=>patch(cur.id,{cat:e.target.value})} className={inp+' h-12'}>{Object.entries(CATS).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label>
      <label className="block text-xs font-bold text-mute mt-3">Anotações (código, portão, assento…)<textarea value={cur.note} onChange={e=>patch(cur.id,{note:e.target.value})} rows={3} className={inp+' py-2'}/></label>
      <div className="text-xs font-bold text-mute mt-3 mb-2">Arquivos (fotos ou PDF, salvos offline)</div><Files files={cur.files} max={8} onChange={f=>patch(cur.id,{files:f})}/>
      <div className="flex gap-2 mt-4"><button onClick={()=>del(cur)} className="flex-1 h-12 rounded-full bg-card2 text-pink font-extrabold">Excluir</button><button onClick={()=>setSel(null)} className="flex-1 h-12 rounded-full bg-pink text-ink font-extrabold">Pronto</button></div></Sheet>}</div>}
