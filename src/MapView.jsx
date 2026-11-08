import {useEffect,useRef,useState} from 'react';import L from 'leaflet';import 'leaflet/dist/leaflet.css';
import {Download,WifiOff,Navigation} from 'lucide-react';import {coordsFor,gmap} from './data';
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const X=(lon,z)=>Math.floor((lon+180)/360*2**z),Y=(lat,z)=>{const r=lat*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z)};
export default function MapView({days,focus}){
  const el=useRef(),map=useRef(),layer=useRef(),[day,setDay]=useState('all'),[prog,setProg]=useState(null),[on,setOn]=useState(navigator.onLine);
  useEffect(()=>{const u=()=>setOn(navigator.onLine);addEventListener('online',u);addEventListener('offline',u);return()=>{removeEventListener('online',u);removeEventListener('offline',u)}},[]);
  useEffect(()=>{map.current=L.map(el.current,{zoomControl:false}).setView([36.115,-115.17],14);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17,attribution:'© OpenStreetMap'}).addTo(map.current);layer.current=L.layerGroup().addTo(map.current);return()=>map.current.remove()},[]);
  useEffect(()=>{layer.current.clearLayers();const pts=[];
    days.filter(d=>day==='all'||d.id===day).forEach(d=>d.ev.forEach(e=>{const c=coordsFor(e.loc);if(!c)return;pts.push(c);
      L.circleMarker(c,{radius:9,color:'#FFB8D1',weight:3,fillColor:'#CDB8FF',fillOpacity:.95}).bindPopup(`<b>${esc(e.ti)}</b><br>${esc(e.t)}<br>${esc(e.loc)}`).addTo(layer.current)}));
    if(day!=='all'&&pts.length>1){L.polyline(pts,{color:'#FFCFA8',weight:4,dashArray:'6 8'}).addTo(layer.current);map.current.fitBounds(pts,{padding:[40,40]})}},[days,day]);
  useEffect(()=>{if(focus)map.current.flyTo(focus.c,17)},[focus]);
  const dl=async()=>{const list=[];for(let z=13;z<=16;z++)for(let x=X(-115.19,z);x<=X(-115.15,z);x++)for(let y=Y(36.14,z);y<=Y(36.08,z);y++)list.push(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
    let n=0;setProg({n,t:list.length});for(const u of list){try{await fetch(u,{mode:'no-cors'})}catch{}setProg({n:++n,t:list.length})}};
  return <div className="px-4 pt-3">
    <div className="flex gap-2 overflow-x-auto pb-2">{[{id:'all',label:'Todos'},...days.filter(d=>d.ev.length)].map(d=><button key={d.id} onClick={()=>setDay(d.id)} className={`shrink-0 h-10 px-4 rounded-full text-sm font-extrabold ${day===d.id?'bg-pink text-ink':'bg-card text-lilac'}`}>{d.label.slice(0,6)}</button>)}</div>
    <div ref={el} className="rounded-3xl overflow-hidden border-2 border-card2" style={{height:'calc(100dvh - 330px)',minHeight:260}} role="application" aria-label="Mapa"/>
    <div className="mt-3 flex gap-2 items-center flex-wrap">
      <button onClick={dl} disabled={prog&&prog.n<prog.t} className="h-11 px-4 rounded-full bg-peach text-ink font-extrabold text-sm flex items-center gap-1 disabled:opacity-60"><Download size={16}/>{prog?(prog.n<prog.t?`Baixando ${prog.n}/${prog.t}`:'Mapa salvo offline'):'Baixar mapa offline'}</button>
      {focus&&<a href={gmap(focus.t)} target="_blank" rel="noopener" className="h-11 px-4 rounded-full bg-sky text-ink font-extrabold text-sm flex items-center gap-1"><Navigation size={16}/>Google Maps</a>}
      {!on&&<span className="text-xs text-peach flex items-center gap-1"><WifiOff size={14}/>Sem internet</span>}</div>
    <p className="text-xs text-mute mt-2 leading-snug">O download guarda a região da Strip ao Allegiant e ao aeroporto (zoom até 16), sem custo. Faça com Wi‑Fi. Pontos são aproximados e o mapa não mostra o interior dos hotéis: use os minutos “por dentro” de cada card.</p></div>;
}
