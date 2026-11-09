import {useEffect,useMemo,useRef,useState} from 'react';import L from 'leaflet';import 'leaflet/dist/leaflet.css';
import {ChevronLeft,ChevronRight,Navigation} from 'lucide-react';import {coordsFor} from './data';
const HOTEL=coordsFor('Treasure Island');
async function walk(a,b){const k='rv26r:'+a+';'+b;try{const c=JSON.parse(localStorage.getItem(k));if(c)return c}catch{}
  try{const r=await fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/foot/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`);const rt=(await r.json()).routes[0];
    const o={pts:rt.geometry.coordinates.map(c=>[c[1],c[0]]),min:Math.round(rt.duration/60),dist:Math.round(rt.distance)};try{localStorage.setItem(k,JSON.stringify(o))}catch{}return o}catch{return null}}
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export default function RouteView({days}){
  const ds=days.filter(d=>d.ev.length),[day,setDay]=useState(ds[0]?.id),[i,setI]=useState(0),[rt,setRt]=useState(null),el=useRef(),map=useRef(),lay=useRef();
  const {legs,skipped}=useMemo(()=>{const d=days.find(x=>x.id===day);if(!d)return{legs:[],skipped:0};let sk=0;const st=[{n:'Treasure Island (hotel)',t:'',c:HOTEL,inner:0}];
    d.ev.forEach(e=>{const c=coordsFor(e.loc);if(!c){sk++;return}st.push({n:e.ti,t:e.t,c,inner:e.c||0,m:e.m})});
    if(!same(st[st.length-1].c,HOTEL))st.push({n:'Voltar ao hotel',t:'',c:HOTEL,inner:0});
    const L2=[];for(let k=1;k<st.length;k++)if(!same(st[k-1].c,st[k].c))L2.push({a:st[k-1],b:st[k]});return{legs:L2,skipped:sk}},[days,day]);
  const leg=legs[Math.min(i,legs.length-1)];
  useEffect(()=>{setI(0)},[day]);
  useEffect(()=>{map.current=L.map(el.current,{zoomControl:false}).setView([36.115,-115.17],14);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17,attribution:'© OpenStreetMap'}).addTo(map.current);lay.current=L.layerGroup().addTo(map.current);return()=>map.current.remove()},[]);
  useEffect(()=>{setRt(null);if(!leg)return;let off=false;walk(leg.a.c,leg.b.c).then(r=>{if(!off)setRt(r||false)});return()=>{off=true}},[leg&&leg.a.c+''+leg.b.c]);
  useEffect(()=>{lay.current.clearLayers();if(!leg)return;const pts=rt&&rt.pts?rt.pts:[leg.a.c,leg.b.c];
    L.polyline(pts,{color:'#FFCFA8',weight:5,dashArray:'4 10',lineCap:'round'}).addTo(lay.current);
    L.circleMarker(leg.a.c,{radius:9,color:'#A9EBD3',weight:4,fillColor:'#1E1A2E',fillOpacity:1}).bindTooltip('A',{permanent:true,direction:'top'}).addTo(lay.current);
    L.circleMarker(leg.b.c,{radius:9,color:'#FFB8D1',weight:4,fillColor:'#1E1A2E',fillOpacity:1}).bindTooltip('B',{permanent:true,direction:'top'}).addTo(lay.current);
    map.current.fitBounds(pts,{padding:[50,50],maxZoom:17})},[leg,rt]);
  const street=rt?rt.min:leg&&leg.b.m!=null?leg.b.m:null,inner=leg?leg.b.inner:0;
  return <div className="px-4 pt-3">
    <div className="flex gap-2 overflow-x-auto pb-2">{ds.map(d=><button key={d.id} onClick={()=>setDay(d.id)} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${day===d.id?'bg-pink text-ink':'bg-card text-lilac'}`}>{d.label.slice(0,6)}</button>)}</div>
    <div ref={el} className="rounded-3xl overflow-hidden border-2 border-card2" style={{height:'calc(100dvh - 470px)',minHeight:220}} role="application" aria-label="Mapa da rota"/>
    {leg?<div className="flex gap-2 mt-3 items-stretch">
      <button aria-label="Rota anterior" onClick={()=>setI(Math.max(0,i-1))} disabled={i===0} className="w-14 rounded-3xl bg-card2 text-lilac flex items-center justify-center disabled:opacity-30"><ChevronLeft size={30}/></button>
      <div className="flex-1 min-w-0 rounded-3xl bg-card p-3 border-2 border-card2">
        <div className="text-[11px] font-extrabold text-pink">PASSO {Math.min(i,legs.length-1)+1} DE {legs.length}</div>
        <div className="text-sm mt-1 leading-snug"><b className="text-mint">A</b> {leg.a.n}{leg.a.t&&<span className="text-mute"> · {leg.a.t}</span>}</div>
        <div className="text-sm leading-snug"><b className="text-pink">B</b> {leg.b.n}{leg.b.t&&<span className="text-mute"> · {leg.b.t}</span>}</div>
        <div className="flex flex-wrap gap-1.5 mt-2 text-xs font-extrabold"><span className="rounded-full bg-sky text-ink px-2 py-1">Rua {street==null?'?':street+' min'}</span><span className="rounded-full bg-peach text-ink px-2 py-1">+{inner} min por dentro</span><span className="rounded-full bg-lilac text-ink px-2 py-1">Total {street==null?'?':street+inner+' min'}</span>{rt&&<span className="rounded-full bg-card2 text-mute px-2 py-1">{rt.dist} m</span>}</div>
        <p className="text-[11px] text-mute mt-2 leading-snug">{rt===false?'Sem internet ou rota indisponível: linha reta aproximada e minutos do card. ':''}Rua: caminho a pé do OpenStreetMap. Por dentro: valor do card (a IA ajusta).</p>
        <a href={`https://www.google.com/maps/dir/?api=1&origin=${leg.a.c}&destination=${leg.b.c}&travelmode=walking`} target="_blank" rel="noopener" className="mt-2 h-11 px-4 rounded-full bg-sky text-ink font-extrabold text-sm inline-flex items-center gap-1"><Navigation size={16}/>Abrir no Google Maps</a></div>
      <button aria-label="Próxima rota" onClick={()=>setI(Math.min(legs.length-1,i+1))} disabled={i>=legs.length-1} className="w-14 rounded-3xl bg-card2 text-lilac flex items-center justify-center disabled:opacity-30"><ChevronRight size={30}/></button></div>
     :<p className="text-sm text-mute mt-3">Este dia não tem trechos com local conhecido no mapa.</p>}
    {skipped>0&&<p className="text-xs text-mute mt-2">{skipped} evento(s) sem local no mapa foram ignorados (ex.: “Local a confirmar”). Edite o local do card para incluir.</p>}</div>;
}
