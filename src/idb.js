// Anexos (fotos/PDF) ficam no IndexedDB: funcionam offline e não estouram o limite do localStorage.
const open=()=>new Promise((res,rej)=>{const r=indexedDB.open('rv26',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=async(m,f)=>{const db=await open();return new Promise((res,rej)=>{const t=db.transaction('f',m),q=f(t.objectStore('f'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
export const putF=(k,b)=>tx('readwrite',s=>s.put(b,k));export const getF=k=>tx('readonly',s=>s.get(k));export const delF=k=>tx('readwrite',s=>s.delete(k));
