import {useState,useRef} from 'react';
import {Undo2,Sparkles,MoreVertical,CalendarDays,ListChecks,Map as MapI,MessageCircle} from 'lucide-react';
import {useStore} from './store';import {coordsFor,casinoTax,gmap} from './data';
import Itinerary from './Itinerary';import Wishlist from './Wishlist';import MapView from './MapView';import {Sheet,EditSheet,ChatSheet} from './Sheets';
const dayKeys={domingo:'d29',segunda:'d30',terça:'d01',terca:'d01',quarta:'d02',quinta:'d03',sexta:'d04',sábado:'d28',sabado:'d28'};
function parse(txt,days){const s=txt.toLowerCase();let did=null;for(const k in dayKeys)if(s.includes(k)){did=dayKeys[k];break}
  const m=s.match(/dia (\d{1,2})/);if(!did&&m){const f=days.find(d=>d.label.includes(' '+m[1].padStart(2,'0')+' '));if(f)did=f.id}
  const per=s.includes('manh')?['10:00 – 11:00','de manhã']:s.includes('noite')?['20:00 – 21:00','à noite']:['16:30 – 17:30','à tarde'];
  const ti=/jantar/.test(s)?'Jantar':/almo/.test(s)?'Almoço':/caf[eé]/.test(s)?'Café':/reuni/.test(s)?'Reunião':'Encontro';
  return {did:did||'d01',per,ti,meal:/jantar|almo|caf[eé]/.test(s),pick:/melhor|escolh|sugir|decid|tanto faz/.test(s)}}
