// Reagendamento automático (sem IA): usa duração, tempo de deslocamento (rua + por dentro) e a trava fixo/flexível.
export const FLEX=/almo|jantar|caf[eé]|expo|foto|livre|passeio|headshot|happy|networking|coca|bellagio|tempo/i;
export const isFlex=e=>e.fx?e.fx==='flex':FLEX.test(e.ti);
const tm=s=>{const m=[...(s||'').matchAll(/(\d{1,2}):(\d{2})/g)].map(x=>+x[1]*60+ +x[2]);return m.length?{s:m[0],e:m[1]??null}:null};
const fmt=n=>{n=((n%1440)+1440)%1440;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')};
const label=(s,e)=>e==null?fmt(s):`${fmt(s)} – ${fmt(e)}`;
const need=e=>(e.m||0)+(e.c||0);
/** Move só eventos flexíveis. Padrão: empurra para depois quando há conflito. snapId: gruda o evento logo após o anterior + deslocamento. compact: faz isso com todos os flexíveis. anchorId: evento que não pode mexer nesta passada. */
export function reflowDay(ev,o={}){let prevEnd=null;
  return ev.map(e=>{const t=tm(e.t);if(!t)return e;const dur=t.e!=null?t.e-t.s:60;let s=t.s;
    if(prevEnd!=null&&isFlex(e)&&e.id!==o.anchorId){const earliest=prevEnd+need(e);s=(o.compact||e.id===o.snapId)?earliest:Math.max(s,earliest)}
    prevEnd=s+dur;return s===t.s?e:{...e,t:label(s,t.e!=null?s+dur:null),tn:null}})}
export const reflowAll=(days,o={})=>days.map(d=>o.dayIds&&!o.dayIds.includes(d.id)?d:{...d,ev:reflowDay(d.ev,o)});
export const countChanged=(a,b)=>{const m=new Map(a.flatMap(d=>d.ev).map(e=>[e.id,e.t]));return b.flatMap(d=>d.ev).filter(e=>m.has(e.id)&&m.get(e.id)!==e.t).length};
/** Conflitos ao vivo: id → ['warn'|'bad', nota]. */
export function conflicts(ev){const out={};let prev=null;
  for(const e of ev){const t=tm(e.t);if(!t)continue;const dur=t.e!=null?t.e-t.s:60,cur={s:t.s,e:t.s+dur};
    if(prev){const n=need(e),gap=cur.s-prev.e-n;
      if(gap<0)out[e.id]=[-gap>10?'bad':'warn',`Faltam ${-gap} min depois de “${prev.ti}” (deslocamento de ${n} min).`];
      else if(n>0&&gap<10)out[e.id]=['warn',`Folga de só ${gap} min depois de “${prev.ti}”.`]}
    prev={...cur,ti:e.ti}}return out}
