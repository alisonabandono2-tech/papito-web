// Motor do Laboratório de Estratégias (portado do protótipo validado).
// Tudo é simulação com dinheiro fictício e as regras/probabilidades oficiais de cada jogo.
// Nenhuma estratégia muda a chance real — o laboratório existe pra mostrar isso na prática.

export type GameKey = 'bacbo' | 'fs' | 'roleta';
export type Strat = { name: string; tag: string; short: string; how: string; rules: string[]; ex: (string | number)[]; exBet: string; exText: string; wait: string; risks: string[]; win: string; edge: string };
export type LabGame = { label: string; unit: number; edgeTxt: string; noMemory: string; truth1: string; truth2: string; foot: string; freq: [string, string, number][]; strats: Strat[] };

export const GAMES: Record<GameKey, LabGame> = {
      bacbo: {
        label: 'Bac Bo', unit: 5, edgeTxt: 'R$ 1,13', noMemory: 'Os dados não lembram do que saiu antes.',
        truth1: 'Nenhuma estratégia muda a chance: Player 44,37% · Banker 44,37% · Empate 11,27%.',
        truth2: 'A perda média é a margem da casa: R$ 1,13 a cada R$ 100 apostados.',
        foot: 'Simulação com dados virtuais e as regras oficiais do Bac Bo (RTP 98,87%). Nenhuma aposta real. +18.',
        freq: [['P', 'Player', 44.37], ['B', 'Banker', 44.37], ['T', 'Empate', 11.27]],
        strats: [
          { name: 'Surfar a sequência', tag: 'Padrão', short: 'Saiu 2x o mesmo lado? Entra nele de novo.', how: 'A ideia é pegar carona numa sequência que está rolando: saiu duas vezes, vai de novo no mesmo.', rules: ['Só conta Player e Banker. Empate não entra na conta.', 'Se as 2 últimas foram do mesmo lado, aposta nesse lado.', 'Ficha fixa de R$ 5 por entrada, sem dobrar.'], ex: ['B', 'P', 'P'], exBet: 'Player', exText: 'Saiu Player duas vezes seguidas, então a entrada é no Player.', wait: 'Ainda sem entrada: esperando sair 2 iguais seguidos.', risks: ['A chance do Player na próxima rodada continua 44,37%, tendo sequência ou não.', 'Sequências longas existem, mas ninguém sabe quando começam nem quando acabam.', 'Empate faz a entrada perder 10% da ficha.'], win: '44,37%', edge: 'R$ 1,13' },
          { name: 'Quebra após 3 iguais', tag: 'Padrão', short: 'Saiu 3x o mesmo lado? Entra no outro.', how: 'A ideia é que, depois de muitas iguais, "tá na hora" de virar pro outro lado.', rules: ['Empate não entra na conta.', 'Se as 3 últimas foram do mesmo lado, aposta no lado oposto.', 'Ficha fixa de R$ 5 por entrada.'], ex: ['P', 'B', 'B', 'B'], exBet: 'Player', exText: 'Saiu Banker três vezes, então a entrada é no Player.', wait: 'Ainda sem entrada: esperando sair 3 iguais seguidos.', risks: ['Isso tem nome: falácia do apostador. Os dados não sabem o que saiu antes.', 'Depois de 3 Banker, o Player continua com os mesmos 44,37%.', 'Empate faz a entrada perder 10% da ficha.'], win: '44,37%', edge: 'R$ 1,13' },
          { name: 'Xadrez (alternância)', tag: 'Padrão', short: 'Tá alternando P, B, P? Entra no B.', how: 'A ideia é seguir o vai-e-vem do xadrez: se está alternando, aposta no próximo da alternância.', rules: ['Empate não entra na conta.', 'Se as 3 últimas alternaram (P, B, P ou B, P, B), aposta no próximo do vai-e-vem.', 'Ficha fixa de R$ 5 por entrada.'], ex: ['P', 'B', 'P'], exBet: 'Banker', exText: 'Saiu Player, Banker, Player, então a entrada é no Banker.', wait: 'Ainda sem entrada: esperando o vai-e-vem P, B, P.', risks: ['Alternância é só um desenho no histórico. A próxima rodada não segue desenho.', 'A chance de qualquer entrada continua 44,37%.', 'Empate faz a entrada perder 10% da ficha.'], win: '44,37%', edge: 'R$ 1,13' },
          { name: 'Gale (Martingale)', tag: 'Progressão', short: 'Perdeu? Dobra a aposta pra recuperar, até 2 vezes.', how: 'A ideia é que uma vitória paga tudo o que você perdeu antes e ainda sobra a ficha inicial.', rules: ['Entra no Banker com R$ 5.', 'Perdeu ou deu empate: dobra pra R$ 10, depois R$ 20.', 'Ganhou, ou perdeu as 3: volta pros R$ 5.'], ex: ['B', 'P', 'P'], exBet: 'R$ 20', exText: 'Perdeu R$ 5, perdeu R$ 10, então a próxima é R$ 20. Se ganhar, o lucro do ciclo inteiro é R$ 5.', wait: 'Começando um ciclo novo.', risks: ['O ciclo inteiro dá errado em cerca de 17% das vezes: perde até R$ 35 pra tentar ganhar R$ 5.', 'Ganha pouco quase sempre e perde muito de vez em quando. Por isso o placar de green engana.', 'Não muda a perda média: só junta as perdas pequenas num tombo grande.'], win: '82,8% por ciclo', edge: 'R$ 1,13' },
          { name: 'Proteção no empate', tag: 'Cobertura', short: 'Segue o último lado e põe R$ 1 no empate pra se proteger.', how: 'A ideia é que o empate, que paga até 88 por 1, salve a rodada quando acontecer.', rules: ['Aposta R$ 5 no lado que saiu por último.', 'Aposta mais R$ 1 no empate.', 'O empate paga 4:1 (soma 6, 7 ou 8) até 88:1 (soma 2 ou 12).'], ex: ['B', 'P'], exBet: 'P + empate', exText: 'Saiu Player: R$ 5 no Player e R$ 1 no empate.', wait: 'Esperando o primeiro resultado.', risks: ['A aposta no empate devolve em média só 95,52%. A proteção aumenta a perda média.', 'O empate sai em 11,27% das rodadas. Na maioria, a ficha de proteção vai embora.', 'O empate mais comum (soma 6, 7 ou 8) paga só 4:1.'], win: '44,37% + empate', edge: 'R$ 1,69' }
        ]
      },
      fs: {
        label: 'Football Studio', unit: 5, edgeTxt: 'R$ 3,73', noMemory: 'As cartas não lembram do que saiu antes.',
        truth1: 'Nenhuma estratégia muda a chance: Casa 46,27% · Visitante 46,27% · Empate 7,47%.',
        truth2: 'A perda média é a margem da casa: R$ 3,73 a cada R$ 100 apostados.',
        foot: 'Simulação com cartas virtuais e as regras oficiais do Football Studio (RTP 96,27%). Nenhuma aposta real. +18.',
        freq: [['C', 'Casa', 46.27], ['V', 'Visitante', 46.27], ['E', 'Empate', 7.47]],
        strats: [
          { name: 'Surfar a sequência', tag: 'Padrão', short: 'Saiu 2x o mesmo lado? Entra nele de novo.', how: 'A ideia é pegar carona na sequência: Casa saiu duas vezes, vai de Casa de novo.', rules: ['Só conta Casa e Visitante. Empate não entra na conta.', 'Se as 2 últimas foram do mesmo lado, aposta nesse lado.', 'Ficha fixa de R$ 5 por entrada.'], ex: ['V', 'C', 'C'], exBet: 'Casa', exText: 'Saiu Casa duas vezes seguidas, então a entrada é na Casa.', wait: 'Ainda sem entrada: esperando sair 2 iguais seguidos.', risks: ['A chance da Casa na próxima rodada continua 46,27%.', 'Sequência não "puxa" sequência: cada carta sai do baralho sem saber das anteriores.', 'No empate, a aposta perde metade da ficha.'], win: '46,27%', edge: 'R$ 3,73' },
          { name: 'Quebra após 3 iguais', tag: 'Padrão', short: 'Saiu 3x o mesmo lado? Entra no outro.', how: 'A ideia é que, depois de 3 iguais, "tá na hora" de virar.', rules: ['Empate não entra na conta.', 'Se as 3 últimas foram do mesmo lado, aposta no oposto.', 'Ficha fixa de R$ 5 por entrada.'], ex: ['C', 'V', 'V', 'V'], exBet: 'Casa', exText: 'Saiu Visitante três vezes, então a entrada é na Casa.', wait: 'Ainda sem entrada: esperando sair 3 iguais seguidos.', risks: ['É a falácia do apostador: o baralho não compensa o que saiu antes.', 'Depois de 3 Visitante, a Casa continua com 46,27%.', 'No empate, a aposta perde metade da ficha.'], win: '46,27%', edge: 'R$ 3,73' },
          { name: 'Xadrez (alternância)', tag: 'Padrão', short: 'Tá alternando C, V, C? Entra no V.', how: 'A ideia é seguir o vai-e-vem: se está alternando, aposta no próximo da alternância.', rules: ['Empate não entra na conta.', 'Se as 3 últimas alternaram (C, V, C ou V, C, V), aposta no próximo do vai-e-vem.', 'Ficha fixa de R$ 5 por entrada.'], ex: ['C', 'V', 'C'], exBet: 'Visitante', exText: 'Saiu Casa, Visitante, Casa, então a entrada é no Visitante.', wait: 'Ainda sem entrada: esperando o vai-e-vem C, V, C.', risks: ['Alternância é só um desenho no histórico.', 'A chance de qualquer entrada continua 46,27%.', 'No empate, a aposta perde metade da ficha.'], win: '46,27%', edge: 'R$ 3,73' },
          { name: "D'Alembert", tag: 'Progressão', short: 'Perdeu? Sobe R$ 5. Ganhou? Desce R$ 5.', how: 'A ideia é que vitórias e derrotas "vão se equilibrar" com o tempo, então a aposta sobe devagar quando perde.', rules: ['Entra sempre na Casa, começando com R$ 5.', 'Perdeu: a próxima aposta sobe R$ 5.', 'Ganhou: a próxima desce R$ 5 (nunca abaixo de R$ 5).'], ex: ['V', 'V'], exBet: 'R$ 15', exText: 'Perdeu com R$ 5 e com R$ 10, então a próxima é R$ 15. Se ganhar, a seguinte desce pra R$ 10.', wait: 'Começando.', risks: ['Não existe equilíbrio garantido: cada rodada é nova, e uma fase ruim pode durar muito.', 'Numa fase ruim a aposta sobe de 5 em 5 e o prejuízo acelera.', 'Não muda a perda média.'], win: '46,27%', edge: 'R$ 3,73' },
          { name: 'Paroli', tag: 'Progressão', short: 'Ganhou? Dobra. 3 vitórias seguidas, embolsa e volta.', how: 'É o gale ao contrário: dobra só quando ganha, pra aproveitar uma boa fase sem arriscar o próprio bolso.', rules: ['Entra sempre na Casa com R$ 5.', 'Ganhou: dobra (R$ 10, depois R$ 20).', 'Ganhou 3 seguidas, ou perdeu: volta pros R$ 5.'], ex: ['C', 'C'], exBet: 'R$ 20', exText: 'Ganhou com R$ 5 e com R$ 10, então a próxima é R$ 20. Se ganhar, embolsa e volta pros R$ 5.', wait: 'Começando.', risks: ['3 vitórias seguidas só saem em cerca de 10% dos ciclos.', 'Perde pouco por vez, mas perde mais vezes do que ganha.', 'Não muda a perda média.'], win: '46,27% (3 seguidas: 9,9%)', edge: 'R$ 3,73' }
        ]
      },
      roleta: {
        label: 'Roleta', unit: 1, edgeTxt: 'R$ 2,70', noMemory: 'A roleta não lembra do que saiu antes.',
        truth1: 'Nenhuma estratégia muda a chance: Vermelho 48,65% · Preto 48,65% · Zero 2,70%.',
        truth2: 'A perda média é a margem da casa: R$ 2,70 a cada R$ 100 apostados, em qualquer aposta.',
        foot: 'Simulação com uma roleta europeia virtual (37 números, RTP 97,30%). Nenhuma aposta real. +18.',
        freq: [['R', 'Vermelho', 48.65], ['K', 'Preto', 48.65], ['Z', 'Zero', 2.7]],
        strats: [
          { name: 'Gale nas cores', tag: 'Progressão', short: 'Perdeu no vermelho? Dobra até acertar.', how: 'A ideia é que uma hora o vermelho vem, e a vitória paga todas as perdas de antes.', rules: ['Aposta R$ 1 no vermelho.', 'Perdeu: dobra (R$ 2, 4, 8, 16…).', 'Ganhou: volta pro R$ 1.'], ex: [8, 26, 15], exBet: 'R$ 8 no vermelho', exText: 'Perdeu 3 seguidas (R$ 1, R$ 2, R$ 4), então a próxima é R$ 8. Se ganhar, o lucro do ciclo é R$ 1.', wait: 'Começando.', risks: ['7 derrotas seguidas acontecem em cerca de 1 a cada 100 ciclos e exigem R$ 128 pra ganhar R$ 1.', 'Com banca de R$ 100, o gale não passa da 6ª dobra.', 'O zero faz vermelho e preto perderem juntos: por isso a chance é 48,65%, não 50%.'], win: '48,65% por giro', edge: 'R$ 2,70' },
          { name: 'Fibonacci', tag: 'Progressão', short: 'A aposta segue 1, 1, 2, 3, 5, 8… quando perde.', how: 'Uma progressão mais calma que o gale: anda uma casa na sequência quando perde e volta duas quando ganha.', rules: ['Aposta no vermelho seguindo 1, 1, 2, 3, 5, 8, 13…', 'Perdeu: anda uma casa na sequência.', 'Ganhou: volta duas casas.'], ex: [11, 20, 33], exBet: 'R$ 3', exText: 'Perdeu três (R$ 1, R$ 1 e R$ 2), então a próxima aposta é R$ 3.', wait: 'Começando.', risks: ['Sobe mais devagar que o gale, mas uma fase ruim leva a apostas de R$ 21, R$ 34, R$ 55…', 'Precisa de mais vitórias do que derrotas pra fechar no lucro.', 'Não muda a perda média.'], win: '48,65% por giro', edge: 'R$ 2,70' },
          { name: 'James Bond', tag: 'Cobertura', short: 'Cobre 25 dos 37 números de uma vez.', how: 'Famosa por causa do 007: espalha a aposta pra cobrir quase toda a mesa em cada giro.', rules: ['R$ 14 nos números de 19 a 36.', 'R$ 5 na linha de 13 a 18.', 'R$ 1 no zero. Total de R$ 20 por giro.'], ex: [27], exBet: '+R$ 8', exText: 'Saiu 27, que está entre 19 e 36: lucro de R$ 8 no giro.', wait: 'Começando.', risks: ['Quando sai de 1 a 12 (32% das vezes), perde os R$ 20 inteiros.', 'Ganha com frequência, mas cada derrota apaga 2 ou 3 vitórias.', 'Não muda a perda média.'], win: '67,6% por giro', edge: 'R$ 2,70' },
          { name: 'Vizinhos', tag: 'Cobertura', short: 'Um número e os 2 vizinhos de cada lado da roda.', how: 'A ideia é cobrir uma "fatia" da roda: o número escolhido e os vizinhos dele.', rules: ['Escolhe um número.', 'Aposta R$ 1 nele e nos 2 vizinhos de cada lado da roda: 5 números.', 'Acertou: recebe R$ 36 de volta pelos R$ 5 apostados.'], ex: [17], exBet: '2 · 25 · 17 · 34 · 6', exText: 'Escolheu o 17: a aposta cobre 2, 25, 17, 34 e 6, que ficam juntos na roda.', wait: 'Começando.', risks: ['Acerta em 13,5% dos giros: em média, 6 giros perdidos pra cada acerto.', 'Sequências de 15 ou 20 giros sem acertar são comuns.', 'Não muda a perda média.'], win: '13,5% por giro', edge: 'R$ 2,70' },
          { name: 'Duas dúzias', tag: 'Cobertura', short: 'Aposta na 1ª e na 2ª dúzia ao mesmo tempo.', how: 'A ideia é cobrir dois terços da mesa pra ganhar quase sempre um pouquinho.', rules: ['R$ 1 na 1ª dúzia (1 a 12).', 'R$ 1 na 2ª dúzia (13 a 24).', 'Saiu numa delas: lucro de R$ 1. Saiu 25 a 36 ou zero: perde R$ 2.'], ex: [7], exBet: '+R$ 1', exText: 'Saiu 7, que está na 1ª dúzia: lucro de R$ 1.', wait: 'Começando.', risks: ['Ganha 65% das vezes, mas cada derrota leva 2 vitórias embora.', '3 derrotas seguidas acontecem em cerca de 4% das vezes.', 'Não muda a perda média.'], win: '64,9% por giro', edge: 'R$ 2,70' }
        ]
      }
    };


