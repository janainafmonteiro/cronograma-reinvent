import {useState} from 'react';import {Sparkles,Trash2,Plus} from 'lucide-react';import {PL,match,nid} from './data';
export default function Wishlist({S,upd}){
  const {days,wish}=S,[nw,setNw]=useState(''),[wa,setWa]=useState(null),[ld,setLd]=useState(false);
  const all=days.flatMap(d=>d.ev),inS=w=>all.some(e=>match(w,e));
  const run=()=>{setLd(true);setTimeout(()=>{const r={};wish.forEach(w=>{const ev=all.find(e=>match(w,e));
    r[w.id]=!ev?(w.p==='must'?['bad','Indispensável e fora do cronograma. Cabe em Ter 01 Dez, 16:30–17:30 (tempo livre).']:w.p==='want'?['warn','Ainda não está no cronograma. Cabe em Qua 02 Dez, 15:30–16:30 se encurtar o networking da Expo.']:['ok','Só entra se sobrar tempo. Hoje não há janela confortável.']):((w.p==='opt'||w.p==='time')&&ev.n&&ev.n[0]!=='ok'?['warn','Sugiro excluir: é opcional e tem conflito de horário ou deslocamento.']:['ok','Está no cronograma. Nada a mudar.'])});setWa(r);setLd(false)},1600)};
  return <main className="px-4 pt-4">
    <button onClick={run} disabled={ld} className="w-full h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-2"><Sparkles size={18}/>{ld?'Analisando a lista…':'IA: analisar lista e cronograma'}</button>
    <form className="flex gap-2 mt-3" onSubmit={e=>{e.preventDefault();const n=nw.trim();if(!n)return;upd(p=>({...p,wish:[...p.wish,{id:nid(),name:n,k:n,p:'want'}]}));setNw('')}}>
      <input value={nw} onChange={e=>setNw(e.target.value)} aria-label="Novo item" placeholder="Algo para fazer em Las Vegas" className="flex-1 h-12 rounded-full bg-card px-4 text-[16px] outline-none focus:ring-2 ring-lilac placeholder-mute"/>
      <button aria-label="Adicionar" className="w-12 h-12 rounded-full bg-peach text-ink flex items-center justify-center"><Plus/></button></form>
    <div className="flex flex-col gap-2.5 mt-3">{['must','want','opt','time'].flatMap(p=>wish.filter(w=>w.p===p)).map(w=>{const a=wa&&wa[w.id],ok=inS(w);return <div key={w.id} className="rounded-3xl bg-card p-3 border-2 border-card2">
      <div className="flex justify-between gap-2"><div className="font-extrabold text-[15px]">{w.name}</div><button aria-label="Excluir item" onClick={()=>upd(p=>({...p,wish:p.wish.filter(x=>x.id!==w.id)}))} className="w-11 h-11 -mt-2 -mr-1 shrink-0 text-pink flex items-center justify-center"><Trash2 size={18}/></button></div>
      <div className="flex items-center gap-2 flex-wrap"><span className={`text-[11px] font-extrabold rounded-full px-2 py-1 ${ok?'bg-mint text-ink':'bg-card2 text-peach border border-peach'}`}>{ok?'Está no cronograma':'Fora do cronograma'}</span>
        <select aria-label="Prioridade" value={w.p} onChange={e=>upd(p=>({...p,wish:p.wish.map(x=>x.id===w.id?{...x,p:e.target.value}:x)}))} className="h-11 rounded-full bg-card2 px-3 text-sm font-bold text-lilac">{Object.keys(PL).map(k=><option key={k} value={k}>{PL[k]}</option>)}</select></div>
      {a&&<div className={`mt-2 rounded-2xl px-3 py-2 text-xs leading-snug ${a[0]==='bad'?'bg-pink/15 text-pink':a[0]==='warn'?'bg-peach/15 text-peach':'bg-mint/15 text-mint'}`}><b>IA:</b> {a[1]}</div>}</div>})}</div></main>;
}
