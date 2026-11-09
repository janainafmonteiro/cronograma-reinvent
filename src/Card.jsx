import {useSortable} from '@dnd-kit/sortable';import {CSS} from '@dnd-kit/utilities';
import {GripVertical,MapPin,Footprints,Navigation,Pencil,Trash2} from 'lucide-react';
const ST={ok:['bg-mint text-ink','Viável','border-mint/60'],warn:['bg-peach text-ink','Apertado','border-peach'],bad:['bg-pink text-ink','Inviável','border-pink']};
export function CardView({e,an,open,fresh,handle,onToggle,onEdit,onDel,onMap,style,innerRef}){
  const s=an==='done'?(e.n?e.n[0]:'ok'):null,b=s&&ST[s],tot=(e.m||0)+(e.c||0);
  return <div ref={innerRef} data-eid={e.id} style={{...style,...(e.s?{boxShadow:'0 0 18px 3px rgba(255,184,209,.5)'}:{})}}
    className={`rounded-3xl bg-card border-2 ${b?b[2]:e.s?'border-pink/50':'border-card2'} ${fresh?'pop':''}`}>
    <div className="flex">
      <button aria-label="Segurar e arrastar" {...handle} className="w-12 shrink-0 flex items-center justify-center text-mute touch-none cursor-grab"><GripVertical size={22}/></button>
      <button onClick={onToggle} aria-expanded={open} className="flex-1 min-w-0 text-left py-3 pr-2">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-lilac flex-wrap">{e.t}{e.tn&&e.tn!==e.t&&<span className="text-peach">→ {e.tn}</span>}
          {e.s&&<span className="rounded-full bg-pink text-ink px-1.5 py-0.5 text-[10px]">SWAG</span>}
          {b&&<span className={`rounded-full px-2 py-0.5 text-[10px] ${b[0]}`}>{b[1]}</span>}</div>
        <div className="font-extrabold text-[15px] leading-tight mt-0.5">{e.ti}</div>
        <div className="flex items-center gap-1 text-xs text-mute mt-0.5"><MapPin size={12} className="shrink-0"/><span className="truncate">{e.loc}</span></div>
      </button>
      <div className="w-14 shrink-0 flex flex-col items-center justify-center text-sky text-[11px] font-bold leading-tight"><Footprints size={16}/>{e.m==null?'?':tot===0?'—':`${tot}′`}</div>
    </div>
    {open&&<div className="px-3 pb-3 pl-12">
      <div className="text-xs text-sky font-bold">{e.m==null?'Deslocamento ainda não calculado':`${e.m} min de rua + ${e.c||0} min por dentro dos hotéis`}</div>
      {an==='done'&&e.n&&<div className={`mt-2 rounded-2xl px-3 py-2 text-xs leading-snug ${e.n[0]==='bad'?'bg-pink/15 text-pink':'bg-peach/15 text-peach'}`}><b>IA:</b> {e.n[1]}</div>}
      <div className="flex gap-2 mt-3">
        <button onClick={onMap} className="h-11 px-4 rounded-full bg-sky text-ink font-extrabold text-sm flex items-center gap-1"><Navigation size={16}/>Mapa</button>
        <button aria-label="Editar" onClick={onEdit} className="h-11 w-11 rounded-full bg-card2 text-lilac flex items-center justify-center"><Pencil size={18}/></button>
        <button aria-label="Excluir" onClick={onDel} className="h-11 w-11 rounded-full bg-card2 text-pink flex items-center justify-center"><Trash2 size={18}/></button>
      </div></div>}
  </div>;
}
export function SortableCard(p){
  const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:p.e.id});
  return <CardView {...p} innerRef={setNodeRef} handle={{...attributes,...listeners}} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging?.3:1}}/>;
}