export const REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
export const WHEEL = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

export type Roll = { w: string; p?: number[]; b?: number[]; ps?: number; bs?: number; c?: number; v?: number; cs?: number; vs?: number; n?: number };
export type Bet = { type?: string; side?: string; stake: number; tie?: number; lvl?: number; total: number; label: string; set?: number[]; pick?: number };
export type Ev = { bet: Bet | null; roll: Roll; net: number; kind: 'none' | 'green' | 'red' | 'tie'; galeNext: boolean };
export type Sim = { hist: (string | number)[]; cnt: Record<string, number>; prog: any; bank: number; minBank: number; n: number; greens: number; reds: number; entries: number; maxStake: number; last: Roll | null; ev: Ev | null; staked: number; broke: boolean; hb: number[] };

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const isRed = (n: number) => REDS.indexOf(n) >= 0;
export function neighbors(n: number) { const i = WHEEL.indexOf(n), out: number[] = []; for (let d = -2; d <= 2; d++) out.push(WHEEL[(i + d + 37) % 37]); return out; }
export function tiePay(sum: number) { if (sum === 2 || sum === 12) return 88; if (sum === 3 || sum === 11) return 25; if (sum === 4 || sum === 10) return 10; if (sum === 5 || sum === 9) return 6; return 4; }
export const money = (v: number) => (v < 0 ? '-' : '') + 'R$ ' + Math.abs(v).toFixed(2).replace('.', ',');
export const signed = (v: number) => (v > 0 ? '+' : v < 0 ? '-' : '') + 'R$ ' + Math.abs(v).toFixed(2).replace('.', ',');
export function sideName(game: GameKey, x: string) {
  if (game === 'bacbo') return x === 'P' ? 'Player' : x === 'B' ? 'Banker' : 'Empate';
  if (game === 'fs') return x === 'C' ? 'Casa' : x === 'V' ? 'Visitante' : 'Empate';
  return x === 'R' ? 'Vermelho' : x === 'K' ? 'Preto' : 'Zero';
}
export function chip(game: GameKey, x: string | number) {
  if (game === 'roleta') { const n = Number(x); return { t: String(n), bg: n === 0 ? '#1F9D55' : isRed(n) ? '#D93A3F' : '#05070F', fg: '#FFFFFF' }; }
  const A = game === 'bacbo' ? 'P' : 'C', B = game === 'bacbo' ? 'B' : 'V';
  return { t: String(x), bg: x === A ? '#1F5BFF' : x === B ? '#D93A3F' : '#FFC928', fg: x === A || x === B ? '#FFFFFF' : '#1A1300' };
}
export const rankTxt = (k: number) => (k <= 10 ? String(k) : ['J', 'Q', 'K', 'A'][k - 11]);

