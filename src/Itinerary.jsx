import {useState,useEffect} from 'react';
import {DndContext,DragOverlay,PointerSensor,useSensor,useSensors,closestCenter,useDroppable} from '@dnd-kit/core';
import {SortableContext,verticalListSortingStrategy,arrayMove} from '@dnd-kit/sortable';
import {SortableCard,CardView} from './Card';
function Day({d,children}){
  const {setNodeRef}=useDroppable({id:d.id});
  return <section id={d.id} data-day={d.id} className="pt-4" style={{scrollMarginTop:128}}>
    <h2 className="text-lg font-extrabold text-peach mb-2">{d.label} <span className="text-xs text-mute font-semibold">· {d.ev.length} eventos</span></h2>
    <SortableContext items={d.ev.map(e=>e.id)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[72px]">{children}
        {d.ev.length===0&&<div className="rounded-3xl border-2 border-dashed border-card2 text-mute text-sm text-center py-5">Solte um card aqui</div>}</div>
    </SortableContext></section>;
}
export default function Itinerary({days,setDays,ck,an,fresh,onEdit,onDel,onMap,onDetail}){
  const [open,setOpen]=useState(null),[act,setAct]=useState(null),[cur,setCur]=useState(days[0].id);
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:4}}));
  const find=id=>days.find(d=>d.id===id||d.ev.some(e=>e.id===id));
  useEffect(()=>{const io=new IntersectionObserver(es=>{const v=es.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(v)setCur(v.target.dataset.day)},{rootMargin:'-120px 0px -70% 0px'});
    document.querySelectorAll('[data-day]').forEach(n=>io.observe(n));return()=>io.disconnect()},[days.length]);
  const over=({active,over:o})=>{if(!o)return;const a=find(active.id),b=find(o.id);if(!a||!b||a.id===b.id)return;
    setDays(p=>{const item=a.ev.find(e=>e.id===active.id),i=b.ev.findIndex(e=>e.id===o.id),idx=i>=0?i:b.ev.length;
      return p.map(d=>d.id===a.id?{...d,ev:d.ev.filter(e=>e.id!==active.id)}:d.id===b.id?{...d,ev:[...d.ev.slice(0,idx),item,...d.ev.slice(idx)]}:d)})};
  const end=({active,over:o})=>{setAct(null);if(!o)return;const a=find(active.id);if(!a)return;const i=a.ev.findIndex(e=>e.id===active.id),j=a.ev.findIndex(e=>e.id===o.id);
    if(j>=0&&i!==j)setDays(p=>p.map(d=>d.id===a.id?{...d,ev:arrayMove(d.ev,i,j)}:d))};
  const ae=act&&days.flatMap(d=>d.ev).find(e=>e.id===act);
  return <>
    <nav className="sticky z-10 bg-ink/95 backdrop-blur px-4 py-2 flex gap-2 overflow-x-auto" style={{top:'calc(56px + env(safe-area-inset-top,0px))'}} aria-label="Dias">
      {days.map(d=><button key={d.id} onClick={()=>document.getElementById(d.id).scrollIntoView({behavior:'smooth'})} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${cur===d.id?'bg-pink text-ink':'bg-card text-lilac'}`}>{d.label.slice(0,6)}</button>)}</nav>
    <p className="px-4 pt-2 text-xs text-mute"><span className="rounded-full bg-pink text-ink px-1.5 py-0.5 font-extrabold text-[10px]">SWAG</span> Brilho rosa = brindes. Toque no card para ver ações; segure a alça para arrastar.</p>
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={e=>{ck();setAct(e.active.id)}} onDragOver={over} onDragEnd={end} onDragCancel={()=>setAct(null)}>
      <main className="px-4">{days.map(d=><Day key={d.id} d={d}>{d.ev.map(e=><SortableCard key={e.id} e={e} an={an} fresh={fresh===e.id} open={open===e.id} onToggle={()=>setOpen(open===e.id?null:e.id)} onEdit={()=>onEdit(e)} onDel={()=>onDel(e.id)} onMap={()=>onMap(e)} onDetail={()=>onDetail(e)}/>)}</Day>)}</main>
      <DragOverlay>{ae&&<CardView e={ae} an={an} handle={{}} style={{transform:'rotate(2deg)'}}/>}</DragOverlay>
    </DndContext></>;
}
