import {useEffect,useState} from 'react';import {Sun,Cloud,CloudRain,CloudSnow,CloudFog,CloudLightning,RefreshCw,Wind,Droplets} from 'lucide-react';import {TRIP} from './data';
const URL='https://api.open-meteo.com/v1/forecast?latitude=36.1147&longitude=-115.1728&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,wind_speed_10m,wind_gusts_10m&timezone=America%2FLos_Angeles&forecast_days=16&wind_speed_unit=kmh';
const W=c=>c===0?['Céu limpo',Sun]:c<=3?['Parcialmente nublado',Cloud]:c<=48?['Neblina',CloudFog]:c<=57?['Garoa',CloudRain]:c<=67?['Chuva',CloudRain]:c<=77?['Neve',CloudSnow]:c<=82?['Pancadas de chuva',CloudRain]:c<=86?['Neve',CloudSnow]:['Tempestade',CloudLightning];
const F=c=>Math.round(c*9/5+32),dm=d=>d.split('-').reverse().slice(0,2).join('/');
const tip=(mn,mx,rain)=>[mn<5?'casaco pesado à noite':mn<12?'casaco para a noite':mn<18?'agasalho leve à noite':'',rain>=40?'guarda-chuva':'',mx>=28?'protetor solar e muita água':''].filter(Boolean).join(' · ');
export default function Weather({days}){
  const [d,setD]=useState(()=>{try{return JSON.parse(localStorage.getItem('rv26w'))}catch{return null}}),[err,setErr]=useState(''),[ld,setLd]=useState(false);
  const load=async()=>{setLd(true);setErr('');try{const r=await fetch(URL);if(!r.ok)throw 0;const j=await r.json(),o={at:Date.now(),daily:j.daily,hourly:j.hourly};try{localStorage.setItem('rv26w',JSON.stringify(o))}catch{}setD(o)}catch{setErr('Sem internet ou serviço indisponível. Mostrando a última previsão salva.')}setLd(false)};
  useEffect(()=>{load()},[]);
  const label=Object.fromEntries(days.map(x=>[x.id,x.label])),dates=Object.keys(TRIP);
  const heli=days.flatMap(x=>x.ev.map(e=>({...e,did:x.id}))).find(e=>/helic/i.test(e.ti)),hd=heli&&dates.find(k=>TRIP[k]===heli.did),hh=heli&&(heli.t.match(/(\d{1,2}):/)||[])[1];
  const hi=d&&hd&&hh?d.hourly.time.indexOf(`${hd}T${hh.padStart(2,'0')}:00`):-1;
  return <div className="flex flex-col gap-3">
    <button onClick={load} disabled={ld} className="h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1 disabled:opacity-60"><RefreshCw size={16} className={ld?'animate-spin':''}/>{ld?'Buscando…':'Atualizar previsão'}</button>
    <p className="text-xs text-mute -mt-1">{d?`Atualizada em ${new Date(d.at).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}. `:'Ainda sem previsão salva. '}{err}</p>
    {hi>=0&&<div className="rounded-3xl bg-card p-4 border-2 border-sky"><div className="font-extrabold text-sky">Helicóptero ({label[heli.did]}, {heli.t.slice(0,5)})</div>
      <div className="text-sm mt-1">{Math.round(d.hourly.temperature_2m[hi])}°C · vento {Math.round(d.hourly.wind_speed_10m[hi])} km/h · rajadas {Math.round(d.hourly.wind_gusts_10m[hi])} km/h</div>
      <p className="text-xs text-mute mt-1">{d.hourly.wind_gusts_10m[hi]>=40||d.hourly.wind_speed_10m[hi]>=30?'Vento forte: o voo pode ser remarcado. Confirme com a operadora.':'Sem vento forte previsto para esse horário. Quem decide o voo é a operadora.'}</p></div>}
    {dates.map(k=>{const i=d?d.daily.time.indexOf(k):-1;const lb=label[TRIP[k]]||dm(k);
      if(i<0){const av=new Date(k+'T12:00:00');av.setDate(av.getDate()-15);return <div key={k} className="rounded-3xl bg-card p-3 flex items-center gap-3"><Cloud className="text-card2 shrink-0"/><div><div className="font-extrabold text-sm">{lb}</div><div className="text-xs text-mute">Previsão disponível a partir de {av.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</div></div></div>}
      const [n,Ic]=W(d.daily.weather_code[i]),mx=d.daily.temperature_2m_max[i],mn=d.daily.temperature_2m_min[i],rain=d.daily.precipitation_probability_max[i]??0,t=tip(mn,mx,rain);
      return <div key={k} className="rounded-3xl bg-card border-2 border-card2 p-3"><div className="flex items-center gap-3"><Ic size={32} className="text-peach shrink-0"/><div className="flex-1"><div className="font-extrabold">{lb} <span className="text-xs text-mute font-bold">· {n}</span></div>
        <div className="text-sm"><b>{Math.round(mx)}°</b> / {Math.round(mn)}°C <span className="text-mute text-xs">({F(mx)}° / {F(mn)}°F)</span></div></div></div>
        <div className="flex gap-3 text-xs text-mute mt-2"><span className="flex items-center gap-1"><Droplets size={13}/>{rain}% chuva</span><span className="flex items-center gap-1"><Wind size={13}/>vento {Math.round(d.daily.wind_speed_10m_max[i])} km/h (rajadas {Math.round(d.daily.wind_gusts_10m_max[i])})</span></div>
        {t&&<p className="text-xs text-sky mt-1">Leve: {t}</p>}</div>})}
    <p className="text-xs text-mute">Dados: Open-Meteo. A previsão cobre cerca de 16 dias à frente, então os dias da viagem aparecem conforme a data chega. As dicas de roupa são sugestões simples.</p></div>}
