import React from 'react';import {createRoot} from 'react-dom/client';
import '@fontsource/nunito/600.css';import '@fontsource/nunito/800.css';import './index.css';
import App from './App.jsx';import {registerSW} from 'virtual:pwa-register';
// OTA: o service worker busca versão nova ao abrir, ao voltar para o app e a cada hora; a nova versão é aplicada sozinha.
registerSW({immediate:true,onRegisteredSW(_,r){if(!r)return;const chk=()=>r.update().catch(()=>{});setInterval(chk,3600000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')chk()})}});
createRoot(document.getElementById('root')).render(<App/>);