export function roll(game: GameKey, r: () => number): Roll {
  if (game === 'bacbo') {
    const d = () => 1 + Math.floor(r() * 6);
    const p = [d(), d()], b = [d(), d()], ps = p[0] + p[1], bs = b[0] + b[1];
    return { p, b, ps, bs, w: ps > bs ? 'P' : bs > ps ? 'B' : 'T' };
  }
  if (game === 'fs') {
    const c = 2 + Math.floor(r() * 13);
    let v: number;
    if (r() < 31 / 415) v = c; else { const others: number[] = []; for (let k = 2; k <= 14; k++) if (k !== c) others.push(k); v = others[Math.floor(r() * 12)]; }
    const cs = Math.floor(r() * 4), vs = Math.floor(r() * 4);
    return { c, v, cs, vs, w: c > v ? 'C' : v > c ? 'V' : 'E' };
  }
  const n = Math.floor(r() * 37);
  return { n, w: n === 0 ? 'Z' : isRed(n) ? 'R' : 'K' };
}

function decide(game: GameKey, sid: number, s: Sim): Bet | null {
  const pg = s.prog || {};
  if (game === 'roleta') {
    if (sid === 0) { const st = pg.g || 1; return { type: 'red', stake: st, total: st, label: 'Vermelho · ' + money(st) }; }
    if (sid === 1) { const st = FIB[Math.min(pg.fi || 0, FIB.length - 1)]; return { type: 'red', stake: st, total: st, label: 'Vermelho · ' + money(st) }; }
    if (sid === 2) return { type: 'jb', stake: 20, total: 20, label: 'James Bond · R$ 20,00' };
    if (sid === 3) { const pick = WHEEL[((pg.seed || 11) * 7 + 3) % 37]; const set = neighbors(pick); return { type: 'viz', set, pick, stake: 5, total: 5, label: 'Vizinhos do ' + pick + ' · R$ 5,00' }; }
    return { type: 'duz', stake: 2, total: 2, label: '1ª + 2ª dúzia · R$ 2,00' };
  }
  if (pg.forced) return pg.forced;
  const A = game === 'bacbo' ? 'P' : 'C', B = game === 'bacbo' ? 'B' : 'V', T = game === 'bacbo' ? 'T' : 'E';
  const name = (x: string) => sideName(game, x);
  const mk = (side: string, stake: number, extra?: Partial<Bet>): Bet => Object.assign({ side, stake, tie: 0, lvl: 0, total: stake, label: name(side) + ' · ' + money(stake) }, extra || {});
  const nt = s.hist.filter((x) => x !== T) as string[];
  const opp = (x: string) => (x === A ? B : A);
  if (sid === 0) { const l = nt.slice(-2); return l.length === 2 && l[0] === l[1] ? mk(l[1], 5) : null; }
  if (sid === 1) { const l = nt.slice(-3); return l.length === 3 && l[0] === l[1] && l[1] === l[2] ? mk(opp(l[2]), 5) : null; }
  if (sid === 2) { const l = nt.slice(-3); return l.length === 3 && l[0] !== l[1] && l[1] !== l[2] ? mk(opp(l[2]), 5) : null; }
  if (game === 'bacbo') {
    if (sid === 3) return mk('B', 5);
    const last = nt.slice(-1);
    return last.length ? mk(last[0], 5, { tie: 1, total: 6, label: name(last[0]) + ' · R$ 5,00 + R$ 1,00 no empate' }) : null;
  }
  if (sid === 3) { const st = pg.dal || 5; return mk('C', st); }
  const st = pg.par || 5; return mk('C', st);
}
function settle(game: GameKey, bet: Bet, ro: Roll) {
  if (game === 'bacbo') {
    let net = ro.w === bet.side ? bet.stake : ro.w === 'T' ? -bet.stake * 0.1 : -bet.stake;
    if (bet.tie) net += ro.w === 'T' ? bet.tie * tiePay(ro.ps!) : -bet.tie;
    return net;
  }
  if (game === 'fs') return ro.w === bet.side ? bet.stake : ro.w === 'E' ? -bet.stake / 2 : -bet.stake;
  const n = ro.n!;
  if (bet.type === 'red') return isRed(n) ? bet.stake : -bet.stake;
  if (bet.type === 'jb') { if (n >= 19) return 8; if (n >= 13) return 10; if (n === 0) return 16; return -20; }
  if (bet.type === 'viz') return bet.set!.indexOf(n) >= 0 ? 31 : -5;
  return n >= 1 && n <= 24 ? 1 : -2;
}
function update(game: GameKey, sid: number, pg: any, bet: Bet | null, net: number) {
  const p = Object.assign({}, pg || {});
  let cycleEnd = true, galeNext = false;
  if (game === 'bacbo' && sid === 3 && bet) {
    if (net <= 0 && (bet.lvl || 0) < 2) { const st = bet.stake * 2; p.forced = { side: bet.side, stake: st, tie: 0, lvl: (bet.lvl || 0) + 1, total: st, label: 'Banker · ' + money(st) + ' (gale ' + ((bet.lvl || 0) + 1) + ')' }; cycleEnd = false; galeNext = true; }
    else p.forced = null;
  }
  if (game === 'fs' && bet) {
    if (sid === 3) p.dal = net > 0 ? Math.max(5, (p.dal || 5) - 5) : (p.dal || 5) + 5;
    if (sid === 4) { if (net > 0) { const w = (p.pw || 0) + 1; if (w >= 3) { p.pw = 0; p.par = 5; } else { p.pw = w; p.par = (p.par || 5) * 2; } } else { p.pw = 0; p.par = 5; } }
  }
  if (game === 'roleta' && bet) {
    if (sid === 0) { p.g = net > 0 ? 1 : (p.g || 1) * 2; galeNext = net <= 0; }
    if (sid === 1) p.fi = net > 0 ? Math.max(0, (p.fi || 0) - 2) : (p.fi || 0) + 1;
    if (sid === 3) p.seed = (p.seed || 11) + 5;
  }
  return { p, cycleEnd, galeNext };
}
export const fresh = (): Sim => ({ hist: [], cnt: {}, prog: {}, bank: 100, minBank: 100, n: 0, greens: 0, reds: 0, entries: 0, maxStake: 0, last: null, ev: null, staked: 0, broke: false, hb: [100] });

