export const getCfg=()=>({key:localStorage.getItem('rv26k')||'',model:localStorage.getItem('rv26m')||'gemini-flash-latest'});
export const setCfg=(k,m)=>{localStorage.setItem('rv26k',k.trim());localStorage.setItem('rv26m',(m||'gemini-flash-latest').trim())};
const SYS=`Você é o assistente de roteiro de uma pessoa no AWS re:Invent 2026 em Las Vegas (28/11 a 05/12). Base: hotel Treasure Island. Responda SEMPRE em JSON válido, em português do Brasil.
Deslocamento = tempo a pé na rua + "imposto de cassino" de 15 a 20 min para atravessar mega resorts (Venetian, Palazzo, Encore/Wynn, Caesars, MGM, Mandalay Bay, Bellagio, Paris, New York-New York, Treasure Island). Referências: Venetian→Encore 20–25 min a pé; Venetian→Caesars Forum 20–25; Strip norte→New York-New York ~5 km (Uber 20–30 min no pico); Allegiant Stadium: Uber 20–30 min, shuttles 45–90 min em dias de evento.
Eventos FIXOS (não mudam de horário): sessões e chalk talks (códigos como ARC204), keynote, shows (Sphere), voos, helicóptero, corrida, festas e recepções oficiais. Eventos FLEXÍVEIS (refeições, tempo livre, Expo, fotos, passeios) podem ser deslocados.
Horários no formato "HH:MM – HH:MM" ou "HH:MM".`;
async function call(prompt){
  const {key,model}=getCfg();if(!key)throw new Error('Configure a chave do Gemini no menu ⋮');
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({systemInstruction:{parts:[{text:SYS}]},contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',temperature:0.2,maxOutputTokens:8192}})});
  if(!r.ok)throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0,140)}`);
  const j=await r.json();const t=(j.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('');
  try{return JSON.parse(t.replace(/```json|```/g,'').trim())}catch{throw new Error('Resposta inválida do Gemini')}
}
const compact=days=>JSON.stringify(days.map(d=>({day:d.id,label:d.label,events:d.ev.map(e=>({id:e.id,time:e.t,title:e.ti,place:e.loc,streetMin:e.m,innerMin:e.c}))})));
const DAYS='ids de dia: d28=28/11, d29=29/11, d30=30/11, d01=01/12, d02=02/12, d03=03/12, d04=04/12, d05=05/12.';
export const chatAI=(text,hist,days)=>call(`Roteiro atual: ${compact(days)}
${DAYS}
Conversa recente: ${JSON.stringify(hist.map(m=>({de:m.r==='me'?'usuário':'assistente',texto:m.x})))}
Nova mensagem do usuário: ${JSON.stringify(text)}
Responda {"reply":string,"actions":[...]}. Tipos de action:
{"type":"add","day":"d01","time":"16:30 – 17:30","title":"","place":"","streetMin":0,"innerMin":0,"swag":false,"afterId":null}
{"type":"update","id":"","time":"","title":"","place":"","streetMin":0,"innerMin":0}
{"type":"move","id":"","day":"d01","afterId":null}
{"type":"delete","id":""}
Regras: use só ids existentes. Se faltar o local de um evento novo e o usuário não pediu para você escolher, faça UMA pergunta em "reply" e deixe actions []. Se pediu para escolher, escolha um lugar real e explique em "reply". Ao mover ou criar, use "update" para ajustar os horários dos eventos FLEXÍVEIS afetados e preencha streetMin/innerMin. "afterId" null = encaixar pela ordem de horário. Seja breve.`);
export const analyzeAI=days=>call(`Analise o roteiro dia a dia: ${compact(days)}
Para CADA evento devolva {"id","time","streetMin","innerMin","status","note"}: time = horário sugerido (igual ao atual se estiver ok); streetMin/innerMin = deslocamento a partir do evento anterior do mesmo dia (o primeiro vem do Treasure Island); status "ok"|"warn"|"bad"; note (até 160 caracteres, só para warn/bad, senão ""). Se houver conflito, mova eventos FLEXÍVEIS; se envolver só eventos FIXOS, mantenha os horários e marque "bad" explicando. Responda {"items":[...]}.`);
