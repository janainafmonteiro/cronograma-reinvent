import {useRef,useState} from 'react';import {Sparkles,Trash2,Plus,Check,Undo2} from 'lucide-react';import {PL,match,nid,TRIP} from './data';import {Sheet} from './Sheets';import {today} from './extras';
function Swipe({onRight,onLeft,canRight,canLeft,children}){
  const [dx,setDx]=useState(0),st=useRef(null);
  const down=e=>{st.current={x:e.clientX,y:e.clientY,on:false}};
  const move=e=>{const s=st.current;if(!s)return;const d=e.clientX-s.x;if(!s.on){if(Math.abs(d)>8&&Math.abs(d)>Math.abs(e.clientY-s.y)){s.on=true;e.currentTarget.setPointerCapture(e.pointerId)}else return}
    setDx(Math.max(canLeft?-140:0,Math.min(canRight?140:0,d)))};
  const up=()=>{const s=st.current;st.current=null;if(s&&s.on){if(dx>90&&canRight)onRight();else if(dx<-90&&canLeft)onLeft()}setDx(0)};
  return <div className="relative rounded-3xl overflow-hidden">
    <div className={`absolute inset-0 flex items-center px-5 ${dx>0?'bg-mint text-ink justify-start':'bg-card2 text-lilac justify-end'}`} aria-hidden="true">{dx>0?<Check size={28}/>:dx<0?<Undo2 size={26}/>:null}</div>
    <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>{st.current=null;setDx(0)}} style={{transform:`translateX(${dx}px)`,transition:dx===0?'transform .2s':'none',touchAction:'pan-y'}} className="relative bg-card border-2 border-card2 rounded-3xl">{children}</div></div>}
