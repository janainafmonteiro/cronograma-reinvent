import {useState} from 'react';import {Download,Upload,RotateCcw} from 'lucide-react';import {Sheet} from './Sheets';import {saveBackup,restoreBackup} from './backup';
export default function BackupSheet({onClose,onDefault}){
  const [files,setFiles]=useState(true),[busy,setBusy]=useState(false),[msg,setMsg]=useState(''),last=localStorage.getItem('rv26bk');
  const exp=async()=>{setBusy(true);setMsg('');try{const r=await saveBackup(files);if(r!=='cancel'){localStorage.setItem('rv26bk',String(Date.now()));setMsg('Backup gerado. Guarde o arquivo no Drive ou envie para você mesma.')}}catch(e){setMsg('Falhou: '+e.message)}setBusy(false)};
  const imp=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;if(!confirm('Substituir TODOS os dados atuais pelos do backup? Isso não pode ser desfeito.'))return;setBusy(true);
    try{const r=await restoreBackup(f);alert(`Backup restaurado (${r.files} anexo(s)). O app vai recarregar.`);location.reload()}catch(x){setMsg('Falhou: '+x.message);setBusy(false)}};
  return <Sheet title="Backup e restauração" onClose={onClose}><div className="flex flex-col gap-3 mt-2">
    <div className="rounded-3xl bg-card2 p-4"><div className="font-extrabold text-peach">Exportar backup</div>
      <p className="text-xs text-mute mt-1">Salva roteiro, modelo salvo, lista, cofre, gastos, contatos, pitches e perfil em um arquivo. A chave do Gemini não entra.</p>
      <label className="flex items-center gap-3 mt-2 min-h-11 text-sm font-bold"><input type="checkbox" checked={files} onChange={e=>setFiles(e.target.checked)} className="w-6 h-6 accent-pink"/>Incluir anexos e fotos (arquivo maior)</label>
      <button onClick={exp} disabled={busy} className="mt-2 w-full h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-1 disabled:opacity-60"><Download size={18}/>{busy?'Aguarde…':'Exportar backup'}</button>
      <p className="text-xs text-mute mt-2">{last?`Último backup: ${new Date(+last).toLocaleString('pt-BR')}`:'Você ainda não fez nenhum backup.'}</p></div>
    <div className="rounded-3xl bg-card2 p-4"><div className="font-extrabold text-peach">Importar backup</div>
      <p className="text-xs text-mute mt-1">Substitui os dados deste aparelho pelos do arquivo e recarrega o app.</p>
      <label className={`mt-2 w-full h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1 cursor-pointer ${busy?'opacity-60 pointer-events-none':''}`}><Upload size={18}/>Escolher arquivo<input type="file" accept="application/json,.json" onChange={imp} className="sr-only"/></label></div>
    <div className="rounded-3xl bg-card2 p-4"><div className="font-extrabold text-peach">Restaurar padrão do código</div>
      <p className="text-xs text-mute mt-1">Troca o roteiro e a lista pelo padrão que vem no app (útil quando eu atualizar o roteiro inicial). Seu modelo salvo, gastos, contatos e anexos não são apagados. Dá para desfazer.</p>
      <button onClick={()=>{if(confirm('Trocar o roteiro e a lista pelo padrão do código?')){onDefault();onClose()}}} className="mt-2 w-full h-12 rounded-full bg-card text-pink font-extrabold flex items-center justify-center gap-1"><RotateCcw size={18}/>Restaurar padrão</button></div>
    {msg&&<p className="text-sm text-mint">{msg}</p>}</div></Sheet>}
