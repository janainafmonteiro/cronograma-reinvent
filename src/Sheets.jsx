import {useState,useRef,useEffect} from 'react';import {X,Send} from 'lucide-react';import {isFlex} from './schedule';
export function Sheet({title,onClose,children}){return <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={onClose}><div onClick={e=>e.stopPropagation()} className="w-full max-w-md mx-auto bg-card rounded-t-3xl p-4 max-h-[88dvh] overflow-y-auto" style={{paddingBottom:'calc(16px + env(safe-area-inset-bottom,0px))'}}>
  <div className="flex justify-between items-center"><div className="text-lg font-extrabold text-peach">{title}</div><button aria-label="Fechar" onClick={onClose} className="w-11 h-11 flex items-center justify-center"><X/></button></div>{children}</div></div>}
export function EditSheet({ed,setEd,onSave}){
  const f=(l,k,t='text')=><label className="block text-xs font-bold text-mute mt-3 flex-1">{l}<input type={t} value={ed.e[k]??''} onChange={x=>setEd({...ed,e:{...ed.e,[k]:x.target.value}})} className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac"/></label>;
  return <Sheet title="Editar card" onClose={()=>setEd(null)}>{f('Título','ti')}{f('Horário','t')}<label className="block text-xs font-bold text-mute mt-3">Tipo de horário<select value={ed.e.fx||(isFlex(ed.e)?'flex':'fixed')} onChange={x=>setEd({...ed,e:{...ed.e,fx:x.target.value}})} className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white"><option value="fixed">Fixo (não muda sozinho)</option><option value="flex">Flexível (o app pode mover)</option></select></label>{f('Local','loc')}<div className="flex gap-2">{f('Rua (min)','m','number')}{f('Interno (min)','c','number')}</div>
    <label className="flex items-center gap-3 mt-3 h-12 text-sm font-bold"><input type="checkbox" checked={!!ed.e.s} onChange={x=>setEd({...ed,e:{...ed.e,s:x.target.checked}})} className="w-6 h-6 accent-pink"/>Tem swag (brilho rosa)</label>
    <div className="flex gap-2 mt-3"><button onClick={()=>setEd(null)} className="flex-1 h-12 rounded-full bg-card2 font-extrabold">Cancelar</button><button onClick={onSave} className="flex-1 h-12 rounded-full bg-pink text-ink font-extrabold">Salvar</button></div></Sheet>;
}
export function ChatSheet({msgs,typing,onSend,onClose}){
  const [t,setT]=useState(''),end=useRef();useEffect(()=>{end.current?.scrollIntoView({block:'end'})},[msgs,typing]);
  const go=()=>{if(t.trim()){onSend(t.trim());setT('')}};
  return <Sheet title="Assistente" onClose={onClose}><div className="flex flex-col gap-2 mt-2 h-[42dvh] overflow-y-auto">{msgs.map((m,i)=><div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug ${m.r==='me'?'self-end bg-lilac text-ink font-bold':'self-start bg-card2'}`}>{m.x}</div>)}
    {typing&&<div className="self-start bg-card2 rounded-2xl px-3 py-3 flex gap-1">{[0,.2,.4].map(d=><i key={d} className="dot w-2 h-2 rounded-full bg-mute" style={{animationDelay:d+'s'}}/>)}</div>}<div ref={end}/></div>
    <div className="flex gap-2 mt-3"><input value={t} onChange={e=>setT(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} aria-label="Mensagem" placeholder="Ex: adicione um encontro na terça à tarde" className="flex-1 h-12 rounded-full bg-card2 px-4 text-[16px] text-white outline-none focus:ring-2 ring-lilac placeholder-mute"/>
    <button aria-label="Enviar" onClick={go} className="w-12 h-12 rounded-full bg-peach text-ink flex items-center justify-center"><Send size={20}/></button></div></Sheet>;
}
export function KeySheet({onClose,onSave,cfg}){
  const [k,setK]=useState(cfg.key),[m,setM]=useState(cfg.model);
  return <Sheet title="IA (Gemini)" onClose={onClose}>
    <p className="text-xs text-mute mt-2 leading-snug">Crie uma chave em aistudio.google.com/apikey e cole abaixo. Ela fica só neste aparelho e nunca vai para o GitHub. Se possível, restrinja a chave ao seu site (Google Cloud › Credenciais › Restrições de HTTP referrer).</p>
    <label className="block text-xs font-bold text-mute mt-3">Chave da API<input type="password" value={k} onChange={e=>setK(e.target.value)} autoComplete="off" className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac"/></label>
    <label className="block text-xs font-bold text-mute mt-3">Modelo<input value={m} onChange={e=>setM(e.target.value)} className="mt-1 w-full h-12 rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac"/></label>
    <button onClick={()=>onSave(k,m)} className="mt-3 w-full h-12 rounded-full bg-pink text-ink font-extrabold">Salvar</button></Sheet>;
}
