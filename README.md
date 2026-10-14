# Papito — App (PWA)

App do Papito em **React + Vite** (PWA instalável). Esta é a **base + a tela Início** completa,
com motion (Framer Motion), confete, som sintetizado (Web Audio, sem arquivos) e vibração.

## Rodar no seu PC

Precisa do **Node.js** instalado (você já tem o instalador no Downloads; se ainda não instalou, instale o Node 20+).

Abra o terminal (Prompt de Comando ou PowerShell) na pasta `papito-app` e rode:

```bash
npm install
npm run dev
```

Vai abrir em `http://localhost:5173`. Abre no navegador do celular (na mesma rede, pelo endereço "Network"
que aparece no terminal) ou no Chrome do PC em modo celular (F12 → ícone de celular) pra ver direitinho.

## Gerar a versão final (pra publicar)

```bash
npm run build
```

Isso cria a pasta `dist/`. É só subir ela num host grátis:

- **Vercel** ou **Netlify**: conecta a pasta/projeto e sai no ar em `papito.online`.
- Qualquer hospedagem estática serve (a pasta `dist` é só HTML/CSS/JS).

Depois de publicado em HTTPS, o app pode ser **instalado** no celular ("Adicionar à tela inicial"),
com ícone e tela cheia — é o que substitui a loja de apps.

## O que já está pronto

- **Início**: carteira (Depositar/Sacar), nível e baú diário, atalhos, ranking ao vivo, busca e
  catálogo real (50 PG Soft + 50 Pragmatic + 10 Crash + 4 ao vivo) com capas e link direto de cada jogo.
- **Depositar / Sacar**: passo a passo animado. Depósito abre direto a janela da casa (`?open=deposit`).
  Saque não tem link na casa, então o passo a passo mostra onde tocar e abre o site.
- **Prêmios**: presença diária com sequência real, escada de níveis, missões do dia.
- **Escolher 3 jogos**, **Quiz** (52 perguntas, 5 por dia), **Reflexo** (mini game).
- **Ferramentas**: Modo Sessão (cronômetro com limite), calculadora de banca, diário de sessões.
- **Laboratório**: Bac Bo, Football Studio e Roleta, 5 estratégias cada, com mesa animada,
  simulador com dinheiro fictício, riscos e comparação.
- **Crash VIP**: libera no nível Brabo (1000 XP, só usando o app). Simulador de vela e chance real.
- Motion (Framer Motion), som (Web Audio) e vibração em tudo. PWA instalável.

Os links da casa (domínio, código de afiliado) ficam todos em `src/data/links.ts`.
O catálogo fica em `src/data/catalog.ts` (puxado da API da casa).

## Estrutura

```
public/            capas.jpg (sprite), papito/*.jpg (poses), ícones, manifest, sw.js
src/
  App.tsx          router simples (Início + placeholders)
  screens/Home.tsx tela Início completa
  components/      Papito.tsx, BottomNav.tsx
  data/games.ts    catálogo de exemplo + posição das capas no sprite
  sfx.ts           sons (Web Audio) + vibração
  utils.ts         contador animado, níveis, formato de dinheiro
  index.css        tema e estilos
```

Dados (saldo, jogadores online, catálogo) são de exemplo. No app real vêm do backend que
atualiza o catálogo da casa e, com SSO, dos dados do jogador. +18 · Jogue com responsabilidade.
