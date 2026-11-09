import {useEffect,useMemo,useRef,useState} from 'react';import L from 'leaflet';import 'leaflet/dist/leaflet.css';
import {ChevronLeft,ChevronRight,Navigation,ListOrdered,ChevronDown} from 'lucide-react';import {coordsFor} from './data';import {Sheet} from './Sheets';
const HOTEL=coordsFor('Treasure Island');
async function walk(a,b){const k='rv26r:'+a+';'+b;try{const c=JSON.parse(localStorage.getItem(k));if(c)return c}catch{}
  try{const r=await fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/foot/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`);const rt=(await r.json()).routes[0];
    const o={pts:rt.geometry.coordinates.map(c=>[c[1],c[0]]),min:Math.round(rt.duration/60),dist:Math.round(rt.distance)};try{localStorage.setItem(k,JSON.stringify(o))}catch{}return o}catch{return null}}
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
const pin=c=>L.divIcon({className:'',iconSize:[30,40],iconAnchor:[15,39],html:`<svg width="30" height="40" viewBox="0 0 30 40"><path d="M15 39C15 39 2 24 2 14a13 13 0 0126 0c0 10-13 25-13 25z" fill="${c}" stroke="#1E1A2E" stroke-width="2"/><circle cx="15" cy="14" r="5" fill="#1E1A2E"/></svg>`});
export default function RouteView({days}){
  const ds=days.filter(d=>d.ev.length),[day,setDay]=useState(ds[0]?.id),[i,setI]=useState(0),[rt,setRt]=useState(null),[open,setOpen]=useState(false),[list,setList]=useState(false),el=useRef(),map=useRef(),lay=useRef(),y0=useRef(0);
  const {legs,skipped}=useMemo(()=>{const d=days.find(x=>x.id===day);if(!d)return{legs:[],skipped:0};let sk=0;const st=[{n:'Treasure Island (hotel)',t:'',c:HOTEL,inner:0}];
    d.ev.forEach(e=>{const c=coordsFor(e.loc);if(!c){sk++;return}st.push({n:e.ti,t:e.t,c,inner:e.c||0,m:e.m})});
    if(!same(st[st.length-1].c,HOTEL))st.push({n:'Voltar ao hotel',t:'',c:HOTEL,inner:0});
    const out=[];for(let k=1;k<st.length;k++)if(!same(st[k-1].c,st[k].c))out.push({a:st[k-1],b:st[k]});return{legs:out,skipped:sk}},[days,day]);
  const idx=Math.min(i,Math.max(legs.length-1,0)),leg=legs[idx];
  useEffect(()=>{setI(0)},[day]);
  useEffect(()=>{map.current=L.map(el.current,{zoomControl:false,attributionControl:false}).setView([36.115,-115.17],14);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17}).addTo(map.current);lay.current=L.layerGroup().addTo(map.current);return()=>map.current.remove()},[]);
  useEffect(()=>{setRt(null);if(!leg)return;let off=false;walk(leg.a.c,leg.b.c).then(r=>{if(!off)setRt(r||false)});return()=>{off=true}},[leg&&leg.a.c+''+leg.b.c]);
  useEffect(()=>{lay.current.clearLayers();if(!leg)return;const pts=rt&&rt.pts?rt.pts:[leg.a.c,leg.b.c];
    L.polyline(pts,{color:'#FF4D4D',weight:2,dashArray:'3 6',opacity:.95}).addTo(lay.current);
    L.marker(leg.a.c,{icon:pin('#D9D9E3')}).addTo(lay.current);L.marker(leg.b.c,{icon:pin('#4ADE80')}).addTo(lay.current);
    map.current.fitBounds(pts,{paddingTopLeft:[40,190],paddingBottomRight:[40,230],maxZoom:17})},[leg,rt]);
  const street=rt?rt.min:leg&&leg.b.m!=null?leg.b.m:null,inner=leg?leg.b.inner:0,total=street==null?null:street+inner;
  const dh={onPointerDown:e=>{y0.current=e.clientY},onPointerUp:e=>{const dy=y0.current-e.clientY;setOpen(Math.abs(dy)>24?dy>0:!open)},onKeyDown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setOpen(!open)}}};
  const nb=(d,Ic,l,dis)=><button aria-label={l} onClick={()=>setI(Math.max(0,Math.min(legs.length-1,idx+d)))} disabled={dis} className="w-12 h-12 shrink-0 rounded-full bg-lilac text-ink flex items-center justify-center disabled:opacity-30 active:scale-95"><Ic size={26}/></button>;
  return <>
    <div ref={el} className="fixed inset-0 z-0" role="application" aria-label="Mapa da rota"/>
    <div className="fixed inset-x-0 z-20 mx-auto max-w-md px-3" style={{top:'calc(10px + env(safe-area-inset-top,0px))'}}>
      <div className="rounded-3xl bg-ink/95 backdrop-blur border-2 border-card2 shadow-2xl p-2">
        <div className="flex gap-2 overflow-x-auto">{ds.map(d=><button key={d.id} onClick={()=>setDay(d.id)} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${day===d.id?'bg-pink text-ink':'bg-card text-lilac'}`}>{d.label.slice(0,6)}</button>)}</div>
        <button onClick={()=>setList(true)} disabled={!leg} className="mt-2 w-full min-h-12 rounded-2xl bg-card px-3 py-2 flex items-center gap-2 text-left" aria-label="Ver todos os passos">
          <div className="flex-1 min-w-0 text-sm leading-snug">{leg?<><div className="truncate"><b className="text-[#D9D9E3]">A:</b> {leg.a.n}</div><div className="truncate"><b className="text-[#4ADE80]">B:</b> {leg.b.n}</div></>:<span className="text-mute">Sem trechos neste dia</span>}</div>
          <ListOrdered size={22} className="text-lilac shrink-0"/></button></div></div>
    {leg&&<div className="fixed inset-x-0 z-20 mx-auto max-w-md px-3" style={{bottom:'calc(72px + env(safe-area-inset-bottom,0px))'}}>
      <div className="rounded-3xl bg-ink/95 backdrop-blur border-2 border-card2 shadow-2xl overflow-hidden">
        <div role="button" tabIndex={0} aria-label={open?'Recolher detalhes':'Expandir detalhes'} {...dh} className="h-8 flex items-center justify-center touch-none cursor-grab"><i className="w-10 h-1.5 rounded-full bg-mute/60"/></div>
        <div className="flex items-center gap-2 px-3 pb-3">{nb(-1,ChevronLeft,'Passo anterior',idx===0)}
          <div role="button" tabIndex={0} {...dh} className="flex-1 min-w-0 text-center touch-none"><div className="text-[11px] font-extrabold text-pink">PASSO {idx+1} DE {legs.length}</div>
            <div className="text-sm font-extrabold">Total: {total==null?'?':total+' min'}{rt&&<span className="text-mute font-semibold"> · {rt.dist} m</span>}</div></div>
          {nb(1,ChevronRight,'Próximo passo',idx>=legs.length-1)}</div>
        <div style={{display:'grid',gridTemplateRows:open?'1fr':'0fr',transition:'grid-template-rows .25s ease'}}><div className="overflow-hidden"><div className="px-3 pb-3">
          <div className="text-sm leading-snug"><b className="text-[#D9D9E3]">A</b> {leg.a.n}{leg.a.t&&<span className="text-mute"> · {leg.a.t}</span>}</div>
          <div className="text-sm leading-snug"><b className="text-[#4ADE80]">B</b> {leg.b.n}{leg.b.t&&<span className="text-mute"> · {leg.b.t}</span>}</div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs font-extrabold"><div className="rounded-2xl bg-sky text-ink py-2">Rua<div className="text-base">{street==null?'?':street+' min'}</div></div><div className="rounded-2xl bg-peach text-ink py-2">Por dentro<div className="text-base">+{inner} min</div></div><div className="rounded-2xl bg-lilac text-ink py-2">Total<div className="text-base">{total==null?'?':total+' min'}</div></div></div>
          <p className="text-[11px] text-mute mt-2 leading-snug">{rt===false?'Sem internet ou rota indisponível: linha reta aproximada e minutos do card. ':''}Rua: caminho a pé do OpenStreetMap. Por dentro: valor do card (a IA ajusta). Mapa © OpenStreetMap.</p>
          <a href={`https://www.google.com/maps/dir/?api=1&origin=${leg.a.c}&destination=${leg.b.c}&travelmode=walking`} target="_blank" rel="noopener" className="mt-3 h-14 rounded-full bg-pink text-ink font-extrabold text-base flex items-center justify-center gap-2"><Navigation size={20}/>Abrir no Google Maps</a>
          <button onClick={()=>setOpen(false)} className="mt-2 w-full h-11 text-mute text-sm font-bold flex items-center justify-center gap-1"><ChevronDown size={16}/>Recolher</button></div></div></div></div></div>}
    {list&&<Sheet title="Passos do dia" onClose={()=>setList(false)}><div className="flex flex-col gap-2 mt-2">{legs.map((l,k)=><button key={k} onClick={()=>{setI(k);setList(false)}} className={`rounded-2xl p-3 text-left text-sm leading-snug ${k===idx?'bg-pink text-ink':'bg-card2'}`}><b>{k+1}.</b> {l.a.n} → {l.b.n}{l.b.t&&<span className="opacity-70"> · {l.b.t}</span>}</button>)}
      {skipped>0&&<p className="text-xs text-mute">{skipped} evento(s) sem local no mapa foram ignorados (ex.: “Local a confirmar”). Edite o local do card para incluir.</p>}</div></Sheet>}
  </>;
}
