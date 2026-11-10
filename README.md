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

## Offline
- Aba **Rota** › botão **Offline** (topo): salva o mapa da região (Strip, Allegiant, aeroporto) e o caminho a pé de todos os trechos do roteiro atual. Refaça se mudar o roteiro.
- O botão **Mapa** do card abre a Rota já no trecho que termina naquele evento.

## Horários automáticos (sem IA)
- Cada card é **fixo** (cadeado) ou **flexível**. Sessões, shows, voos etc. são fixos por padrão; refeições, Expo, fotos e passeios são flexíveis. Dá para trocar no card expandido ou na edição.
- Ao **arrastar** um card flexível, ele gruda logo depois do evento anterior + deslocamento (rua + por dentro) e os flexíveis seguintes são empurrados se faltar tempo. Ao **editar** um horário, o card editado fica como está e os flexíveis ao redor se ajustam.
- Os avisos de conflito (Apertado/Inviável) aparecem **na hora** nos cards, sem precisar tocar em Otimizar.
- Botão **Ajustar horários** em cada dia: "Resolver conflitos" (empurra só quando falta tempo) ou "Compactar o dia" (elimina buracos). Tudo com Desfazer.

## Atualizar o app e conversar fora do app
- Menu ⋮ › **Atualizar app (limpar cache)**: remove o cache do app (não apaga seus dados nem o mapa offline) e busca a versão nova. A **versão** (data/hora do build) aparece no mesmo menu para você conferir se atualizou.
- Menu ⋮ › **Copiar roteiro para conversar no Gemini/Claude**: cola contexto + roteiro (com ids). Decida lá e peça "GERAR"; depois **Importar do chat** e cole o JSON.

## Backup
Menu ⋮ › **Backup e restauração**: exporta/importa um arquivo JSON com roteiro, modelo salvo, lista, cofre (com anexos, opcional), gastos, contatos, pitches e perfil (a chave do Gemini não entra). Também tem **Restaurar padrão do código**, que troca só o roteiro e a lista pelo padrão do app (desfazível).
