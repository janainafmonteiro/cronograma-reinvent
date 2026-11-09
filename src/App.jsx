import {useState,useRef} from 'react';
import {Undo2,Sparkles,MoreVertical,CalendarDays,ListChecks,Map as MapI,MessageCircle,Route} from 'lucide-react';
import {useStore} from './store';import {coordsFor,casinoTax,gmap,nid} from './data';import {getCfg,setCfg,chatAI,analyzeAI} from './ai';
import Itinerary from './Itinerary';import Wishlist from './Wishlist';import MapView from './MapView';import RouteView from './RouteView';import {Sheet,EditSheet,ChatSheet,KeySheet} from './Sheets';
const dayKeys={domingo:'d29',segunda:'d30',terça:'d01',terca:'d01',quarta:'d02',quinta:'d03',sexta:'d04',sábado:'d28',sabado:'d28'};
function parse(txt,days){const s=txt.toLowerCase();let did=null;for(const k in dayKeys)if(s.includes(k)){did=dayKeys[k];break}
  const m=s.match(/dia (\d{1,2})/);if(!did&&m){const f=days.find(d=>d.label.includes(' '+m[1].padStart(2,'0')+' '));if(f)did=f.id}
  const per=s.includes('manh')?['10:00 – 11:00','de manhã']:s.includes('noite')?['20:00 – 21:00','à noite']:['16:30 – 17:30','à tarde'];
  const ti=/jantar/.test(s)?'Jantar':/almo/.test(s)?'Almoço':/caf[eé]/.test(s)?'Café':/reuni/.test(s)?'Reunião':'Encontro';
  return {did:did||'d01',per,ti,meal:/jantar|almo|caf[eé]/.test(s),pick:/melhor|escolh|sugir|decid|tanto faz/.test(s)}}
/** Aplica as ações devolvidas pelo Gemini (add, update, move, delete) sobre os dias. */
function applyActions(days,acts){const D=days.map(d=>({...d,ev:[...d.ev]}));
  const find=id=>{for(const d of D){const i=d.ev.findIndex(e=>e.id===id);if(i>=0)return[d,i]}return null};
  const put=(d,ev,after)=>{let i=after?d.ev.findIndex(e=>e.id===after)+1:0;if(!i)i=d.ev.findIndex(y=>y.t.slice(0,5)>ev.t.slice(0,5));if(i<0)d.ev.push(ev);else d.ev.splice(i,0,ev)};
  for(const a of acts||[]){
    if(a.type==='delete'){const r=find(a.id);if(r)r[0].ev.splice(r[1],1)}
    else if(a.type==='update'){const r=find(a.id);if(r){const e=r[0].ev[r[1]];r[0].ev[r[1]]={...e,...(a.time&&{t:a.time}),...(a.title&&{ti:a.title}),...(a.place&&{loc:a.place}),...(a.streetMin!=null&&{m:+a.streetMin}),...(a.innerMin!=null&&{c:+a.innerMin}),n:null,tn:null}}}
    else if(a.type==='move'||a.type==='add'){const d=D.find(x=>x.id===a.day);if(!d)continue;let ev;
      if(a.type==='move'){const r=find(a.id);if(!r)continue;ev=r[0].ev.splice(r[1],1)[0]}
      else ev={id:nid(),t:a.time||'12:00',ti:a.title||'Novo evento',loc:a.place||'',m:a.streetMin??null,c:a.innerMin??0,n:null,s:!!a.swag};
      put(d,ev,a.afterId&&a.afterId!==a.id?a.afterId:null)}}
  return D}
