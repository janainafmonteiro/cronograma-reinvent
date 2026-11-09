import {useState} from 'react';import {MapPin,Clock,Sparkles} from 'lucide-react';import {Sheet} from './Sheets';import {VaultList} from './Vault';import {tipsFor} from './tips';import {tipsAI,getCfg} from './ai';
export default function Detail({e,X,setX,onClose}){
  const t=tipsFor(e),[more,setMore]=useState([]),[ld,setLd]=useState(false),[err,setErr]=useState('');
  const ask=async()=>{setLd(true);setErr('');try{const r=await tipsAI(e);setMore(r.tips||[])}catch(x){setErr(x.message.slice(0,90))}setLd(false)};
  return <Sheet title={e.ti} onClose={onClose}>
    <div className="text-xs text-mute flex items-center gap-1 mt-1"><Clock size={13}/>{e.t}</div><div className="text-xs text-mute flex items-center gap-1"><MapPin size={13}/>{e.loc}</div>
    <h3 className="text-sm font-extrabold text-pink mt-4 mb-2">Reservas e ingressos</h3><VaultList X={X} setX={setX} ev={e.ti}/>
    <h3 className="text-sm font-extrabold text-pink mt-5 mb-2">Dicas de inglês · {t.title}</h3>
    <div className="flex flex-col gap-2">{[...t.list,...more].map((p,i)=><div key={i} className="rounded-2xl bg-card2 px-3 py-2"><div className="text-[15px] font-bold">{p.en}</div><div className="text-xs text-mute">{p.pt}</div></div>)}</div>
    {getCfg().key&&<button onClick={ask} disabled={ld} className="mt-3 w-full h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1 disabled:opacity-60"><Sparkles size={16}/>{ld?'Pensando…':'Mais frases para este evento (IA)'}</button>}
    {err&&<p className="text-xs text-pink mt-2">{err}</p>}</Sheet>}
