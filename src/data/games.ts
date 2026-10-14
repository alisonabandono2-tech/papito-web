// Catálogo de exemplo, puxado da API da casa no protótipo.
// idx = posição da capa no sprite /public/capas.jpg (12 colunas x 10 linhas).
// No app real, isso vem de um pequeno backend que atualiza o catálogo da casa.

export type Game = { name: string; online: number; idx: number; isNew?: boolean; play?: string };

export function coverPos(idx: number): string {
  const col = idx % 12;
  const row = Math.floor(idx / 12);
  const x = (col / 11) * 100;
  const y = (row / 9) * 100;
  return `${x.toFixed(4)}% ${y.toFixed(4)}%`;
}

export const SLOTS_PG: Game[] = [
  { name: 'Fortune Tiger', online: 1015, idx: 0 },
  { name: 'Fortune Rabbit', online: 835, idx: 1 },
  { name: 'Wild Bounty Showdown', online: 756, idx: 2 },
  { name: 'Pinata Wins', online: 575, idx: 3 },
  { name: 'Fortune Dragon', online: 469, idx: 4 },
  { name: 'Fortune Ox', online: 460, idx: 5 },
  { name: 'Wild Bandito', online: 420, idx: 6 },
  { name: 'Treasures of Aztec', online: 219, idx: 7 },
  { name: 'Anubis Wrath', online: 176, idx: 8 },
  { name: 'Midas Fortune', online: 138, idx: 9 },
  { name: 'Fortune Snake', online: 130, idx: 11 },
  { name: 'Fortune Mouse', online: 113, idx: 12 },
  { name: "Grimms' Bounty", online: 96, idx: 13, isNew: true },
  { name: 'Lucky Neko', online: 85, idx: 15 },
  { name: 'Mahjong Ways 2', online: 81, idx: 17 },
  { name: 'Ganesha Fortune', online: 74, idx: 19 },
  { name: 'Dragon Hatch', online: 57, idx: 26 },
  { name: 'Lucky Mischief', online: 44, idx: 49, isNew: true },
];

export const SLOTS_PR: Game[] = [
  { name: 'Gates of Olympus Super Scatter', online: 571, idx: 50 },
  { name: 'Gates of Olympus 2500', online: 466, idx: 51, isNew: true },
  { name: "Joker's Jewels", online: 350, idx: 52 },
  { name: 'Sugar Rush 1000', online: 318, idx: 53 },
  { name: 'Gates of Olympus 1000', online: 298, idx: 54 },
  { name: 'The Dog House', online: 279, idx: 55 },
  { name: 'Sweet Bonanza 2500', online: 276, idx: 56 },
  { name: 'Big Bass Splash', online: 166, idx: 58 },
  { name: 'Sweet Bonanza 1000', online: 162, idx: 59 },
  { name: 'Zeus vs Hades', online: 157, idx: 60 },
  { name: 'Big Bass Vegas 1000', online: 139, idx: 61, isNew: true },
  { name: 'Sugar Rush', online: 123, idx: 63 },
  { name: 'Cheetah Wild', online: 118, idx: 64, isNew: true },
  { name: 'Gold Party', online: 105, idx: 66 },
  { name: 'Sweet Bonanza', online: 90, idx: 70 },
  { name: 'Gates of Olympus', online: 77, idx: 74 },
  { name: 'Tigre Sortudo', online: 74, idx: 76 },
  { name: 'Deep Sea Frenzy', online: 74, idx: 77, isNew: true },
];

export const CRASH: Game[] = [
  { name: 'Aviator', online: 1530, idx: 100 },
  { name: 'Balloon', online: 184, idx: 109 },
  { name: 'Astronaut', online: 148, idx: 106 },
  { name: 'Aviamasters', online: 144, idx: 105 },
  { name: 'JetX', online: 270, idx: 101 },
  { name: 'Aviatrix', online: 66, idx: 103 },
  { name: 'Spaceman', online: 56, idx: 102 },
  { name: 'Fortune Crash', online: 53, idx: 107 },
  { name: 'Big Bass Crash', online: 46, idx: 108 },
  { name: 'Space XY', online: 36, idx: 104 },
];

export const LIVE: Game[] = [
  { name: 'Bac Bo', online: 42, idx: 111 },
  { name: 'Football Studio', online: 47, idx: 113 },
  { name: 'Lightning Roulette', online: 49, idx: 112 },
  { name: 'XXXTreme Lightning Roulette', online: 0, idx: 116 },
];

export const RANKING = [
  { place: 1, name: 'Fortune Tiger', pct: 38, idx: 0, color: 'var(--amber)' },
  { place: 2, name: 'Gates of Olympus 1000', pct: 24, idx: 54, color: 'var(--blue)' },
  { place: 3, name: 'Bac Bo', pct: 15, idx: 111, color: 'var(--blue)' },
];

// Pool de "votos da comunidade" para o ranking ao vivo (Mais escolhidos hoje).
// Começa com estes valores e varia sozinho (simulado). No app real, vem dos votos reais do backend.
// Majoritariamente slots, com Aviator e Bac Bo no meio.
export type Vote = { name: string; idx: number; votes: number };

export const VOTE_POOL: Vote[] = [
  { name: 'Fortune Tiger', idx: 0, votes: 520 },
  { name: 'Gates of Olympus 1000', idx: 54, votes: 330 },
  { name: 'Fortune Rabbit', idx: 1, votes: 240 },
  { name: 'Sweet Bonanza 1000', idx: 59, votes: 180 },
  { name: 'Fortune Ox', idx: 5, votes: 150 },
  { name: 'Aviator', idx: 100, votes: 130 },
  { name: 'Sugar Rush 1000', idx: 53, votes: 110 },
  { name: 'Bac Bo', idx: 111, votes: 90 },
];

// ---- Link do jogo (deep-link por jogo, trackeado) ----
// Padrão da casa: https://1wzogj.life/casino/play/<provedor>:<slug>?p=<codigo>
// Confirmados: PG Soft = v_pgsoft (ex.: v_pgsoft:fortuneox), Evolution = v_evolution (ex.: v_evolution:bacboaovivo).
export const AFF = '9g0q';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

// PG Soft: deriva o slug do nome (padrão confirmado com Fortune Ox).
SLOTS_PG.forEach((g) => { g.play = `v_pgsoft:${slugify(g.name)}`; });

// Ao vivo (Evolution): só os slugs confirmados; o resto cai no lobby até a gente confirmar.
const LIVE_PLAY: Record<string, string> = {
  'Bac Bo': 'v_evolution:bacboaovivo',
};
LIVE.forEach((g) => { if (LIVE_PLAY[g.name]) g.play = LIVE_PLAY[g.name]; });

// Pragmatic e Crash: provedor ainda não confirmado → abrem o lobby trackeado por enquanto.

// Monta o link ao clicar num jogo: jogo específico se tiver slug, senão o lobby.
export function gameUrl(g: Game): string {
  return g.play
    ? `https://1wzogj.life/casino/play/${g.play}?p=${AFF}`
    : `https://r1wnbepa.life/casino/list?open=register&p=${AFF}`;
}
