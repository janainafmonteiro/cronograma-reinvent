import {useState} from 'react';import {Trash2,Plus} from 'lucide-react';import {Sheet} from './Sheets';import {nid} from './data';import {today} from './extras';
export const CATS=['Comida','Transporte','Compras','Outros'];
export const money=n=>'US$ '+n.toFixed(2);
export function QuickSpend({onClose,onAdd}){
  const [a,setA]=useState(''),[c,setC]=useState('Comida'),[n,setN]=useState(''),v=parseFloat(a.replace(',','.'));
  return <Sheet title="Novo gasto" onClose={onClose}>
    <label className="block text-xs font-bold text-mute mt-3">Valor (US$)<input autoFocus value={a} onChange={e=>setA(e.target.value)} inputMode="decimal" placeholder="0,00" className="mt-1 w-full h-14 rounded-2xl bg-card2 px-3 text-2xl font-extrabold text-white outline-none focus:ring-2 ring-lilac"/></label>
    <div className="flex flex-wrap gap-2 mt-3">{CATS.map(k=><button key={k} onClick={()=>setC(k)} className={`h-11 px-4 rounded-full text-sm font-extrabold ${c===k?'bg-pink text-ink':'bg-card2 text-lilac'}`}>{k}</button>)}</div>
    <input value={n} onChange={e=>setN(e.target.value)} placeholder="Nota (opcional)" aria-label="Nota" className="mt-3 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac"/>
    <button disabled={!(v>0)} onClick={()=>{onAdd({id:nid(),date:today(),amt:v,cat:c,note:n});onClose()}} className="mt-4 w-full h-12 rounded-full bg-pink text-ink font-extrabold disabled:opacity-40">Adicionar</button></Sheet>}
export default function Spend({X,setX}){
  const [d,setD]=useState(today()),[q,setQ]=useState(false),{limit,items}=X.spend,day=items.filter(i=>i.date===d),spent=day.reduce((a,i)=>a+i.amt,0),pct=limit>0?Math.min(100,spent/limit*100):0,total=items.reduce((a,i)=>a+i.amt,0);
  const set=f=>setX(x=>({...x,spend:f(x.spend)}));
  return <div className="flex flex-col gap-3">
    <div className="rounded-3xl bg-card p-4"><div className="flex gap-2 items-end"><label className="flex-1 text-xs font-bold text-mute">Dia<input type="date" value={d} onChange={e=>setD(e.target.value)} className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white"/></label>
      <label className="w-32 text-xs font-bold text-mute">Limite/dia (US$)<input type="number" inputMode="decimal" value={limit} onChange={e=>set(s=>({...s,limit:+e.target.value||0}))} className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white"/></label></div>
      <div className="mt-4 flex items-end justify-between"><div><div className="text-xs text-mute font-bold">Gasto no dia</div><div className="text-3xl font-extrabold">{money(spent)}</div></div><div className="text-right"><div className="text-xs text-mute font-bold">{limit-spent>=0?'Resta':'Passou'}</div><div className={`text-xl font-extrabold ${limit-spent>=0?'text-mint':'text-pink'}`}>{money(Math.abs(limit-spent))}</div></div></div>
      <div className="mt-2 h-3 rounded-full bg-card2 overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><div className={`h-full rounded-full ${pct<80?'bg-mint':pct<100?'bg-peach':'bg-pink'}`} style={{width:pct+'%'}}/></div>
      <div className="text-xs text-mute mt-2">Total da viagem registrado: {money(total)}</div></div>
    <button onClick={()=>setQ(true)} className="h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-1"><Plus size={18}/>Adicionar gasto</button>
    <div className="flex flex-col gap-2">{day.map(i=><div key={i.id} className="rounded-3xl bg-card p-3 flex items-center gap-3"><div className="flex-1 min-w-0"><div className="font-extrabold">{money(i.amt)} <span className="text-xs text-lilac font-bold">· {i.cat}</span></div>{i.note&&<div className="text-xs text-mute truncate">{i.note}</div>}</div><button aria-label="Excluir gasto" onClick={()=>set(s=>({...s,items:s.items.filter(x=>x.id!==i.id)}))} className="w-11 h-11 text-pink flex items-center justify-center"><Trash2 size={18}/></button></div>)}
      {day.length===0&&<p className="text-sm text-mute">Nenhum gasto neste dia.</p>}</div>
    {q&&<QuickSpend onClose={()=>setQ(false)} onAdd={i=>set(s=>({...s,items:[...s.items,{...i,date:d}]}))}/>}</div>}