export function step(game: GameKey, sid: number, s: Sim, r: () => number, light = false): Sim {
  if (s.broke) return s;
  let bet = decide(game, sid, s);
  let broke = false;
  if (bet && bet.total > s.bank) { bet = null; broke = true; }
  const ro = roll(game, r);
  let bank = s.bank, greens = s.greens, reds = s.reds, entries = s.entries, staked = s.staked, maxStake = s.maxStake, prog = s.prog;
  const ev: Ev = { bet, roll: ro, net: 0, kind: 'none', galeNext: false };
  if (bet) {
    if (!bet.lvl) entries++;
    staked += bet.total; maxStake = Math.max(maxStake, bet.total);
    const net = Math.round(settle(game, bet, ro) * 100) / 100;
    bank = Math.round((bank + net) * 100) / 100;
    ev.net = net;
    const up = update(game, sid, prog, bet, net);
    prog = up.p; ev.galeNext = up.galeNext;
    const isTie = (game === 'bacbo' && ro.w === 'T') || (game === 'fs' && ro.w === 'E');
    if (net > 0) { greens++; ev.kind = 'green'; }
    else { ev.kind = isTie ? 'tie' : 'red'; if (up.cycleEnd) reds++; }
  }
  let hb = s.hb;
  if (!light) { hb = s.hb.concat([bank]); if (hb.length > 400) hb = hb.filter((_, i) => i % 2 === 0); }
  const cnt = Object.assign({}, s.cnt); cnt[ro.w] = (cnt[ro.w] || 0) + 1;
  const hv = game === 'roleta' ? ro.n! : ro.w;
  return { hist: s.hist.concat([hv]).slice(-30), cnt, prog, bank, minBank: Math.min(s.minBank, bank), n: s.n + 1, greens, reds, entries, maxStake, last: ro, ev, staked, broke: broke || bank < 1, hb };
}

