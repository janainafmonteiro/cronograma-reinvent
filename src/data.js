export const nid=()=>'n'+Math.random().toString(36).slice(2,9);
export const nrm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export const PL={must:'Indispensável',want:'Quero',opt:'Opcional',time:'Se der tempo'};
export const SW=['Retirada de badge','All Builders Welcome','LATAM Mixer','Women of the Cloud','Expo Hall, almoço e headshot','Jantar SBG Leaders','LATAM Reception','Expo Hall e almoço','Expo Happy Hour','Últimas palestras e Expo Hall','ABW Grant Closing Reception','Festa re:Play'];
const PR={'Chegada em Las Vegas':'must','Check-in e almoço':'must','Café da manhã e check-out':'must','Voo de volta':'must','Retirada de badge':'must','Chalk talk ARC204':'must','AWS Escape Room (TNC306-R)':'must','Chalk talk ARC305-R':'must','Palestra ARC328':'must','Chalk talk SEC399':'must','Keynote de Werner Vogels':'must','Foto na placa de Las Vegas':'opt','Expo Happy Hour':'opt','Coca-Cola Store e New York-New York':'time','Magic: The Gathering Night e jantar':'time'};
// Coordenadas APROXIMADAS (confira no mapa). A primeira palavra que casar vence.
const PLACES=[['treasure',36.1247,-115.1722],['venetian',36.1214,-115.1697],['palazzo',36.1237,-115.1697],['xs nightclub',36.1290,-115.1650],['encore',36.1290,-115.1650],['wynn',36.1267,-115.1656],['caesars',36.1175,-115.1650],['sphere',36.1210,-115.1617],['bellagio',36.1127,-115.1767],['paris',36.1125,-115.1707],['new york',36.1020,-115.1745],['placa',36.0820,-115.1728],['6075',36.0830,-115.1727],['allegiant',36.0909,-115.1833],['aeroporto',36.0840,-115.1537]];
export const coordsFor=l=>{const s=nrm(l);const p=PLACES.find(x=>s.includes(x[0]));return p?[p[1],p[2]]:null};
const MEGA=['venetian','palazzo','encore','wynn','caesars','bellagio','paris','new york','treasure','sphere'];
/** "Imposto de cassino": tempo extra dentro de mega resorts. Futuro: somar ao tempo do Google Maps via Gemini. */
export const casinoTax=l=>MEGA.some(m=>nrm(l).includes(m))?15:0;
const raw=[
['d28','Sáb 28 Nov',[]],
['d29','Dom 29 Nov',[
['12:00','Chegada em Las Vegas','Aeroporto LAS',0,0],
['13:30 – 15:30','Check-in e almoço','Treasure Island Hotel & Casino',25,0,['warn','Check-in padrão do TI é às 15:00. Peça para guardar a mala e siga ao badge.']],
['15:30 – 16:30','Retirada de badge','The Venetian · Mesa de Registro',3,12],
['17:00 – 20:00','All Builders Welcome','Encore · Salas Beethoven 1 e 2',8,17,['warn','Venetian → Encore leva 20–25 min a pé por dentro. Saia do badge às 16:15.']],
['20:30 – 22:30','Jantar, Bellagio e Paris','Bellagio / Paris Las Vegas',10,15]]],
['d30','Seg 30 Nov',[
['09:00 – 11:00','Sessões e labs Serverless e Node.js','Local a confirmar no app',3,12],
['11:30 – 13:00','LATAM Mixer','The Palazzo · Palazzo Stadium',4,8],
['13:30 – 14:30','Chalk talk ARC204','Local a confirmar no app',10,15,['warn','Aviso: o trajeto na rua leva 10 min, mas adicione +15 min para atravessar o cassino até o centro de convenções.']],
['15:00 – 17:30','Women of the Cloud','Encore Casa Playa → Venetian Expo',6,17],
['17:30 – 18:30','Jantar rápido e Byte Club','Campus AWS · Venetian',4,10],
['18:30 – 19:30','Coca-Cola Store e New York-New York','Extremo sul da Strip (NYNY)',20,10,['bad','Fica a ~5 km ao sul: Uber de 20–30 min no pico, mais o tempo dentro do NYNY. Não cabe em 60 min.']],
['19:30 – 20:00','Foto na placa de Las Vegas','Welcome to Fabulous Las Vegas (placa)',8,0,['bad','O check-in do helicóptero é 30–45 min antes (~19:45). Faça a foto depois do voo.']],
['20:15 – 21:30','Helicóptero noturno','6075 S Las Vegas Blvd',5,0,['warn','O ponto de encontro não fica exatamente ao lado da placa. Confirme com a operadora.']]]],
['d01','Ter 01 Dez',[
['08:30 – 11:30','AWS Escape Room (TNC306-R)','Venetian · confirmar sala no app',3,12],
['11:30 – 15:00','Expo Hall, almoço e headshot','ABW Grant Lounge · Venetian N1 Casanova 501',2,10],
['15:00 – 16:30','Focus Group de Estudantes','Caesars Forum',6,15,['warn','Rua 6 min, mas some +15 min dentro dos hotéis. Saia às 14:35.']],
['17:30 – 19:20','Jantar SBG Leaders','The Palazzo · Lower Terrace',4,12],
['19:30 – 21:15','The Sphere · Wizard of Oz','The Sphere',6,10],
['21:30 – 22:00','LATAM Reception','XS Nightclub · Encore/Wynn',8,12,['warn','Saída da Sphere leva 10–15 min extras. Você chega ~21:50.']]]],
['d02','Qua 02 Dez',[
['06:00 – 08:30','re:Invent Run 5k','Allegiant Stadium',20,5],
['09:00 – 10:00','Chalk talk ARC305-R','Local a confirmar no app',22,12,['bad','A corrida termina às 08:30 no Allegiant. Uber de 20–30 min mais banho: não dá tempo.']],
['10:00 – 13:30','Expo Hall e almoço','Venetian Expo',3,10],
['13:30 – 14:30','Palestra ARC328','Local a confirmar no app',4,12],
['14:30 – 15:30','Chalk talk SEC399','Local a confirmar no app',4,12,['warn','Se mudar de hotel, 10–15 min de intervalo não bastam.']],
['16:30 – 18:00','Expo Happy Hour','Venetian Expo',4,10],
['18:00','Magic: The Gathering Night e jantar','Local no app',5,10]]],
['d03','Qui 03 Dez',[
['08:30 – 10:30','Keynote de Werner Vogels','Venetian',3,12],
['10:30 – 12:30','Speed Networking e Mentoring','ABW Grant · Venetian N1 Casanova 405',2,8],
['13:00 – 15:30','Últimas palestras e Expo Hall','Venetian Expo',3,10],
['16:00 – 17:30','ABW Grant Closing Reception','Encore · Salas Beethoven 1 e 2',8,17,['warn','Venetian → Encore leva 20–25 min a pé. Saia às 15:35.']],
['18:30','Festa re:Play','Allegiant Stadium',20,25,['warn','Shuttles e filas levam 45–90 min só de ida. Saia do Encore às 17:30.']]]],
['d04','Sex 04 Dez',[
['08:00 – 09:30','Café da manhã e check-out','Treasure Island',0,0,['bad','O voo das 12:00 exige sair do hotel às 09:15–09:30. Faça check-out às 08:30.']],
['12:00','Voo de volta','Aeroporto LAS',25,0]]],
['d05','Sáb 05 Dez',[]]];
const EXP=/mixer|reception|welcome|women|sbg|speed|happy|festa|play|sphere|helic|placa|coca|bellagio|magic|\brun\b|5k|escape|byte|latam|jantar|networking|focus group/i;
/** Entra na lista de experiências? (edite no card para mudar) */
export const isExp=e=>e.exp!=null?e.exp:EXP.test(e.ti);
export const TRIP=Object.fromEntries(['2026-11-28','2026-11-29','2026-11-30','2026-12-01','2026-12-02','2026-12-03','2026-12-04','2026-12-05'].map((d,i)=>[d,['d28','d29','d30','d01','d02','d03','d04','d05'][i]]));
export const mk=e=>({id:nid(),t:e[0],ti:e[1],loc:e[2],m:e[3],c:e[4],n:e[5]||null,s:SW.includes(e[1])});
export const init=()=>raw.map(d=>({id:d[0],label:d[1],ev:d[2].map(mk)}));
export const defState=()=>{const days=init(),seen=new Set(),wish=[];days.forEach(d=>d.ev.forEach(e=>{if(isExp(e)&&!seen.has(e.ti)){seen.add(e.ti);wish.push({id:nid(),name:e.ti,k:e.ti,p:PR[e.ti]||'want',done:false})}}));return{days,wish}};
export const match=(w,e)=>nrm(e.ti+' '+e.loc).includes(nrm(w.k));
export const gmap=l=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(l+' Las Vegas');
