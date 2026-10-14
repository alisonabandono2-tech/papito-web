// Todos os links da casa num lugar só. Se a 1win trocar o domínio espelho, muda aqui.
export const AFF = '9g0q'; // seu código de afiliado (cassino e jogos)
export const HOUSE = 'https://1wzogj.life'; // domínio espelho que abre jogo direto

// Promoção de 500% (só no popup "Oferta do dia")
export const OFFER_URL = 'https://r1wvwsu.life/v3/aggressive-casino?p=bldr';

// Cassino (lobby) com cadastro, trackeado
export const CASINO_URL = `https://r1wnbepa.life/casino/list?open=register&p=${AFF}`;

// Depósito: a casa tem atalho oficial (?open=deposit) que abre a janela de depósito direto.
export const DEPOSIT_URL = `${HOUSE}/casino?open=deposit&p=${AFF}`;

// Saque: a casa NÃO tem atalho por link. Abre o site e o passo a passo mostra onde tocar.
export const WITHDRAW_URL = `${HOUSE}/casino?p=${AFF}`;

// Abre um jogo específico, já trackeado.
export const gameUrl = (id: string) => `${HOUSE}/casino/play/${id}?p=${AFF}`;

// Capa do jogo no CDN da casa.
export const coverUrl = (img: string) => `https://v1.bundlecdn.com/casino-images/${img}`;

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