export type CmpRow = { name: string; tag: string; lucroPct: number; median: number; worst: number; maxStake: number; edge: number };
export function runCompare(game: GameKey): CmpRow[] {
  const sessions = 500, rounds = 200, base = Math.floor(Math.random() * 1e9);
  const G = GAMES[game];
  return G.strats.map((st, sid) => {
    const finals: number[] = []; let wins = 0, worst = Infinity, maxStake = 0, staked = 0, net = 0;
    for (let k = 0; k < sessions; k++) {
      const r = rng(base + k * 2654435761);
      let s = fresh();
      for (let i = 0; i < rounds && !s.broke; i++) s = step(game, sid, s, r, true);
      finals.push(s.bank); if (s.bank > 100) wins++; worst = Math.min(worst, s.minBank);
      maxStake = Math.max(maxStake, s.maxStake); staked += s.staked; net += s.bank - 100;
    }
    finals.sort((a, b) => a - b);
    return { name: st.name, tag: st.tag, lucroPct: wins / sessions, median: finals[Math.floor(finals.length / 2)], worst, maxStake, edge: staked > 0 ? (-net / staked) * 100 : 0 };
  });
}

// Fala do Papito sobre a rodada que acabou de sair (mesma lógica do protótipo).
export function talkFor(game: GameKey, sid: number, ev: Ev | null, quem: string): { talk: string; pose: string } {
  const G = GAMES[game], S = G.strats[sid];
  if (!ev) return { talk: 'Banca fictícia de R$ 100, nada de dinheiro de verdade. Aperta pra jogar uma rodada, ' + quem + '.', pose: 'apontando' };
  if (!ev.bet) return { talk: S.wait, pose: 'pensativo' };
  if (ev.kind === 'green') return { talk: 'GREEN! ' + signed(ev.net) + '. ' + (ev.bet.lvl ? 'O gale recuperou, mas o lucro do ciclo inteiro é só R$ 5,00.' : 'Foi sorte da rodada, não da regra.'), pose: 'comemorando' };
  if (ev.kind === 'tie') {
    let talk = game === 'bacbo'
      ? 'Empate ' + ev.roll.ps + ' a ' + ev.roll.bs + '. ' + (sid === 4 ? 'A proteção pagou ' + tiePay(ev.roll.ps!) + ' por 1. Saldo da rodada: ' + signed(ev.net) + '.' : 'A aposta perdeu 10%: ' + signed(ev.net) + '.')
      : 'Empate de cartas! A aposta perde metade: ' + signed(ev.net) + '.';
    if (ev.galeNext) talk += ' Pelo gale, a próxima dobra.';
    return { talk, pose: ev.net > 0 ? 'comemorando' : 'surpreso' };
  }
  return { talk: 'RED: ' + signed(ev.net) + '. ' + (ev.galeNext ? 'Pela regra, a próxima aposta dobra.' : G.noMemory), pose: ev.galeNext ? 'desconfiado' : 'triste' };
}
