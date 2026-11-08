# Roteiro re:Invent 2026 (PWA)

React + Vite + Tailwind + dnd-kit + Leaflet. Instalável no celular e com mapa offline.

## Rodar no computador
    npm install
    npm run dev        # http://localhost:5173

## Publicar e atualizar sozinho (GitHub Pages + OTA)
1. Crie um repositório no GitHub e envie o projeto (branch `main`):
       git init && git add . && git commit -m "primeira versão"
       git branch -M main && git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git && git push -u origin main
2. No GitHub: **Settings › Pages › Build and deployment › Source: GitHub Actions**.
3. A cada `git push` na `main`, o workflow `.github/workflows/deploy.yml` faz o build e publica em `https://SEU_USUARIO.github.io/SEU_REPO/`.

## Instalar no celular (uma vez só, sem APK)
- Android/Chrome: abra o link › menu › Instalar app. iPhone/Safari: Compartilhar › Adicionar à Tela de Início.
- Na aba **Mapa**, toque em **Baixar mapa offline** (Wi‑Fi).
- Atualizações: o app instalado procura versão nova ao abrir, ao voltar para ele e a cada hora (com internet) e recarrega sozinho. Seus dados (localStorage) não são apagados. Se não atualizar, feche e abra o app uma vez.

## Dados
Tudo é salvo no aparelho (localStorage). Menu ⋮: voltar ao original / salvar estado atual como original. Ícone de seta: desfazer.

## Próximos passos (IA real)
- `src/data.js` › `casinoTax()` é o ponto para somar 15–20 min ao tempo do Google Maps (idealmente via Gemini).
- `src/App.jsx` › `parse()`/`send()` e `src/Wishlist.jsx` hoje são simulados; troque por chamadas a um back-end que guarde as chaves.
- Coordenadas em `src/data.js` (PLACES) são aproximadas.
