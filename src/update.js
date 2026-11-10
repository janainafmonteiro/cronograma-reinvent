/** Força a versão mais nova do app: remove service workers e caches do app (mantém o mapa offline e seus dados) e recarrega por uma URL nova. */
export async function hardUpdate(){
  try{const regs=(await navigator.serviceWorker?.getRegistrations?.())||[];await Promise.all(regs.map(r=>r.unregister()));
    const ks=await caches.keys();await Promise.all(ks.filter(k=>k!=='osm-tiles').map(k=>caches.delete(k)))}catch{}
  location.replace(location.pathname+'?u='+Date.now())}