// Pontos de integração futuros: Google Maps (rota) + Gemini (middleware do "imposto de cassino", ver casinoTax em data.js)
export default function App(){
  const {S,setS,upd,ck,undo,reset,saveOrig,canUndo,ref}=useStore(),{days}=S;
  const [v,setV]=useState('rot'),[an,setAn]=useState('idle'),[ed,setEd]=useState(null),[menu,setMenu]=useState(false),[chat,setChat]=useState(false),[toast,setToast]=useState(null),[focus,setFocus]=useState(null),[fresh,setFresh]=useState(null);
  const [msgs,setMsgs]=useState([{r:'ai',x:'Oi! Peça para eu adicionar eventos. Se você não disser o local, eu pergunto. Ou diga “escolha você”.'}]),[typing,setTyping]=useState(false),pend=useRef(null);
  const tt=x=>{setToast(x);setTimeout(()=>setToast(null),3500)};
  const analyze=()=>{setAn('loading');setTimeout(()=>setAn('done'),2200)};
  const del=id=>{upd(p=>({...p,days:p.days.map(d=>({...d,ev:d.ev.filter(e=>e.id!==id)}))}));tt('Card excluído')};
  const save=()=>{const o=ed.old,n={...ed.e,m:ed.e.m===''||ed.e.m==null?null:+ed.e.m,c:+ed.e.c||0};
    upd(p=>({days:p.days.map(d=>({...d,ev:d.ev.map(e=>e.id===n.id?{...e,...n}:e)})),wish:p.wish.map(w=>w.k===o?{...w,k:n.ti,name:n.ti}:w)}));setEd(null)};
  const toMap=e=>{const c=coordsFor(e.loc);if(!c){window.open(gmap(e.loc),'_blank','noopener');return}setFocus({c,t:e.loc});setV('mapa')};
  const addEv=(p,loc,picked)=>{const ev={id:'n'+Math.random().toString(36).slice(2,9),t:p.per[0],ti:p.ti+' (novo)',loc,m:picked?4:null,c:picked?casinoTax(loc):0,n:null,s:false};
    upd(S0=>({...S0,days:S0.days.map(x=>{if(x.id!==p.did)return x;const a=[...x.ev],i=a.findIndex(y=>y.t.slice(0,5)>p.per[0].slice(0,5));i<0?a.push(ev):a.splice(i,0,ev);return{...x,ev:a}})}));
    const lb=ref.current.days.find(x=>x.id===p.did).label;setFresh(ev.id);setTimeout(()=>setFresh(null),2500);
    setMsgs(m=>[...m,{r:'ai',x:`Pronto! Adicionei “${ev.ti}” em ${lb}, ${p.per[0]} (${p.per[1]}), em ${loc}.`+(picked?' Escolhi esse lugar porque fica no centro do complexo Venetian/Palazzo.':' O deslocamento ainda não foi calculado; rode a análise.')}]);
    setChat(false);setV('rot');setTimeout(()=>document.querySelector(`[data-eid="${ev.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),250)};
  const send=q=>{setMsgs(m=>[...m,{r:'me',x:q}]);setTyping(true);setTimeout(()=>{setTyping(false);const pd=pend.current;
    if(pd){const pick=/escolh|decid|melhor|tanto faz/.test(q.toLowerCase());pend.current=null;addEv(pd,pick?(pd.meal?'Grand Lux Cafe · The Venetian':'The Palazzo · Lower Terrace'):q,pick);return}
    const p=parse(q,ref.current.days);if(p.pick)addEv(p,p.meal?'Grand Lux Cafe · The Venetian':'The Palazzo · Lower Terrace',true);
    else{pend.current=p;setMsgs(m=>[...m,{r:'ai',x:'Qual é o local do evento? (Ou diga “escolha você” e eu sugiro o melhor.)'}])}},900)};
  const tabs=[['rot','Roteiro',CalendarDays],['lista','Lista',ListChecks],['mapa','Mapa',MapI]];
  return <div className="max-w-md mx-auto text-white min-h-dvh" style={{paddingBottom:'calc(96px + env(safe-area-inset-bottom,0px))'}}>
    <header className="sticky top-0 z-20 bg-ink/95 backdrop-blur px-4 flex items-center gap-2 border-b border-card2" style={{height:'calc(56px + env(safe-area-inset-top,0px))',paddingTop:'env(safe-area-inset-top,0px)'}}>
      <div className="flex-1 min-w-0"><div className="text-[10px] font-extrabold tracking-widest text-pink truncate">RE:INVENT 2026 · BASE: TREASURE ISLAND</div><div className="text-lg font-extrabold leading-tight">Meu roteiro</div></div>
      <button aria-label="Desfazer" onClick={undo} disabled={!canUndo} className="w-11 h-11 rounded-full bg-card text-lilac flex items-center justify-center disabled:opacity-30"><Undo2 size={20}/></button>
      {v==='rot'&&<button onClick={analyze} disabled={an==='loading'} className="h-11 px-3 rounded-full bg-pink text-ink font-extrabold text-sm flex items-center gap-1"><Sparkles size={16}/>{an==='loading'?'Analisando…':'Analisar'}</button>}
      <button aria-label="Mais opções" onClick={()=>setMenu(true)} className="w-11 h-11 rounded-full bg-card text-lilac flex items-center justify-center"><MoreVertical size={20}/></button></header>
    {v==='rot'&&<Itinerary days={days} setDays={f=>setS(p=>({...p,days:f(p.days)}))} ck={ck} an={an} fresh={fresh} onEdit={e=>setEd({old:e.ti,e})} onDel={del} onMap={toMap}/>}
    {v==='lista'&&<Wishlist S={S} upd={upd}/>}
    {v==='mapa'&&<MapView days={days} focus={focus}/>}
    {v==='rot'&&<button aria-label="Abrir assistente" onClick={()=>setChat(true)} className="fixed right-4 z-30 w-14 h-14 rounded-full bg-peach text-ink flex items-center justify-center shadow-xl" style={{bottom:'calc(88px + env(safe-area-inset-bottom,0px))'}}><MessageCircle/></button>}
    <nav className="fixed inset-x-0 bottom-0 z-30 bg-ink border-t border-card2" style={{paddingBottom:'env(safe-area-inset-bottom,0px)'}}><div className="max-w-md mx-auto flex">{tabs.map(([k,l,Ic])=><button key={k} onClick={()=>setV(k)} aria-current={v===k} className={`flex-1 h-16 flex flex-col items-center justify-center gap-0.5 text-xs font-extrabold ${v===k?'text-pink':'text-mute'}`}><Ic size={22}/>{l}</button>)}</div></nav>
    {toast&&<div className="fixed left-4 right-4 z-40 max-w-md mx-auto rounded-full bg-lilac text-ink font-extrabold px-4 h-12 flex items-center justify-between" style={{bottom:'calc(100px + env(safe-area-inset-bottom,0px))'}}>{toast}<button onClick={()=>{undo();setToast(null)}} className="h-11 px-3 underline">Desfazer</button></div>}
    {menu&&<Sheet title="Opções" onClose={()=>setMenu(false)}><div className="flex flex-col gap-2 mt-2">
      <button onClick={()=>{reset();setMenu(false);tt('Voltou ao original')}} className="h-12 rounded-full bg-card2 font-extrabold">Voltar ao original</button>
      <button onClick={()=>{saveOrig();setMenu(false);tt('Novo original salvo')}} className="h-12 rounded-full bg-pink text-ink font-extrabold">Salvar estado atual como original</button>
      <p className="text-xs text-mute">Tudo é salvo automaticamente neste aparelho. “Voltar ao original” também pode ser desfeito.</p></div></Sheet>}
    {ed&&<EditSheet ed={ed} setEd={setEd} onSave={save}/>}
    {chat&&<ChatSheet msgs={msgs} typing={typing} onSend={send} onClose={()=>setChat(false)}/>}
  </div>;
}
