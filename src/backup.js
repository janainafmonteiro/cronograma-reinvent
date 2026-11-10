import {getF,putF} from './idb';
const KEYS=['rv26','rv26o','rv26x','rv26p','rv26m'];   // a chave do Gemini (rv26k) NÃO entra no backup
const toDataURL=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
export async function buildBackup(withFiles){
  const data={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!=null)data[k]=v});
  const files={};
  if(withFiles){const x=JSON.parse(data.rv26x||'{}'),list=[...(x.vault||[]),...(x.people||[])].flatMap(i=>i.files||[]);
    for(const f of list){try{const b=await getF(f.id);if(b)files[f.id]={name:f.name,type:f.type,data:await toDataURL(b)}}catch{}}}
  return {app:'roteiro-reinvent',v:1,exportedAt:new Date().toISOString(),data,files}}
export async function saveBackup(withFiles){
  const b=await buildBackup(withFiles),blob=new Blob([JSON.stringify(b)],{type:'application/json'}),name=`roteiro-backup-${new Date().toISOString().slice(0,10)}.json`,f=new File([blob],name,{type:'application/json'});
  if(navigator.canShare?.({files:[f]})){try{await navigator.share({files:[f]});return 'share'}catch(e){if(e.name==='AbortError')return 'cancel'}}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);return 'download'}
export async function restoreBackup(file){
  const j=JSON.parse(await file.text());if(j.app!=='roteiro-reinvent'||!j.data)throw new Error('Este arquivo não é um backup do app.');
  for(const k of KEYS){if(j.data[k]!=null)localStorage.setItem(k,j.data[k]);else localStorage.removeItem(k)}
  let n=0;for(const [id,f] of Object.entries(j.files||{})){await putF(id,await (await fetch(f.data)).blob());n++}
  return {files:n,when:j.exportedAt}}
