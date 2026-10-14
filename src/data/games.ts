// Catálogo e link de cada jogo. Os dados reais ficam em catalog.ts (puxados da API da casa).
export { SLOTS_PG, SLOTS_PR, CRASH, LIVE, ALL_GAMES } from './catalog';
export type { Game } from './catalog';
import { gameUrl as urlFor } from './links';
import type { Game } from './catalog';

// Abre o jogo específico na casa, com seu código de afiliado.
export const gameUrl = (g: Game) => urlFor(g.id);

// busca sem acento e sem maiúscula
export const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