export default function App(){
  const {S,setS,upd,ck,undo,reset,saveOrig,canUndo,ref}=useStore(),{days}=S;
  const [v,setV]=useState('rot'),[an,setAn]=useState('idle'),[ed,setEd]=useState(null),[menu,setMenu]=useState(false),[chat,setChat]=useState(false),[key,setKey]=useState(false),[toast,setToast]=useState(null),[focus,setFocus]=useState(null),[fresh,setFresh]=useState(null);
  const [msgs,setMsgs]=useState([{r:'ai',x:getCfg().key?'Oi! Peça o que quiser: adicionar, mover, editar ou excluir eventos. Ex: “coloque a foto na placa depois do helicóptero”.':'Oi! Configure a chave do Gemini no menu ⋮ para eu entender qualquer pedido. Sem ela, só sei adicionar eventos de forma simples.'}]),[typing,setTyping]=useState(false),pend=useRef(null),mr=useRef(msgs);mr.current=msgs;
  const tt=(x,u=true)=>{setToast({x,u});setTimeout(()=>setToast(null),4000)};
  const ck2=()=>{ck();setAn('idle')};
  const nSug=days.reduce((a,d)=>a+d.ev.filter(e=>e.tn&&e.tn!==e.t).length,0);
  const analyze=async()=>{setAn('loading');if(!getCfg().key){setTimeout(()=>setAn('done'),2200);return}
    try{const r=await analyzeAI(ref.current.days),m=Object.fromEntries((r.items||[]).map(i=>[i.id,i]));
      upd(p=>({...p,days:p.days.map(d=>({...d,ev:d.ev.map(e=>{const i=m[e.id];if(!i)return e;return{...e,m:i.streetMin??e.m,c:i.innerMin??e.c,tn:i.time&&i.time!==e.t?i.time:null,n:i.status==='ok'?null:[i.status==='bad'?'bad':'warn',i.note||'']}})}))}));setAn('done')}
    catch(e){setAn('idle');tt('Falha na IA: '+e.message.slice(0,90),false)}};
  const applyTimes=()=>{upd(p=>({...p,days:p.days.map(d=>({...d,ev:d.ev.map(e=>e.tn&&e.tn!==e.t?{...e,t:e.tn,tn:null}:e)}))}));tt('Horários aplicados')};
  const del=id=>{setAn('idle');upd(p=>({...p,days:p.days.map(d=>({...d,ev:d.ev.filter(e=>e.id!==id)}))}));tt('Card excluído')};
  const save=()=>{const o=ed.old,n={...ed.e,m:ed.e.m===''||ed.e.m==null?null:+ed.e.m,c:+ed.e.c||0};setAn('idle');
    upd(p=>({days:p.days.map(d=>({...d,ev:d.ev.map(e=>e.id===n.id?{...e,...n}:e)})),wish:p.wish.map(w=>w.k===o?{...w,k:n.ti,name:n.ti}:w)}));setEd(null)};
  const toMap=e=>{const c=coordsFor(e.loc);if(!c){window.open(gmap(e.loc),'_blank','noopener');return}setFocus({c,t:e.loc});setV('mapa')};
  const addSim=(p,loc,picked)=>{const ev={id:nid(),t:p.per[0],ti:p.ti+' (novo)',loc,m:picked?4:null,c:picked?casinoTax(loc):0,n:null,s:false};
    upd(S0=>({...S0,days:S0.days.map(x=>{if(x.id!==p.did)return x;const a=[...x.ev],i=a.findIndex(y=>y.t.slice(0,5)>p.per[0].slice(0,5));i<0?a.push(ev):a.splice(i,0,ev);return{...x,ev:a}})}));setAn('idle');
    setMsgs(m=>[...m,{r:'ai',x:`Pronto! Adicionei “${ev.ti}” às ${p.per[0]}, em ${loc}.`}]);setFresh(ev.id);setTimeout(()=>setFresh(null),2500);setChat(false);setV('rot');
    setTimeout(()=>document.querySelector(`[data-eid="${ev.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),250)};
  const send=async q=>{setMsgs(m=>[...m,{r:'me',x:q}]);setTyping(true);
    if(getCfg().key){try{const r=await chatAI(q,mr.current.slice(-6),ref.current.days);
        if(r.actions?.length){upd(p=>({...p,days:applyActions(p.days,r.actions)}));setAn('idle')}
        setMsgs(m=>[...m,{r:'ai',x:r.reply||'Pronto!'}])}
      catch(e){setMsgs(m=>[...m,{r:'ai',x:'Não consegui falar com o Gemini: '+e.message}])}
      setTyping(false);return}
    setTimeout(()=>{setTyping(false);const pd=pend.current;
      if(pd){const pick=/escolh|decid|melhor|tanto faz/.test(q.toLowerCase());pend.current=null;addSim(pd,pick?(pd.meal?'Grand Lux Cafe · The Venetian':'The Palazzo · Lower Terrace'):q,pick);return}
      const p=parse(q,ref.current.days);if(p.pick)addSim(p,p.meal?'Grand Lux Cafe · The Venetian':'The Palazzo · Lower Terrace',true);
      else{pend.current=p;setMsgs(m=>[...m,{r:'ai',x:'Qual é o local do evento? (Ou diga “escolha você” e eu sugiro o melhor.)'}])}},900)};
  const tabs=[['rot','Roteiro',CalendarDays],['rota','Rota',Route],['lista','Lista',ListChecks],['mapa','Mapa',MapI]];
  return <div className="max-w-md mx-auto text-white min-h-dvh" style={{paddingBottom:'calc(96px + env(safe-area-inset-bottom,0px))'}}>
    {v!=='rota'&&<header className="sticky top-0 z-20 bg-ink/95 backdrop-blur px-4 flex items-center gap-2 border-b border-card2" style={{height:'calc(56px + env(safe-area-inset-top,0px))',paddingTop:'env(safe-area-inset-top,0px)'}}>
      <div className="flex-1 min-w-0"><div className="text-[10px] font-extrabold tracking-widest text-pink truncate">RE:INVENT 2026 · BASE: TREASURE ISLAND</div><div className="text-lg font-extrabold leading-tight">Meu roteiro</div></div>
      <button aria-label="Desfazer" onClick={undo} disabled={!canUndo} className="w-11 h-11 rounded-full bg-card text-lilac flex items-center justify-center disabled:opacity-30"><Undo2 size={20}/></button>
      {v==='rot'&&<button onClick={analyze} disabled={an==='loading'} className="h-11 px-3 rounded-full bg-pink text-ink font-extrabold text-sm flex items-center gap-1"><Sparkles size={16}/>{an==='loading'?'Analisando…':'Otimizar'}</button>}
      <button aria-label="Mais opções" onClick={()=>setMenu(true)} className="w-11 h-11 rounded-full bg-card text-lilac flex items-center justify-center"><MoreVertical size={20}/></button></header>}
    {v==='rot'&&nSug>0&&an==='done'&&<div className="mx-4 mt-3 rounded-3xl bg-card p-3 flex items-center gap-3 border-2 border-peach"><div className="flex-1 text-sm leading-snug"><b>{nSug}</b> card(s) com horário sugerido pela IA (veja “→” nos cards).</div><button onClick={applyTimes} className="h-11 px-4 rounded-full bg-peach text-ink font-extrabold text-sm">Aplicar</button></div>}
    {v==='rot'&&<Itinerary days={days} setDays={f=>setS(p=>({...p,days:f(p.days)}))} ck={ck2} an={an} fresh={fresh} onEdit={e=>setEd({old:e.ti,e})} onDel={del} onMap={toMap}/>}
    {v==='rota'&&<RouteView days={days}/>}
    {v==='lista'&&<Wishlist S={S} upd={upd}/>}
    {v==='mapa'&&<MapView days={days} focus={focus}/>}
    {v==='rot'&&<button aria-label="Abrir assistente" onClick={()=>setChat(true)} className="fixed right-4 z-30 w-14 h-14 rounded-full bg-peach text-ink flex items-center justify-center shadow-xl" style={{bottom:'calc(88px + env(safe-area-inset-bottom,0px))'}}><MessageCircle/></button>}
    <nav className={`fixed inset-x-0 bottom-0 z-30 border-t border-card2 ${v==='rota'?'bg-ink/80 backdrop-blur':'bg-ink'}`} style={{paddingBottom:'env(safe-area-inset-bottom,0px)'}}><div className="max-w-md mx-auto flex">{tabs.map(([k,l,Ic])=><button key={k} onClick={()=>setV(k)} aria-current={v===k} className={`flex-1 h-16 flex flex-col items-center justify-center gap-0.5 text-xs font-extrabold ${v===k?'text-pink':'text-mute'}`}><Ic size={22}/>{l}</button>)}</div></nav>
    {toast&&<div className="fixed left-4 right-4 z-40 max-w-md mx-auto rounded-3xl bg-lilac text-ink font-extrabold px-4 min-h-12 py-2 flex items-center justify-between gap-2 text-sm" style={{bottom:'calc(100px + env(safe-area-inset-bottom,0px))'}}><span>{toast.x}</span>{toast.u&&<button onClick={()=>{undo();setToast(null)}} className="h-11 px-3 underline shrink-0">Desfazer</button>}</div>}
    {menu&&<Sheet title="Opções" onClose={()=>setMenu(false)}><div className="flex flex-col gap-2 mt-2">
      <button onClick={()=>{setMenu(false);setKey(true)}} className="h-12 rounded-full bg-lilac text-ink font-extrabold">Configurar IA (Gemini){getCfg().key?' ✓':''}</button>
      <button onClick={()=>{reset();setAn('idle');setMenu(false);tt('Voltou ao original')}} className="h-12 rounded-full bg-card2 font-extrabold">Voltar ao original</button>
      <button onClick={()=>{saveOrig();setMenu(false);tt('Novo original salvo',false)}} className="h-12 rounded-full bg-pink text-ink font-extrabold">Salvar estado atual como original</button>
      <p className="text-xs text-mute">Tudo é salvo automaticamente neste aparelho. “Voltar ao original” também pode ser desfeito.</p></div></Sheet>}
    {key&&<KeySheet cfg={getCfg()} onClose={()=>setKey(false)} onSave={(k,m)=>{setCfg(k,m);setKey(false);tt('IA configurada',false)}}/>}
    {ed&&<EditSheet ed={ed} setEd={setEd} onSave={save}/>}
    {chat&&<ChatSheet msgs={msgs} typing={typing} onSend={send} onClose={()=>setChat(false)}/>}
  </div>;
}