export default function Wishlist({S,upd}){
  const {days,wish}=S,[f,setF]=useState('pend'),[nw,setNw]=useState(''),[wa,setWa]=useState(null),[ld,setLd]=useState(false),[ask,setAsk]=useState(null);
  const evs=days.flatMap(d=>d.ev.map(e=>({...e,day:d}))),where=w=>days.filter(d=>d.ev.some(e=>match(w,e))).map(d=>d.label.slice(0,6)).join(', ');
  const total=wish.length,doneN=wish.filter(w=>w.done).length;
  const setDone=(w,done)=>{upd(p=>({...p,wish:p.wish.map(x=>x.id===w.id?{...x,done,doneAt:done?Date.now():null}:x)}));navigator.vibrate?.(done?[15,40,15]:10);
    if(done){const td=TRIP[today()],list=evs.filter(e=>match(w,e)&&e.day.id!==td);if(list.length)setAsk({w,list})}};
  const run=()=>{setLd(true);setTimeout(()=>{const r={};wish.forEach(w=>{const ev=evs.find(e=>match(w,e));
    r[w.id]=w.done?['ok','Já feita.']:!ev?(w.p==='must'?['bad','Indispensável e fora do cronograma. Cabe em Ter 01 Dez, 16:30–17:30 (tempo livre).']:w.p==='want'?['warn','Ainda não está no cronograma. Cabe em Qua 02 Dez, 15:30–16:30 se encurtar o networking da Expo.']:['ok','Só entra se sobrar tempo. Hoje não há janela confortável.']):((w.p==='opt'||w.p==='time')&&ev.n&&ev.n[0]!=='ok'?['warn','Sugiro excluir: é opcional e tem conflito de horário ou deslocamento.']:['ok','Está no cronograma. Nada a mudar.'])});setWa(r);setLd(false)},1400)};
  const order=['must','want','opt','time'],list=wish.filter(w=>f==='all'||(f==='done')===!!w.done).slice().sort((a,b)=>(a.done?1:0)-(b.done?1:0)||order.indexOf(a.p)-order.indexOf(b.p));
  return <main className="px-4 pt-4">
    <div className="rounded-3xl bg-card p-4"><div className="flex items-end justify-between"><div className="text-2xl font-extrabold">{doneN} <span className="text-base text-mute font-bold">de {total} experiências</span></div></div>
      <div className="mt-2 h-3 rounded-full bg-card2 overflow-hidden" role="progressbar" aria-valuenow={doneN} aria-valuemin={0} aria-valuemax={total}><div className="h-full rounded-full bg-mint" style={{width:(total?doneN/total*100:0)+'%'}}/></div>
      <p className="text-xs text-mute mt-2">Deslize para a direita para concluir. Concluir vale para a viagem toda: a atração some das pendências em qualquer dia.</p></div>
    <div className="flex gap-1 bg-card rounded-full p-1 mt-3">{[['pend','Pendentes'],['done','Feitas'],['all','Todas']].map(([k,l])=><button key={k} onClick={()=>setF(k)} className={`flex-1 h-10 rounded-full text-sm font-extrabold ${f===k?'bg-lilac text-ink':'text-mute'}`}>{l}</button>)}</div>
    <button onClick={run} disabled={ld} className="mt-3 w-full h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-2"><Sparkles size={18}/>{ld?'Analisando a lista…':'IA: analisar lista e cronograma'}</button>
    <form className="flex gap-2 mt-3" onSubmit={e=>{e.preventDefault();const n=nw.trim();if(!n)return;upd(p=>({...p,wish:[...p.wish,{id:nid(),name:n,k:n,p:'want',done:false,man:true}]}));setNw('')}}>
      <input value={nw} onChange={e=>setNw(e.target.value)} aria-label="Nova experiência" placeholder="Nova experiência para a lista" className="flex-1 h-12 rounded-full bg-card px-4 text-[16px] outline-none focus:ring-2 ring-lilac placeholder-mute"/>
      <button aria-label="Adicionar" className="w-12 h-12 rounded-full bg-peach text-ink flex items-center justify-center"><Plus/></button></form>
    <div className="flex flex-col gap-2.5 mt-3">{list.map(w=>{const a=wa&&wa[w.id],at=where(w);return <Swipe key={w.id} canRight={!w.done} canLeft={!!w.done} onRight={()=>setDone(w,true)} onLeft={()=>setDone(w,false)}>
      <div className={`p-3 flex gap-2 ${w.done?'opacity-70':''}`}>
        <button aria-label={w.done?'Desmarcar como feita':'Marcar como feita'} onClick={()=>setDone(w,!w.done)} className={`w-11 h-11 shrink-0 rounded-full border-2 flex items-center justify-center ${w.done?'bg-mint border-mint text-ink':'border-lilac text-transparent'}`}><Check/></button>
        <div className="flex-1 min-w-0"><div className={`font-extrabold text-[15px] ${w.done?'line-through':''}`}>{w.name}</div>
          <div className="flex items-center gap-2 flex-wrap mt-1"><span className={`text-[11px] font-extrabold rounded-full px-2 py-1 ${w.done?'bg-mint text-ink':at?'bg-card2 text-sky':'bg-card2 text-peach border border-peach'}`}>{w.done?`Feita${w.doneAt?' em '+new Date(w.doneAt).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}):''}`:at?`No roteiro: ${at}`:'Fora do cronograma'}</span>
            <select aria-label="Prioridade" value={w.p} onChange={e=>upd(p=>({...p,wish:p.wish.map(x=>x.id===w.id?{...x,p:e.target.value}:x)}))} className="h-11 rounded-full bg-card2 px-3 text-sm font-bold text-lilac">{Object.keys(PL).map(k=><option key={k} value={k}>{PL[k]}</option>)}</select></div>
          {a&&<div className={`mt-2 rounded-2xl px-3 py-2 text-xs leading-snug ${a[0]==='bad'?'bg-pink/15 text-pink':a[0]==='warn'?'bg-peach/15 text-peach':'bg-mint/15 text-mint'}`}><b>IA:</b> {a[1]}</div>}</div>
        <button aria-label="Excluir item" onClick={()=>upd(p=>({...p,wish:p.wish.filter(x=>x.id!==w.id)}))} className="w-11 h-11 shrink-0 text-pink flex items-center justify-center"><Trash2 size={18}/></button></div></Swipe>})}
      {list.length===0&&<p className="text-sm text-mute py-3">{f==='done'?'Nada concluído ainda.':'Nenhuma experiência pendente.'}</p>}</div>
    {ask&&<Sheet title="Já está feita" onClose={()=>setAsk(null)}><p className="text-sm mt-2 leading-snug">“{ask.w.name}” também está planejada em:</p>
      <ul className="mt-2 text-sm text-lilac">{ask.list.map(e=><li key={e.id}>• {e.day.label} · {e.t}</li>)}</ul><p className="text-sm mt-2 text-mute">Quer remover do roteiro e liberar o horário?</p>
      <div className="flex gap-2 mt-4"><button onClick={()=>setAsk(null)} className="flex-1 h-12 rounded-full bg-card2 font-extrabold">Manter</button><button onClick={()=>{const ids=new Set(ask.list.map(e=>e.id));upd(p=>({...p,days:p.days.map(d=>({...d,ev:d.ev.filter(e=>!ids.has(e.id))}))}));setAsk(null)}} className="flex-1 h-12 rounded-full bg-pink text-ink font-extrabold">Remover</button></div></Sheet>}</main>}
