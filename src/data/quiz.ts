// Banco de perguntas do Quiz (do protótipo). 5 por dia, sem repetir no dia seguinte.
export type Q = { text: string; opts: string[]; ok: number; why: string };
export const BANK: Q[] = [
 {
  "text": "Um slot com RTP de 96% devolve R$ 96 a cada R$ 100 que você aposta na sua sessão?",
  "opts": [
   "Sim, sempre",
   "Não, é a média de milhões de rodadas",
   "Só se ativar o bônus"
  ],
  "ok": 1,
  "why": "O RTP é uma média de longo prazo, somando milhões de rodadas de todo mundo. Numa sessão sua, o resultado pode ficar bem longe disso."
 },
 {
  "text": "Depois de 20 rodadas sem bônus, a chance do bônus sair na próxima...",
  "opts": [
   "Aumenta",
   "Diminui",
   "Continua a mesma"
  ],
  "ok": 2,
  "why": "Cada rodada é sorteada do zero. O jogo não lembra das rodadas anteriores, então a chance não muda."
 },
 {
  "text": "Volatilidade alta quer dizer que o jogo...",
  "opts": [
   "Paga mais vezes, valores pequenos",
   "Paga menos vezes, prêmios maiores",
   "Tem RTP mais alto"
  ],
  "ok": 1,
  "why": "Alta volatilidade = prêmios mais raros e maiores. A banca oscila mais, por isso pede aposta menor."
 },
 {
  "text": "Na roleta europeia (um zero só), qual a chance de cair vermelho?",
  "opts": [
   "50%",
   "48,6%",
   "47,4%"
  ],
  "ok": 1,
  "why": "São 18 vermelhos em 37 casas (o zero conta): 18/37 = 48,6%. Os 47,4% são da roleta americana, que tem dois zeros."
 },
 {
  "text": "Quem desenvolve o Fortune Tiger?",
  "opts": [
   "Pragmatic Play",
   "PG Soft",
   "Evolution"
  ],
  "ok": 1,
  "why": "O Fortune Tiger é da PG Soft, a mesma do Fortune Ox, Rabbit e Mouse."
 },
 {
  "text": "RTP mais alto significa que você vai sair ganhando?",
  "opts": [
   "Sim",
   "Não, só devolve mais no longo prazo, mas a casa ainda tem vantagem",
   "Só em slots"
  ],
  "ok": 1,
  "why": "Mesmo um RTP alto é menor que 100%. No longo prazo, a diferença fica com a casa."
 },
 {
  "text": "Existe um \"horário pagante\" em que o slot paga mais?",
  "opts": [
   "Sim, de madrugada",
   "Não, o resultado é aleatório a qualquer hora",
   "Sim, no fim de semana"
  ],
  "ok": 1,
  "why": "O resultado é sorteado por um gerador aleatório. Hora do dia não muda nada."
 },
 {
  "text": "No Aviator, saber as velas anteriores ajuda a prever a próxima?",
  "opts": [
   "Sim",
   "Não, cada rodada é sorteada do zero",
   "Só depois de 10 velas"
  ],
  "ok": 1,
  "why": "Cada rodada é independente. O histórico mostra o passado, não a próxima vela."
 },
 {
  "text": "Quem desenvolve o Aviator?",
  "opts": [
   "Spribe",
   "Evolution",
   "PG Soft"
  ],
  "ok": 0,
  "why": "O Aviator é da Spribe, que criou o formato \"crash\" mais famoso."
 },
 {
  "text": "\"Fazer o cash out\" no Aviator é...",
  "opts": [
   "Depositar",
   "Retirar antes da vela quebrar",
   "Dobrar a aposta"
  ],
  "ok": 1,
  "why": "Cash out é tirar o valor antes do avião voar. Se a vela quebra antes, você perde a aposta."
 },
 {
  "text": "Quantos números tem a roleta europeia?",
  "opts": [
   "36",
   "37",
   "38"
  ],
  "ok": 1,
  "why": "37: do 0 ao 36. A americana tem 38, com um zero a mais."
 },
 {
  "text": "Entre roleta europeia e americana, qual é melhor pro jogador?",
  "opts": [
   "Americana",
   "Europeia (um zero só)",
   "São iguais"
  ],
  "ok": 1,
  "why": "A europeia tem um zero só, então a vantagem da casa é menor."
 },
 {
  "text": "Apostar em vermelho e preto ao mesmo tempo garante lucro?",
  "opts": [
   "Sim",
   "Não, o zero faz os dois perderem",
   "Só com o valor igual"
  ],
  "ok": 1,
  "why": "Quando sai o zero, as duas apostas perdem. Além disso, você só devolve o que apostou."
 },
 {
  "text": "Na roleta, apostar num número cheio (pleno) paga...",
  "opts": [
   "10 pra 1",
   "35 pra 1",
   "100 pra 1"
  ],
  "ok": 1,
  "why": "O pleno paga 35:1, mas a chance é de 1 em 37."
 },
 {
  "text": "No Bac Bo, o resultado é decidido por...",
  "opts": [
   "Cartas",
   "Dois dados de cada lado, a maior soma vence",
   "Uma roleta"
  ],
  "ok": 1,
  "why": "Cada lado joga dois dados. Quem tiver a maior soma vence; soma igual é empate."
 },
 {
  "text": "No Bac Bo, Player e Banker têm a mesma chance?",
  "opts": [
   "Sim",
   "Não, Banker é maior",
   "Não, Player é maior"
  ],
  "ok": 0,
  "why": "Os dois usam dois dados iguais, então têm exatamente a mesma chance."
 },
 {
  "text": "Qual empresa faz o Bac Bo e o Football Studio ao vivo?",
  "opts": [
   "Evolution",
   "Pragmatic",
   "PG Soft"
  ],
  "ok": 0,
  "why": "Os dois são da Evolution, líder em jogos de cassino ao vivo."
 },
 {
  "text": "No Football Studio, o resultado é decidido por...",
  "opts": [
   "Dados",
   "Uma carta pra cada lado, a maior vence",
   "Pênaltis"
  ],
  "ok": 1,
  "why": "Vira uma carta pra Casa e uma pro Visitante. A maior vence; iguais é empate."
 },
 {
  "text": "No Football Studio, quando dá empate, a aposta em Casa ou Visitante...",
  "opts": [
   "Ganha em dobro",
   "Perde metade",
   "É devolvida inteira"
  ],
  "ok": 1,
  "why": "No empate, quem apostou em Casa ou Visitante perde metade da ficha."
 },
 {
  "text": "Apostar mais dinheiro por rodada aumenta o RTP do slot?",
  "opts": [
   "Sim",
   "Não, o RTP é o mesmo",
   "Só em jackpots"
  ],
  "ok": 1,
  "why": "O RTP não muda com o valor. Só o tamanho do prêmio escala junto com a aposta."
 },
 {
  "text": "Depois de um grande prêmio, o slot \"esfria\" e para de pagar?",
  "opts": [
   "Sim",
   "Não, a chance da próxima rodada é a mesma",
   "Só por 1 hora"
  ],
  "ok": 1,
  "why": "O jogo não tem memória. A rodada depois de um prêmio tem a mesma chance de sempre."
 },
 {
  "text": "O que o gerador de números (RNG) garante num slot?",
  "opts": [
   "Que a casa escolhe quem ganha",
   "Que cada rodada é aleatória e independente",
   "Que todo mundo ganha às vezes"
  ],
  "ok": 1,
  "why": "O RNG sorteia cada rodada de forma independente, sem ninguém escolher o resultado."
 },
 {
  "text": "Jogo de azar é uma boa forma de investir dinheiro?",
  "opts": [
   "Sim",
   "Não, no longo prazo a casa sempre tem vantagem",
   "Só o Aviator"
  ],
  "ok": 1,
  "why": "Investimento tem retorno esperado positivo. No jogo, a matemática favorece a casa."
 },
 {
  "text": "A melhor forma de fazer a banca durar mais é...",
  "opts": [
   "Apostar tudo de uma vez",
   "Apostar uma fração pequena por rodada",
   "Dobrar sempre que perde"
  ],
  "ok": 1,
  "why": "Aposta pequena faz a banca aguentar mais rodadas e segura o impulso."
 },
 {
  "text": "\"Stop loss\" é...",
  "opts": [
   "Um bônus",
   "Um limite de perda pra você parar",
   "Um tipo de aposta"
  ],
  "ok": 1,
  "why": "É o valor que, se você perder, para na hora. Definir antes evita perseguir perda."
 },
 {
  "text": "Apostar pra \"recuperar\" o que já perdeu costuma...",
  "opts": [
   "Resolver",
   "Aumentar o prejuízo",
   "Dobrar o saldo"
  ],
  "ok": 1,
  "why": "Perseguir perda leva a apostar mais e maior, e o buraco costuma crescer."
 },
 {
  "text": "Dobrar a aposta toda vez que perde (gale) é seguro?",
  "opts": [
   "Sim",
   "Não, uma sequência de perdas quebra a banca",
   "Só no vermelho"
  ],
  "ok": 1,
  "why": "Poucas derrotas seguidas já exigem apostas enormes, e a banca ou o limite da mesa estoura."
 },
 {
  "text": "No Aviator, quanto maior o multiplicador que você espera, a chance de chegar nele...",
  "opts": [
   "Aumenta",
   "Diminui",
   "Fica igual"
  ],
  "ok": 1,
  "why": "Esperar 10x é bem mais raro que sair em 2x. Quanto maior o alvo, menor a chance."
 },
 {
  "text": "\"Provably fair\" num jogo crash quer dizer que...",
  "opts": [
   "A casa garante lucro",
   "Dá pra verificar que o resultado não foi alterado",
   "Você sempre ganha"
  ],
  "ok": 1,
  "why": "É um sistema que deixa você conferir que o resultado foi definido antes e não foi mexido."
 },
 {
  "text": "Um bônus da casa normalmente é dinheiro livre pra sacar na hora?",
  "opts": [
   "Sim",
   "Não, costuma ter regra de rollover",
   "Só o primeiro"
  ],
  "ok": 1,
  "why": "Quase todo bônus pede que você aposte um tanto de vezes antes de poder sacar."
 },
 {
  "text": "\"Rollover\" de um bônus é...",
  "opts": [
   "Um giro grátis",
   "Quantas vezes você precisa apostar antes de poder sacar",
   "Uma taxa de saque"
  ],
  "ok": 1,
  "why": "Um rollover de 10x num bônus de R$ 50 significa apostar R$ 500 antes de liberar o saque."
 },
 {
  "text": "Se você está no lucro, a decisão mais esperta costuma ser...",
  "opts": [
   "Apostar tudo pra dobrar",
   "Definir uma meta e sacar",
   "Esperar a sorte virar"
  ],
  "ok": 1,
  "why": "Quem sai no lucro definiu uma meta e parou. Continuar devolve o ganho pra casa."
 },
 {
  "text": "Na roleta, uma dúzia cobre quantos números?",
  "opts": [
   "10",
   "12",
   "18"
  ],
  "ok": 1,
  "why": "Cada dúzia tem 12 números (1-12, 13-24 ou 25-36) e paga 2:1."
 },
 {
  "text": "Depois de 5 vermelhos seguidos, o preto fica mais provável?",
  "opts": [
   "Sim",
   "Não, continua perto de 48,6%",
   "Sim, 70%"
  ],
  "ok": 1,
  "why": "A roleta não lembra do que saiu. Isso tem nome: falácia do apostador."
 },
 {
  "text": "O zero na roleta europeia é a vantagem de quem?",
  "opts": [
   "Do jogador",
   "Da casa",
   "De ninguém"
  ],
  "ok": 1,
  "why": "Quando sai o zero, as apostas de cor, par/ímpar e dúzia perdem. É a margem da casa."
 },
 {
  "text": "No Bac Bo, o empate na melhor hipótese (soma 2 ou 12) paga...",
  "opts": [
   "10 pra 1",
   "88 pra 1",
   "50 pra 1"
  ],
  "ok": 1,
  "why": "A soma 2 ou 12 é a mais rara, por isso paga 88:1. As somas comuns pagam bem menos."
 },
 {
  "text": "Apostar sempre no empate no Bac Bo é uma boa ideia?",
  "opts": [
   "Sim",
   "Não, é a aposta com o pior retorno",
   "Só às vezes"
  ],
  "ok": 1,
  "why": "A aposta no empate devolve menos no longo prazo que Player ou Banker."
 },
 {
  "text": "No Football Studio, o empate paga...",
  "opts": [
   "2 pra 1",
   "11 pra 1",
   "50 pra 1"
  ],
  "ok": 1,
  "why": "O empate paga 11:1, mas acontece em menos de 8% das rodadas."
 },
 {
  "text": "Dois jogadores no mesmo slot ao mesmo tempo pegam o mesmo resultado?",
  "opts": [
   "Sim",
   "Não, cada rodada é independente",
   "Só no bônus"
  ],
  "ok": 1,
  "why": "Cada giro é sorteado separado. Dois jogadores podem ter resultados completamente diferentes."
 },
 {
  "text": "O \"scatter\" num slot geralmente serve pra...",
  "opts": [
   "Pagar o maior prêmio sozinho",
   "Ativar rodadas grátis ou o bônus",
   "Diminuir a aposta"
  ],
  "ok": 1,
  "why": "Juntar scatters costuma destravar as rodadas grátis, onde ficam os prêmios maiores."
 },
 {
  "text": "Comprar o bônus (bonus buy) garante que você vai lucrar?",
  "opts": [
   "Sim",
   "Não, custa caro e pode não compensar",
   "Sempre dobra"
  ],
  "ok": 1,
  "why": "Você paga adiantado pelo bônus, mas o resultado continua aleatório. Pode render menos que o custo."
 },
 {
  "text": "Gastar o dinheiro das contas apostando é...",
  "opts": [
   "Ok se for pouco",
   "Nunca uma boa ideia; só aposte o que pode perder",
   "Ok se recuperar depois"
  ],
  "ok": 1,
  "why": "Dinheiro de conta e necessidade nunca entra no jogo. Só aposte o que sobra e pode perder."
 },
 {
  "text": "Um sinal de que o jogo virou problema é...",
  "opts": [
   "Jogar de vez em quando",
   "Perseguir perdas e apostar mais do que pode",
   "Sacar quando ganha"
  ],
  "ok": 1,
  "why": "Apostar mais do que pode, esconder e tentar recuperar perda são sinais de alerta. Procure ajuda."
 },
 {
  "text": "Definir tempo e banca antes de jogar serve pra...",
  "opts": [
   "Ganhar mais",
   "Evitar decisão no impulso e proteger a banca",
   "Aumentar o RTP"
  ],
  "ok": 1,
  "why": "Combinar o limite antes tira a decisão do calor do momento, que é quando a gente erra."
 },
 {
  "text": "No longo prazo, quem tem a vantagem matemática em qualquer jogo de cassino?",
  "opts": [
   "O jogador",
   "A casa",
   "Depende da sorte"
  ],
  "ok": 1,
  "why": "Todo jogo tem uma margem a favor da casa. Por isso ela existe e dá lucro."
 },
 {
  "text": "\"Vizinhos\" na roleta normalmente cobre...",
  "opts": [
   "1 número",
   "5 números (um e 2 de cada lado na roda)",
   "Metade da mesa"
  ],
  "ok": 1,
  "why": "Você aposta num número e nos 2 vizinhos de cada lado da roda física: 5 no total."
 },
 {
  "text": "Fortune Ox, Rabbit e Mouse são jogos de qual provedor?",
  "opts": [
   "Pragmatic",
   "PG Soft",
   "Spribe"
  ],
  "ok": 1,
  "why": "Toda a família \"Fortune\" é da PG Soft, a mesma do Fortune Tiger."
 },
 {
  "text": "Sweet Bonanza e Gates of Olympus são de qual provedor?",
  "opts": [
   "PG Soft",
   "Pragmatic Play",
   "Evolution"
  ],
  "ok": 1,
  "why": "Os dois são da Pragmatic Play, uma das maiores de slots."
 },
 {
  "text": "Uma sequência longa de perdas no Aviator...",
  "opts": [
   "Nunca acontece",
   "Pode acontecer a qualquer hora, por ser aleatório",
   "Só pra quem aposta pouco"
  ],
  "ok": 1,
  "why": "Como cada rodada é independente, várias velas baixas seguidas são normais e acontecem."
 },
 {
  "text": "A frase \"a casa sempre ganha\" significa que...",
  "opts": [
   "Você nunca ganha nada",
   "No longo prazo a matemática favorece o cassino",
   "O jogo é roubado"
  ],
  "ok": 1,
  "why": "Dá pra ganhar numa sessão, mas somando todo mundo e muito tempo, a margem fica com a casa."
 },
 {
  "text": "Qual destes ajuda a jogar com responsabilidade?",
  "opts": [
   "Apostar pra recuperar rápido",
   "Definir limite de tempo e de valor, e parar ao atingir",
   "Jogar sem olhar o relógio"
  ],
  "ok": 1,
  "why": "Limite de tempo e de dinheiro, definidos antes, são a base do jogo responsável."
 },
 {
  "text": "O que o histórico de resultados de um jogo ao vivo te diz sobre a próxima rodada?",
  "opts": [
   "Qual vai ser o próximo",
   "Nada: a próxima é sorteada do zero",
   "A cor que vai sair"
  ],
  "ok": 1,
  "why": "O histórico é só o passado. Nenhum padrão nele muda a chance da rodada seguinte."
 }
];
