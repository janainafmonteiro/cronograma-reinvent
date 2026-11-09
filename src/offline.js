import {coordsFor} from './data';
export const HOTEL=coordsFor('Treasure Island');
const same=(a,b)=>a[0]===b[0]&&a[1]===b[1];
export async function walk(a,b){const k='rv26r:'+a+';'+b;try{const c=JSON.parse(localStorage.getItem(k));if(c)return c}catch{}
  try{const r=await fetch(`https://routing.openstreetmap.de/routed-foot/route/v1/foot/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`);const rt=(await r.json()).routes[0];
    const o={pts:rt.geometry.coordinates.map(c=>[c[1],c[0]]),min:Math.round(rt.duration/60),dist:Math.round(rt.distance)};try{localStorage.setItem(k,JSON.stringify(o))}catch{}return o}catch{return null}}
/** Trechos do dia: hotel → eventos com local conhecido → hotel. */
export function legsOf(d){if(!d)return{legs:[],skipped:0};let sk=0;const st=[{id:null,n:'Treasure Island (hotel)',t:'',c:HOTEL,inner:0}];
  d.ev.forEach(e=>{const c=coordsFor(e.loc);if(!c){sk++;return}st.push({id:e.id,n:e.ti,t:e.t,c,inner:e.c||0,m:e.m})});
  if(!same(st[st.length-1].c,HOTEL))st.push({id:null,n:'Voltar ao hotel',t:'',c:HOTEL,inner:0});
  const legs=[];for(let k=1;k<st.length;k++)if(!same(st[k-1].c,st[k].c))legs.push({a:st[k-1],b:st[k]});return{legs,skipped:sk}}
const X=(lon,z)=>Math.floor((lon+180)/360*2**z),Y=(lat,z)=>{const r=lat*Math.PI/180;return Math.floor((1-Math.log(Math.tan(r)+1/Math.cos(r))/Math.PI)/2*2**z)};
export const offlineDate=()=>localStorage.getItem('rv26off');
/** Baixa os tiles do mapa (Strip, Allegiant e aeroporto, zoom 13–16) e os caminhos a pé de todos os trechos do roteiro atual. */
export async function downloadOffline(days,onP){
  const urls=[];for(let z=13;z<=16;z++)for(let x=X(-115.19,z);x<=X(-115.15,z);x++)for(let y=Y(36.14,z);y<=Y(36.08,z);y++)urls.push(`https://tile.openstreetmap.org/${z}/${x}/${y}.png`);
  const legs=days.flatMap(d=>legsOf(d).legs),total=urls.length+legs.length;let n=0;
  for(const u of urls){try{await fetch(u,{mode:'no-cors'})}catch{}onP(++n,total)}
  for(const l of legs){await walk(l.a.c,l.b.c);onP(++n,total);await new Promise(r=>setTimeout(r,250))}
  localStorage.setItem('rv26off',String(Date.now()))}
