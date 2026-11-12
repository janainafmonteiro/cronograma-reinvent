/** Extrai a lista "actions" de um texto colado (aceita cercas ```json e texto em volta). */
export function parseActions(text){
  const t=(text||'').replace(/```(?:json)?/gi,'').trim(),a=t.search(/[\[{]/),b=Math.max(t.lastIndexOf('}'),t.lastIndexOf(']'));
  if(a<0||b<a)throw new Error('Não encontrei JSON no texto colado.');
  let j;try{j=JSON.parse(t.slice(a,b+1))}catch{throw new Error('JSON inválido. Peça para a IA responder só com o bloco JSON.')}
  const acts=Array.isArray(j)?j:j.actions;if(!Array.isArray(acts)||!acts.length)throw new Error('O JSON não tem a lista "actions".');return acts}
