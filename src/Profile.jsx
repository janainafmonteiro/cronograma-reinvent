import {useEffect,useState} from 'react';import QRCode from 'qrcode';import {Download,Maximize2,Upload,X,Trash2} from 'lucide-react';
const DEF={phrase:'Hi, I’m Janaina, Student and SBGL. Nice to meet you!',url:'',img:''};
const SUG=['Hi, I’m Janaina! Student and SBGL. Nice to meet you, let’s connect!','Hello! I’m Janaina, Student and SBGL. Scan to connect on LinkedIn.','Hi, I’m Janaina, Student and SBGL. Great to meet you!'];
const norm=u=>{u=u.trim();return u?(/^https?:\/\//i.test(u)?u:'https://'+u):''};
export default function Profile(){
  const [p,setP]=useState(()=>{try{return{...DEF,...JSON.parse(localStorage.getItem('rv26p'))}}catch{return DEF}}),[qr,setQr]=useState(''),[full,setFull]=useState(false),[err,setErr]=useState('');
  const url=norm(p.url),shown=p.img||qr;
  useEffect(()=>{try{localStorage.setItem('rv26p',JSON.stringify(p))}catch{setErr('Imagem grande demais para salvar neste aparelho.')}},[p]);
  useEffect(()=>{if(!url){setQr('');return}QRCode.toDataURL(url,{width:720,margin:2,errorCorrectionLevel:'M',color:{dark:'#1E1A2E',light:'#FFFFFF'}}).then(setQr).catch(()=>setQr(''))},[url]);
  const up=e=>{const f=e.target.files[0];if(!f)return;if(f.size>1.5e6){setErr('Use uma imagem de até 1,5 MB.');return}setErr('');const r=new FileReader();r.onload=()=>setP(x=>({...x,img:r.result}));r.readAsDataURL(f)};
  const save=async()=>{const im=new Image();im.src=shown;await im.decode();const W=1080,H=1400,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    x.fillStyle='#1E1A2E';x.fillRect(0,0,W,H);x.fillStyle='#FFB8D1';x.font='800 40px Nunito,system-ui,sans-serif';x.textAlign='center';x.fillText('RE:INVENT 2026',W/2,110);
    x.fillStyle='#fff';x.font='800 62px Nunito,system-ui,sans-serif';const w=p.phrase.split(' ');let l='',y=210;for(const t of w){const n=l?l+' '+t:t;if(x.measureText(n).width>W-160&&l){x.fillText(l,W/2,y);y+=78;l=t}else l=n}x.fillText(l,W/2,y);
    x.fillStyle='#fff';x.beginPath();x.roundRect(190,y+60,700,700,48);x.fill();x.drawImage(im,215,y+85,650,650);
    if(url){x.fillStyle='#CDB8FF';x.font='700 34px Nunito,system-ui,sans-serif';x.fillText(url.replace(/^https?:\/\//,'').slice(0,48),W/2,y+840)}
    c.toBlob(async b=>{const f=new File([b],'meu-qr.png',{type:'image/png'});if(navigator.canShare?.({files:[f]})){try{await navigator.share({files:[f]});return}catch{}}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='meu-qr.png';a.click()})};
  const inp='mt-1 w-full rounded-2xl bg-card2 px-3 text-[16px] text-white outline-none focus:ring-2 ring-lilac';
  return <main className="px-4 pt-4 flex flex-col gap-3">
    <div className="rounded-3xl bg-card p-4"><div className="text-lg font-extrabold text-peach">Meu perfil</div>
      <label className="block text-xs font-bold text-mute mt-3">Link do LinkedIn<input value={p.url} onChange={e=>setP({...p,url:e.target.value})} inputMode="url" autoCapitalize="off" placeholder="linkedin.com/in/seu-perfil" className={inp+' h-12'}/></label>
      <label className="block text-xs font-bold text-mute mt-3">Frase<textarea value={p.phrase} onChange={e=>setP({...p,phrase:e.target.value})} maxLength={120} rows={2} className={inp+' py-2 resize-none'}/></label>
      <div className="flex flex-wrap gap-2 mt-2">{SUG.map(s=><button key={s} onClick={()=>setP({...p,phrase:s})} className="min-h-11 px-3 py-1 rounded-2xl bg-card2 text-lilac text-xs font-bold text-left">{s}</button>)}</div></div>
    <div className="rounded-3xl bg-card p-4 text-center">
      <p className="text-lg font-extrabold leading-snug">{p.phrase}</p>
      {shown?<img src={shown} alt="QR code do meu LinkedIn" className="mx-auto mt-3 w-64 h-64 rounded-3xl bg-white p-2 object-contain"/>:<div className="mx-auto mt-3 w-64 h-64 rounded-3xl border-2 border-dashed border-card2 flex items-center justify-center text-mute text-sm px-6">Cole seu link do LinkedIn acima para gerar o QR code</div>}
      {url&&!p.img&&<p className="text-xs text-mute mt-2 break-all">{url}</p>}
      {shown&&<div className="flex gap-2 mt-3"><button onClick={()=>setFull(true)} className="flex-1 h-12 rounded-full bg-pink text-ink font-extrabold flex items-center justify-center gap-1"><Maximize2 size={18}/>Tela cheia</button><button onClick={save} className="flex-1 h-12 rounded-full bg-peach text-ink font-extrabold flex items-center justify-center gap-1"><Download size={18}/>Salvar imagem</button></div>}</div>
    <div className="rounded-3xl bg-card p-4"><div className="font-extrabold text-sm">Usar meu próprio QR code</div><p className="text-xs text-mute mt-1">Já tem um QR (ex.: do app do LinkedIn)? Envie a imagem e ela substitui a gerada.</p>
      <div className="flex gap-2 mt-2"><label className="flex-1 h-12 rounded-full bg-lilac text-ink font-extrabold flex items-center justify-center gap-1 cursor-pointer"><Upload size={18}/>Enviar imagem<input type="file" accept="image/*" onChange={up} className="sr-only"/></label>
      {p.img&&<button aria-label="Remover imagem enviada" onClick={()=>setP({...p,img:''})} className="w-12 h-12 rounded-full bg-card2 text-pink flex items-center justify-center"><Trash2 size={18}/></button>}</div>
      {err&&<p className="text-xs text-pink mt-2">{err}</p>}</div>
    {full&&<div className="fixed inset-0 z-50 bg-white text-ink flex flex-col items-center justify-center gap-4 p-6"><button aria-label="Fechar" onClick={()=>setFull(false)} className="absolute top-4 right-4 w-12 h-12 rounded-full bg-ink text-white flex items-center justify-center" style={{top:'calc(16px + env(safe-area-inset-top,0px))'}}><X/></button>
      <p className="text-2xl font-extrabold text-center max-w-xs leading-snug">{p.phrase}</p><img src={shown} alt="QR code" style={{width:'min(80vw,50dvh)',height:'min(80vw,50dvh)'}} className="object-contain"/></div>}
  </main>}
