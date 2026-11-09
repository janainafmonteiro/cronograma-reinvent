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

## IA (Gemini) e Rota
- Menu ⋮ › **Configurar IA (Gemini)**: cole sua chave (aistudio.google.com/apikey). Ela fica só no aparelho (localStorage), nunca no GitHub. O modelo padrão é `gemini-flash-latest` e pode ser trocado ali.
- **Otimizar** (aba Roteiro): o Gemini estima deslocamentos (rua + “imposto de cassino”), marca Viável/Apertado/Inviável e sugere horários (“→ 14:35”) só para eventos flexíveis. Toque em **Aplicar** para aceitar; dá para desfazer.
- **Chat**: aceita adicionar, mover, editar e excluir (“coloque a foto na placa depois do helicóptero”) e ajusta os horários afetados.
- **Rota**: escolha o dia e use ← → para ver cada trecho (hotel → 1º evento → … → hotel) com o tracejado a pé. O caminho vem do roteador de pedestres do OpenStreetMap (precisa de internet; offline mostra linha reta). Trechos já vistos ficam em cache.
- Aviso: a chave fica no navegador do seu celular; use uma chave só para este app e restrinja pelo referrer do seu site.

## Aba "Eu" e detalhes dos cards
- **Detalhes** (dentro do card expandido): reservas/ingressos ligados ao evento (fotos e PDF, salvos offline no IndexedDB) e dicas de inglês B1 da situação; com Gemini há o botão "Mais frases".
- **Eu › Hoje**: copos de água, passos (meta 15.000) e gasto do dia vs. limite Wise. Metas editáveis na engrenagem.
- **Eu › Minhas coisas**: Cofre offline, Gastos, Quem é quem (até 2 fotos por pessoa e mensagem de follow-up), Pitch e inglês (pitches e termos editáveis) e Meu QR.
- Dados e anexos ficam só no aparelho. Limpar os dados do navegador apaga tudo: faça prints/backup dos documentos importantes antes de viajar.
