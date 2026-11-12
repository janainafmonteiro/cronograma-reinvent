import {useMemo,useState} from 'react';import {Check,Trash2,Plus,Pencil,Copy,Upload,CircleDashed,CheckCircle2} from 'lucide-react';import {Sheet} from './Sheets';import {nid} from './data';import {offlineDate} from './offline';import {getCfg} from './ai';import {parseActions} from './importJson';
export const CATS=['Documentos','Dinheiro','Tecnologia','Saúde','Bagagem','Outros'];
const inp='mt-1 w-full rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac';
export function applyCheck(list,acts){let L=list.map(i=>({...i}));
  for(const a of acts){if(a.type==='add'&&a.text)L.push({id:nid(),text:String(a.text),cat:a.cat||'Outros',done:!!a.done});
    else if(a.type==='update')L=L.map(i=>i.id===a.id?{...i,...(a.text&&{text:String(a.text)}),...(a.cat&&{cat:a.cat}),...(a.done!=null&&{done:!!a.done})}:i);
    else if(a.type==='delete')L=L.filter(i=>i.id!==a.id)}
  return L}
const exportText=list=>`Você é meu assistente para o checklist de viagem (AWS re:Invent 2026, Las Vegas, 28/11 a 05/12; viajo do Brasil). Minha lista atual (JSON): ${JSON.stringify(list.map(i=>({id:i.id,text:i.text,cat:i.cat,done:i.done})))}
Converse comigo para sugerir o que falta. Quando eu escrever "GERAR", responda SOMENTE com um bloco de código JSON {"actions":[...]} usando:
{"type":"add","text":"","cat":"Documentos"}
{"type":"update","id":"","text":"","cat":"","done":false}
{"type":"delete","id":""}
Categorias: ${CATS.join(', ')}. Use só ids que existem na lista acima.`;
export default function Checklist({X,setX}){
  const list=X.check||[],[nt,setNt]=useState(''),[nc,setNc]=useState('Documentos'),[ed,setEd]=useState(null),[imp,setImp]=useState(false),[txt,setTxt]=useState(''),[msg,setMsg]=useState('');
  const set=f=>setX(x=>({...x,check:f(x.check||[])}));
  const bk=localStorage.getItem('rv26bk'),off=offlineDate(),vf=X.vault.filter(v=>v.files.length).length,standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;
  const auto=[[standalone,'App instalado na tela inicial','Abra no navegador › Instalar app / Adicionar à Tela de Início.'],[!!off,'Mapa e rotas offline baixados',off?`Baixado em ${new Date(+off).toLocaleDateString('pt-BR')}`:'Rota › botão Offline, com Wi‑Fi.'],
    [vf===X.vault.length,`Cofre com anexos (${vf}/${X.vault.length})`,'Eu › Cofre offline: anexe voos, voucher e ingressos.'],[!!bk,'Backup feito',bk?`Último em ${new Date(+bk).toLocaleDateString('pt-BR')}`:'Menu ⋮ › Backup e restauração.'],
    [!!localStorage.getItem('rv26w'),'Previsão do tempo salva','Eu › Clima › Atualizar previsão.'],[!!getCfg().key,'Chave do Gemini (opcional)','Menu ⋮ › Configurar IA.']];
  const okN=auto.filter(a=>a[0]).length,doneN=list.filter(i=>i.done).length;
  const cats=[...new Set([...CATS,...list.map(i=>i.cat)])].filter(c=>list.some(i=>i.cat===c));
  const prev=useMemo(()=>{if(!txt.trim())return null;try{const a=parseActions(txt),c=t=>a.filter(x=>x.type===t).length;return{n:a.length,s:`Vai adicionar ${c('add')}, alterar ${c('update')} e excluir ${c('delete')}.`}}catch(e){return{err:e.message}}},[txt]);
  const apply=()=>{try{const a=parseActions(txt),nl=applyCheck(list,a);if(JSON.stringify(nl)===JSON.stringify(list))throw new Error('Nada mudou. Confira os ids.');set(()=>nl);setImp(false);setTxt('');setMsg('Lista atualizada.')}catch(e){setMsg(e.message)}};
  return <div className="flex flex-col gap-3">
    <div className="rounded-3xl bg-card p-4"><div className="flex items-center justify-between"><div className="font-extrabold text-peach">Prontidão offline</div><span className="text-xs font-extrabold rounded-full bg-card2 px-2 py-1">{okN}/{auto.length}</span></div>
      <div className="flex flex-col gap-2 mt-2">{auto.map(([ok,l,h],i)=><div key={i} className="flex gap-2 items-start">{ok?<CheckCircle2 size={20} className="text-mint shrink-0 mt-0.5"/>:<CircleDashed size={20} className="text-peach shrink-0 mt-0.5"/>}<div><div className={`text-sm font-bold ${ok?'':'text-peach'}`}>{l}</div><div className="text-xs text-mute">{h}</div></div></div>)}</div></div>
    <div className="rounded-3xl bg-card p-4"><div className="flex items-center justify-between"><div className="font-extrabold text-peach">Minha lista</div><span className="text-xs font-extrabold rounded-full bg-card2 px-2 py-1">{doneN}/{list.length}</span></div>
      <form className="flex gap-2 mt-3" onSubmit={e=>{e.preventDefault();const t=nt.trim();if(!t)return;set(l=>[...l,{id:nid(),text:t,cat:nc,done:false}]);setNt('')}}>
        <input value={nt} onChange={e=>setNt(e.target.value)} aria-label="Novo item" placeholder="Adicionar item" className="flex-1 min-w-0 h-12 rounded-full bg-card2 px-4 text-[16px] outline-none focus:ring-2 ring-lilac placeholder-mute"/>
        <select aria-label="Categoria" value={nc} onChange={e=>setNc(e.target.value)} className="h-12 rounded-full bg-card2 px-2 text-sm font-bold text-lilac">{CATS.map(c=><option key={c}>{c}</option>)}</select>
        <button aria-label="Adicionar" className="w-12 h-12 shrink-0 rounded-full bg-pink text-ink flex items-center justify-center"><Plus/></button></form>
      {cats.map(c=><div key={c} className="mt-3"><div className="text-xs font-extrabold text-pink mb-1">{c}</div>{list.filter(i=>i.cat===c).map(i=><div key={i.id} className="flex items-center gap-1 min-h-12">
        <button aria-label={i.done?'Desmarcar':'Marcar como feito'} onClick={()=>set(l=>l.map(x=>x.id===i.id?{...x,done:!x.done}:x))} className={`w-11 h-11 shrink-0 rounded-full border-2 flex items-center justify-center ${i.done?'bg-mint border-mint text-ink':'border-lilac text-transparent'}`}><Check size={20}/></button>
        <span className={`flex-1 text-sm ${i.done?'line-through text-mute':''}`}>{i.text}</span>
        <button aria-label="Editar" onClick={()=>setEd({...i})} className="w-11 h-11 text-lilac flex items-center justify-center"><Pencil size={16}/></button>
        <button aria-label="Excluir" onClick={()=>set(l=>l.filter(x=>x.id!==i.id))} className="w-11 h-11 text-pink flex items-center justify-center"><Trash2 size={16}/></button></div>)}</div>)}
      {list.length===0&&<p className="text-sm text-mute mt-3">Lista vazia. Adicione itens ou importe de uma IA.</p>}</div>
    <div className="rounded-3xl bg-card p-4"><div className="font-extrabold text-peach">Conversar com uma IA</div><p className="text-xs text-mute mt-1">Copie a lista, converse com o Gemini ou o Claude sobre o que falta e importe o resultado.</p>
      <div className="flex gap-2 mt-2"><button onClick={()=>{navigator.clipboard?.writeText(exportText(list));setMsg('Lista copiada. Cole no chat e peça "GERAR" no final.')}} className="flex-1 min-h-12 rounded-full bg-sky text-ink font-extrabold text-sm flex items-center justify-center gap-1"><Copy size={16}/>Exportar</button>
        <button onClick={()=>{setMsg('');setImp(true)}} className="flex-1 min-h-12 rounded-full bg-sky text-ink font-extrabold text-sm flex items-center justify-center gap-1"><Upload size={16}/>Importar</button></div>{msg&&<p className="text-xs text-mint mt-2">{msg}</p>}</div>
    {ed&&<Sheet title="Editar item" onClose={()=>setEd(null)}><label className="block text-xs font-bold text-mute mt-3">Texto<input value={ed.text} onChange={e=>setEd({...ed,text:e.target.value})} className={inp+' h-12'}/></label>
      <label className="block text-xs font-bold text-mute mt-3">Categoria<select value={ed.cat} onChange={e=>setEd({...ed,cat:e.target.value})} className={inp+' h-12'}>{[...new Set([...CATS,ed.cat])].map(c=><option key={c}>{c}</option>)}</select></label>
      <button onClick={()=>{set(l=>l.map(x=>x.id===ed.id?ed:x));setEd(null)}} className="mt-4 w-full h-12 rounded-full bg-pink text-ink font-extrabold">Salvar</button></Sheet>}
    {imp&&<Sheet title="Importar do chat" onClose={()=>setImp(false)}><textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={8} placeholder='{"actions":[...]}' aria-label="JSON do chat" className="mt-3 w-full rounded-2xl bg-card2 p-3 text-[14px] text-white outline-none focus:ring-2 ring-lilac font-mono"/>
      {prev&&<p className={`text-xs mt-2 ${prev.err?'text-pink':'text-mint'}`}>{prev.err||prev.s}</p>}<button onClick={apply} disabled={!prev||!!prev.err} className="mt-3 w-full h-12 rounded-full bg-pink text-ink font-extrabold disabled:opacity-40">Aplicar</button></Sheet>}</div>}
