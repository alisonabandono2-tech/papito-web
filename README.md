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

- **Início**: saldo em BRL (conta sozinho na entrada), Depositar/Sacar, XP com barra animada,
  sequência de dias, **baú diário** com confete + subida de nível em tela cheia, ranking de jogos
  com capas, categorias (Slots PG/Pragmatic, Crash, Ao vivo), grade de jogos com capas reais,
  barra inferior, oferta do dia, som e vibração em tudo.
- **Papito**: 10 poses, com respiração/vida (Framer Motion).
- **PWA**: manifest + service worker (abre offline, instala no celular).

## O que vem na sequência (reusa o protótipo já validado)

- Recompensas, Laboratório de estratégias (Bac Bo / Football Studio / Roleta), Votar 3 jogos,
  Quiz (banco de 50 perguntas), Ferramentas (Modo Sessão, calculadora, diário), Login vinculado.

## Ligações que dependem da casa (1win ou outra autorizada)

- **Login (SSO)**, **saldo/depósito/saque reais** e **abrir o jogo dentro do app** precisam da
  **API de afiliado** da casa. Os botões já estão no lugar; é só plugar quando a casa liberar.
  Nada de senha passa pelo app.

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
