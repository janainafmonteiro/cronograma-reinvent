import {useState} from 'react';import {Plus,Trash2,Pencil,Copy,Maximize2,X} from 'lucide-react';import {Sheet} from './Sheets';import {nid} from './data';
const inp='mt-1 w-full rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac';
export default function Pitch({X,setX}){
  const [tab,setTab]=useState('p'),[ed,setEd]=useState(null),[full,setFull]=useState(null),k=tab==='p'?'pitches':'terms';
  const save=()=>{setX(x=>({...x,[k]:x[k].some(i=>i.id===ed.id)?x[k].map(i=>i.id===ed.id?ed:i):[...x[k],ed]}));setEd(null)};
  const del=id=>setX(x=>({...x,[k]:x[k].filter(i=>i.id!==id)}));
  const F=(l,f,r=1)=><label className="block text-xs font-bold text-mute mt-3">{l}{r>1?<textarea value={ed[f]} rows={r} onChange={e=>setEd({...ed,[f]:e.target.value})} className={inp+' py-2'}/>:<input value={ed[f]} onChange={e=>setEd({...ed,[f]:e.target.value})} className={inp+' h-12'}/>}</label>;
  return <div className="flex flex-col gap-3">
    <div className="flex gap-1 bg-card rounded-full p-1">{[['p','Pitches'],['t','Termos técnicos']].map(([a,l])=><button key={a} onClick={()=>setTab(a)} className={`flex-1 h-11 rounded-full text-sm font-extrabold ${tab===a?'bg-lilac text-ink':'text-mute'}`}>{l}</button>)}</div>
    <button onClick={()=>setEd(tab==='p'?{id:nid(),title:'',text:'',pt:''}:{id:nid(),term:'',pt:'',ex:''})} className="h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-1"><Plus size={18}/>{tab==='p'?'Novo pitch':'Novo termo'}</button>
    {tab==='p'&&<p className="text-xs text-mute -mt-1">Preencha os [colchetes] com seus dados reais. Eu não sei os detalhes do seu projeto, então deixei modelos.</p>}
    {X[k].map(i=><div key={i.id} className="rounded-3xl bg-card border-2 border-card2 p-3">
      {tab==='p'?<><div className="font-extrabold text-peach">{i.title}</div><p className="text-[15px] leading-relaxed mt-1">{i.text}</p>{i.pt&&<p className="text-xs text-mute mt-1">{i.pt}</p>}</>
       :<><div className="font-extrabold text-lilac">{i.term}</div><div className="text-sm text-mute">{i.pt}</div><p className="text-sm mt-1 italic">“{i.ex}”</p></>}
      <div className="flex gap-1 mt-2">{tab==='p'&&<button aria-label="Ler em tela cheia" onClick={()=>setFull(i)} className="w-11 h-11 rounded-full bg-card2 text-sky flex items-center justify-center"><Maximize2 size={18}/></button>}
        <button aria-label="Copiar" onClick={()=>navigator.clipboard?.writeText(tab==='p'?i.text:`${i.term}: ${i.ex}`)} className="w-11 h-11 rounded-full bg-card2 text-lilac flex items-center justify-center"><Copy size={18}/></button>
        <button aria-label="Editar" onClick={()=>setEd(i)} className="w-11 h-11 rounded-full bg-card2 text-lilac flex items-center justify-center"><Pencil size={18}/></button>
        <button aria-label="Excluir" onClick={()=>del(i.id)} className="w-11 h-11 rounded-full bg-card2 text-pink flex items-center justify-center"><Trash2 size={18}/></button></div></div>)}
    {ed&&<Sheet title={tab==='p'?'Pitch':'Termo'} onClose={()=>setEd(null)}>{tab==='p'?<>{F('Título','title')}{F('Texto em inglês','text',6)}{F('Dica em português (opcional)','pt',2)}</>:<>{F('Termo em inglês','term')}{F('Significado','pt')}{F('Frase de exemplo','ex',2)}</>}
      <button onClick={save} className="mt-4 w-full h-12 rounded-full bg-pink text-ink font-extrabold">Salvar</button></Sheet>}
    {full&&<div className="fixed inset-0 z-[60] bg-ink flex flex-col items-center justify-center p-6"><button aria-label="Fechar" onClick={()=>setFull(null)} className="absolute right-4 w-12 h-12 rounded-full bg-card text-white flex items-center justify-center" style={{top:'calc(16px + env(safe-area-inset-top,0px))'}}><X/></button><p className="text-2xl font-extrabold leading-relaxed text-center max-w-sm">{full.text}</p></div>}</div>}
