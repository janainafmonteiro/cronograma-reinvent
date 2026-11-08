import {useState,useRef,useEffect} from 'react';import {defState,match,nid} from './data';
const ld=k=>{try{return JSON.parse(localStorage.getItem(k))}catch{return null}};
export function useStore(){
  const [S,setS]=useState(()=>ld('rv26')||defState());const ref=useRef(S);ref.current=S;
  const hist=useRef([]);const [hn,setHn]=useState(0);
  const ck=()=>{hist.current.push(JSON.stringify(ref.current));if(hist.current.length>40)hist.current.shift();setHn(hist.current.length)};
  const upd=f=>{ck();setS(p=>f(p))};
  const undo=()=>{const u=hist.current.pop();setHn(hist.current.length);if(u)setS(JSON.parse(u))};
  const reset=()=>upd(()=>ld('rv26o')||defState());
  const saveOrig=()=>localStorage.setItem('rv26o',JSON.stringify(ref.current));
  useEffect(()=>{try{localStorage.setItem('rv26',JSON.stringify(S))}catch{}},[S]);
  useEffect(()=>{const seen=new Set(),miss=S.days.flatMap(d=>d.ev).filter(e=>!S.wish.some(w=>match(w,e))&&!seen.has(e.ti)&&seen.add(e.ti));
    if(miss.length)setS(p=>({...p,wish:[...p.wish,...miss.map(e=>({id:nid(),name:e.ti,k:e.ti,p:'want'}))]}))},[S.days]);
  return {S,ref,setS,upd,ck,undo,reset,saveOrig,canUndo:hn>0};
}
