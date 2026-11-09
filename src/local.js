// Análise local (sem IA): usa o estado ATUAL dos cards, horários e minutos de deslocamento.
const tm=s=>{const m=[...(s||'').matchAll(/(\d{1,2}):(\d{2})/g)].map(x=>+x[1]*60+ +x[2]);return m.length?[m[0],m[1]??m[0]+60]:[0,60]};
const fmt=n=>String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const FLEX=/almo|jantar|caf[eé]|expo|foto|livre|passeio|headshot|happy|networking|coca|bellagio/i;
export function localAnalyze(days){const items=[];
  days.forEach(d=>d.ev.forEach((e,k)=>{const prev=k>0?d.ev[k-1]:null,need=(e.m||0)+(e.c||0);let status='ok',note='',time=e.t;
    if(prev){const [s]=tm(e.t),[,pe]=tm(prev.t),gap=s-pe;
      if(gap<0){status='bad';note=`Sobrepõe “${prev.ti}” em ${-gap} min.`}
      else if(gap<need){status=need-gap>10?'bad':'warn';note=`Faltam ${need-gap} min: o deslocamento leva ${need} min e você tem ${gap}.`}
      else if(need>0&&gap-need<10){status='warn';note=`Folga de só ${gap-need} min para chegar.`}
      if(gap<need&&FLEX.test(e.ti)){const [s0,e0]=tm(e.t),ns=pe+need;time=/[–-]/.test(e.t)?`${fmt(ns)} – ${fmt(ns+(e0-s0))}`:fmt(ns)}}
    items.push({id:e.id,time,streetMin:e.m,innerMin:e.c,status,note})}));
  return items}
