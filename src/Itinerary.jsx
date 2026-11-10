import {useState,useEffect,useMemo,useRef} from 'react';
import {DndContext,DragOverlay,PointerSensor,useSensor,useSensors,closestCenter,useDroppable} from '@dnd-kit/core';
import {SortableContext,verticalListSortingStrategy,arrayMove} from '@dnd-kit/sortable';
import {Clock} from 'lucide-react';import {SortableCard,CardView} from './Card';import {Sheet} from './Sheets';import {conflicts,reflowAll,countChanged} from './schedule';
function Day({d,onAdjust,children}){
  const {setNodeRef}=useDroppable({id:d.id});
  return <section id={d.id} data-day={d.id} className="pt-4" style={{scrollMarginTop:128}}>
    <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-extrabold text-peach">{d.label} <span className="text-xs text-mute font-semibold">· {d.ev.length} eventos</span></h2>
      {d.ev.length>1&&<button onClick={onAdjust} className="h-11 px-3 rounded-full bg-card text-lilac text-xs font-extrabold flex items-center gap-1"><Clock size={14}/>Ajustar horários</button>}</div>
    <SortableContext items={d.ev.map(e=>e.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[72px]">{children}
        {d.ev.length===0&&<div className="rounded-3xl border-2 border-dashed border-card2 text-mute text-sm text-center py-5">Solte um card aqui</div>}</div>
    </SortableContext></section>;
}
export default function Itinerary({days,setDays,ck,an,fresh,onEdit,onDel,onMap,onDetail,onToggleFx,onFlow,onDropped}){
  const [open,setOpen]=useState(null),[act,setAct]=useState(null),[cur,setCur]=useState(days[0].id),[adj,setAdj]=useState(null),start=useRef(null);
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:4}}));
  const cf=useMemo(()=>Object.assign({},...days.map(d=>conflicts(d.ev))),[days]);
  const find=id=>days.find(d=>d.id===id||d.ev.some(e=>e.id===id));
  const pos=(ds,id)=>{for(const d of ds){const i=d.ev.findIndex(e=>e.id===id);if(i>=0)return d.id+':'+i}return null};
  useEffect(()=>{const io=new IntersectionObserver(es=>{const v=es.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(v)setCur(v.target.dataset.day)},{rootMargin:'-120px 0px -70% 0px'});
    document.querySelectorAll('[data-day]').forEach(n=>io.observe(n));return()=>io.disconnect()},[days.length]);
  const over=({active,over:o})=>{if(!o)return;const a=find(active.id),b=find(o.id);if(!a||!b||a.id===b.id)return;
    setDays(p=>{const item=a.ev.find(e=>e.id===active.id),i=b.ev.findIndex(e=>e.id===o.id),idx=i>=0?i:b.ev.length;
      return p.map(d=>d.id===a.id?{...d,ev:d.ev.filter(e=>e.id!==active.id)}:d.id===b.id?{...d,ev:[...d.ev.slice(0,idx),item,...d.ev.slice(idx)]}:d)})};
  const end=({active,over:o})=>{setAct(null);let nd=days;
    if(o){const a=find(active.id);if(a){const i=a.ev.findIndex(e=>e.id===active.id),j=a.ev.findIndex(e=>e.id===o.id);if(j>=0&&i!==j)nd=days.map(d=>d.id===a.id?{...d,ev:arrayMove(d.ev,i,j)}:d)}}
    if(pos(nd,active.id)!==start.current){const r=reflowAll(nd,{snapId:active.id}),n=countChanged(nd,r);nd=r;onDropped&&onDropped(n)}
    if(nd!==days)setDays(()=>nd)};
  const ae=act&&days.flatMap(d=>d.ev).find(e=>e.id===act);
  return <>
    <nav className="sticky z-10 bg-ink/95 backdrop-blur px-4 py-2 flex gap-2 overflow-x-auto" style={{top:'calc(56px + env(safe-area-inset-top,0px))'}} aria-label="Dias">
      {days.map(d=><button key={d.id} onClick={()=>document.getElementById(d.id).scrollIntoView({behavior:'smooth'})} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${cur===d.id?'bg-pink text-ink':'bg-card text-lilac'}`}>{d.label.slice(0,6)}</button>)}</nav>
    <p className="px-4 pt-2 text-xs text-mute"><span className="rounded-full bg-pink text-ink px-1.5 py-0.5 font-extrabold text-[10px]">SWAG</span> Brilho rosa = brindes. Arraste pela alça: os horários flexíveis se ajustam sozinhos; o cadeado marca horário fixo.</p>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e=>{ck();setAct(e.active.id);start.current=pos(days,e.active.id)}} onDragOver={over} onDragEnd={end} onDragCancel={()=>setAct(null)}>
      <main className="px-4">{days.map(d=><Day key={d.id} d={d} onAdjust={()=>setAdj(d)}>{d.ev.map(e=><SortableCard key={e.id} e={e} an={an} cf={cf[e.id]} fresh={fresh===e.id} open={open===e.id} onToggle={()=>setOpen(open===e.id?null:e.id)} onEdit={()=>onEdit(e)} onDel={()=>onDel(e.id)} onMap={()=>onMap(e)} onDetail={()=>onDetail(e)} onToggleFx={()=>onToggleFx(e)}/>)}</Day>)}</main>
      <DragOverlay>{ae&&<CardView e={ae} an={an} handle={{}} style={{transform:'rotate(2deg)'}}/>}</DragOverlay>
    </DndContext>
    {adj&&<Sheet title={`Ajustar ${adj.label}`} onClose={()=>setAdj(null)}><div className="flex flex-col gap-3 mt-3">
      <button onClick={()=>{onFlow(adj.id,false);setAdj(null)}} className="rounded-3xl bg-card2 p-4 text-left"><div className="font-extrabold text-pink">Resolver conflitos</div><div className="text-xs text-mute mt-1">Empurra eventos flexíveis para depois só quando faltar tempo de deslocamento. Eventos fixos não mudam.</div></button>
      <button onClick={()=>{onFlow(adj.id,true);setAdj(null)}} className="rounded-3xl bg-card2 p-4 text-left"><div className="font-extrabold text-peach">Compactar o dia</div><div className="text-xs text-mute mt-1">Gruda cada evento flexível logo depois do anterior mais o deslocamento, eliminando buracos. Pode antecipar jantares e almoços.</div></button></div></Sheet>}</>;
}
