import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import {VitePWA} from 'vite-plugin-pwa';
export default defineConfig({base:'./',define:{__BUILD__:JSON.stringify(new Date().toISOString())},plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icon-192.png'],
manifest:{name:'Roteiro re:Invent 2026',short_name:'Roteiro LV',description:'Roteiro pessoal de Las Vegas',theme_color:'#1E1A2E',background_color:'#1E1A2E',display:'standalone',orientation:'portrait',start_url:'./',
icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]},
workbox:{globPatterns:['**/*.{js,css,html,svg,png,woff2,woff}'],runtimeCaching:[{urlPattern:/^https:\/\/tile\.openstreetmap\.org\/.*/,handler:'CacheFirst',options:{cacheName:'osm-tiles',expiration:{maxEntries:1500,maxAgeSeconds:60*60*24*90},cacheableResponse:{statuses:[0,200]}}}]}})]});
