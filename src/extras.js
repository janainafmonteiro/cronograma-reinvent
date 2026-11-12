import {useState,useEffect} from 'react';import {nid} from './data';
export const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const V=(title,cat,ev=null,note='')=>({id:nid(),title,cat,note,ev,files:[]});
const C=(text,cat)=>({id:nid(),text,cat,done:false});
const T=(term,pt,ex)=>({id:nid(),term,pt,ex});
const seeds=()=>({
 vault:[V('Voo de ida','voo','Chegada em Las Vegas','Anote voo, portão e horário de cada trecho.'),V('Conexão no Rio','voo',null,'Cartão de embarque, terminal e tempo de conexão.'),V('Conexão em Miami','voo',null,'Imigração, terminal e tempo de conexão.'),V('Voo de volta','voo','Voo de volta'),
  V('Voucher Treasure Island','hotel','Check-in e almoço','Número da reserva e nome no voucher.'),V('Ingresso The Sphere','ingresso','The Sphere · Wizard of Oz','Setor, fila e assento.'),V('Ingresso do helicóptero','ingresso','Helicóptero noturno','Ponto de encontro e horário de check-in.'),V('Passaporte, ESTA/visto e seguro','outro')],
 check:[C('Passaporte válido','Documentos'),C('ESTA ou visto','Documentos'),C('Seguro viagem','Documentos'),C('Cartões e dólares em espécie','Dinheiro'),C('Avisar o banco sobre a viagem','Dinheiro'),C('Adaptador de tomada (EUA)','Tecnologia'),C('Carregador e power bank','Tecnologia'),C('eSIM ou chip internacional','Tecnologia'),C('Remédios pessoais','Saúde'),C('Protetor solar e hidratante','Saúde'),C('Casaco leve para a noite','Bagagem'),C('Calçado confortável','Bagagem'),C('Garrafa de água reutilizável','Bagagem')],
 people:[],
 pitches:[
  {id:nid(),title:'Apresentação (30 segundos)',text:'Hi, I’m Janaina. I’m a student and an SBGL. I like to build projects on AWS and help other students learn cloud. Nice to meet you! What do you do?',pt:'Use ao conhecer alguém.'},
  {id:nid(),title:'ProDrafts.tech (arquitetura)',text:'ProDrafts.tech is [what it is] for [who uses it]. I built it with [AWS services]. The frontend is [technology] and the backend is [technology]. The hardest part was [challenge], so I [solution]. Next, I want to [next step].',pt:'Preencha os [colchetes] com os seus detalhes reais.'},
  {id:nid(),title:'Liderança na comunidade',text:'I’m an SBGL, so I lead a student community called [name]. We organize [events or workshops] to help students learn [topics]. My role is to [what you do]. So far, we have [result or number].',pt:'Preencha os [colchetes].'},
  {id:nid(),title:'Perguntas para puxar assunto',text:'What are you working on right now? Which session did you like the most? How are you using AWS in your job? Can we connect on LinkedIn?',pt:'Perguntas simples (B1).'}],
 terms:[T('serverless','sem servidor (você não gerencia servidores)','My app is serverless, so I don’t manage servers.'),T('scalable','escalável','The architecture is scalable for many users.'),T('deploy','publicar / colocar no ar','I deploy my app every time I push code.'),T('latency','latência (atraso)','We reduced the latency of the API.'),T('cost-effective','custa pouco para o benefício','This solution is cost-effective for students.'),T('event-driven','orientado a eventos','Our system is event-driven.'),T('authentication','autenticação (login)','I use Cognito for authentication.'),T('database','banco de dados','Our data is stored in a database.'),T('pay-as-you-go','pague só pelo que usar','AWS is pay-as-you-go.'),T('high availability','alta disponibilidade','We designed it for high availability.')],
 surv:{water:{},steps:{},wg:8,sg:15000}});
export function useExtras(){
  const [X,setX]=useState(()=>{try{return{...seeds(),...JSON.parse(localStorage.getItem('rv26x'))}}catch{return seeds()}});
  useEffect(()=>{try{localStorage.setItem('rv26x',JSON.stringify(X))}catch{}},[X]);
  return [X,setX]}
