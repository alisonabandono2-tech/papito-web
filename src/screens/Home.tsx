import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import LiveRanking from '../components/LiveRanking';
import { Card, Btn, Pill, Cover, Badge, Rise, Bar, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { useCountUp, levelInfo, VIP_XP, dayNumber } from '../utils';
import { SLOTS_PG, SLOTS_PR, CRASH, LIVE, gameUrl, norm, type Game } from '../data/games';
import { OFFER_URL, openExternal } from '../data/links';
import { getProfile, firstName } from '../profile';
import { store, useStore, streakOf } from '../store';
import { toast } from '../toast';

// "jogando agora" respira: varia um pouco em volta do número real coletado da casa
function liveOnline(g: Game, tick: number) {
  if (!g.online) return 0;
  let h = 0;
  for (let i = 0; i < g.id.length; i++) h = (h * 31 + g.id.charCodeAt(i)) | 0;
  const x = Math.sin(h + tick * 1.7) * 0.5 + 0.5;
  return Math.max(1, Math.round(g.online * (0.9 + x * 0.2)));
}

export default function Home({ onNav }: { onNav: (k: string) => void }) {
  const prof = getProfile();
  const NOME = firstName(prof?.nome || 'Parceiro') || 'Parceiro';
  const FEM = prof?.fem ?? false;
  const st = useStore();
  const day = store.today();
  const streak = streakOf(st.checkins);

  const [cat, setCat] = useState<'slots' | 'crash' | 'vivo'>('slots');
  const [prov, setProv] = useState<'pg' | 'pr'>('pg');
  const [q, setQ] = useState('');
  const [tick, setTick] = useState(0);
  const [showOffer, setShowOffer] = useState(() => {
    try { return localStorage.getItem('papito_offer_seen') !== '1'; } catch { return true; }
  });

  useEffect(() => {
    store.markOpened();
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const lvl = levelInfo(st.xp, FEM);
  const xpInto = useCountUp(lvl.into, 700);
  const vipOpen = st.xp >= VIP_XP;
  const quizDone = (day.quiz || []).length;
  const reflexLeft = 3 - (day.reflex || []).length;

  const games: Game[] = useMemo(() => {
    const nq = norm(q.trim());
    if (nq) return [...SLOTS_PG, ...SLOTS_PR, ...CRASH, ...LIVE].filter((g) => norm(g.name).includes(nq));
    const list = cat === 'crash' ? CRASH : cat === 'vivo' ? LIVE : prov === 'pg' ? SLOTS_PG : SLOTS_PR;
    return [...list].sort((a, b) => b.online - a.online);
  }, [cat, prov, q]);

  const openGame = (g: Game) => {
    sfx.whoosh();
    haptic(12);
    toast(`Abrindo ${g.name} na 1win…`);
    setTimeout(() => openExternal(gameUrl(g)), 250);
  };

  const claim = () => {
    if (!store.checkin()) return;
    haptic(20);
    sfx.coin();
    fireConfetti();
  };

  const dismissOffer = () => {
    try { localStorage.setItem('papito_offer_seen', '1'); } catch { /* sem storage */ }
    setShowOffer(false);
  };

  const dicas = [
    'Antes de jogar, combina comigo o tempo e o limite lá em Ferramentas.',
    'Bateu sua meta? Saca e para. O jogo continua amanhã.',
    'RTP é média de milhões de rodadas, não promessa da sua sessão.',
    'Nenhum horário paga mais. Joga quando tiver com cabeça boa.',
  ];
  const dica = dicas[dayNumber() % dicas.length];

  return (
    <div className="screen">
      <div className="scroll" style={{ paddingBottom: 'calc(var(--nav-h) + 16px)' }}>
        <div style={{ padding: '16px 14px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Cabeçalho */}
          <Rise i={0}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Papito size={50} pose="joinha" />
              <div style={{ minWidth: 0 }}>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 21, lineHeight: 1 }}>{FEM ? `Oi, ${NOME}!` : `E aí, ${NOME}!`}</div>
                <div className="tiny" style={{ fontWeight: 700 }}>Nível {lvl.index + 1} · {lvl.name}</div>
              </div>
              <div style={{ flex: 1 }} />
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => onNav('recompensas')} aria-label={`${streak} dias seguidos`}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--card)', border: '2px solid var(--amber)', borderRadius: 14, padding: '6px 10px', color: '#FFF', fontWeight: 800, fontSize: 14 }}>
                <motion.span animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}>🔥</motion.span>{streak}
              </motion.button>
              <SoundBtn />
            </div>
          </Rise>

          {/* Carteira (sem saldo fictício: o saldo fica na conta da casa) */}
          <Rise i={1}>
            <Card style={{ background: 'linear-gradient(135deg, #1A3A8A 0%, #12285E 60%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,201,40,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💰</div>
                <div style={{ flex: 1 }}>
                  <div className="baloo" style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>Sua carteira na 1win</div>
                  <div className="tiny" style={{ fontWeight: 600 }}>Seu saldo fica na sua conta da casa. Nenhuma senha passa pelo Papito.</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <Btn shine onClick={() => onNav('carteira-dep')} style={{ height: 48 }}>＋ Depositar</Btn>
                <Btn kind="ghost" onClick={() => onNav('carteira-saque')} style={{ height: 48 }}>↓ Sacar</Btn>
              </div>
            </Card>
          </Rise>

          {/* Nível + presença do dia */}
          <Rise i={2}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>Seu nível</div>
                <div style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 800 }}>{xpInto} / {lvl.span} XP</div>
              </div>
              <div style={{ marginTop: 8 }}><Bar pct={lvl.pct} h={12} /></div>
              <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6 }}>Próximo: {lvl.nextName}{!vipOpen && ` · Crash VIP libera no ${FEM ? 'Braba' : 'Brabo'}`}</div>
              <motion.div animate={day.checkin ? {} : { rotate: [0, -2, 2, -2, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.2 }}>
                <Btn shine={!day.checkin} disabled={day.checkin} onClick={claim} style={{ marginTop: 12, opacity: day.checkin ? 0.7 : 1, background: day.checkin ? 'var(--bg)' : undefined, color: day.checkin ? 'var(--amber)' : undefined, boxShadow: day.checkin ? 'none' : undefined }}>
                  {day.checkin ? '✓ Presença marcada! Volta amanhã' : '🎁 Abrir meu baú de hoje · +50 XP'}
                </Btn>
              </motion.div>
            </Card>
          </Rise>

          {/* Atalhos */}
          <Rise i={3}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Tile emoji="🧪" title="Laboratório" sub="Bac Bo · Football · Roleta" onClick={() => onNav('lab')} />
              <Tile emoji="🧠" title="Quiz do dia" sub={quizDone >= 5 ? 'Feito hoje ✓' : `${5 - quizDone} perguntas · até +50 XP`} onClick={() => onNav('quiz')} hot={quizDone < 5} />
              <Tile emoji="⏱️" title="Reflexo" sub={reflexLeft > 0 ? `${reflexLeft} tentativas hoje` : 'Volta amanhã'} onClick={() => onNav('reflexo')} hot={reflexLeft > 0} />
              <Tile emoji={vipOpen ? '🚀' : '🔒'} title="Crash VIP" sub={vipOpen ? 'Liberado!' : `faltam ${VIP_XP - st.xp} XP`} onClick={() => onNav('vip')} gold />
            </div>
          </Rise>

          <Rise i={4}>
            <LiveRanking onVote={() => onNav('votar')} onOpen={openGame} />
          </Rise>

          {/* Dica do Papito */}
          <Rise i={5}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <Papito size={44} pose="pensativo" />
              <div style={{ background: '#FFF', color: 'var(--bg)', borderRadius: '16px 16px 16px 4px', padding: '10px 12px', fontWeight: 700, fontSize: 14, lineHeight: 1.35, flex: 1 }}>
                <span style={{ color: 'var(--blue)' }}>Dica do Papito:</span> {dica}
              </div>
            </div>
          </Rise>

          {/* Busca + categorias */}
          <Rise i={6}>
            <div style={{ position: 'relative' }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar jogo (ex: tiger, olympus)" aria-label="Buscar jogo"
                style={{ width: '100%', height: 48, borderRadius: 16, border: '1.5px solid var(--line)', background: 'var(--card)', color: '#FFF', fontSize: 15, padding: '0 40px 0 42px', outline: 'none' }} />
              <span style={{ position: 'absolute', left: 14, top: 13 }}>🔎</span>
              {q && <button onClick={() => setQ('')} aria-label="Limpar" style={{ position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, border: 0, background: 'var(--bg)', color: '#FFF' }}>✕</button>}
            </div>
          </Rise>

          {!q && (
            <Rise i={7}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {([['slots', '🎰 Slots'], ['crash', '🚀 Crash'], ['vivo', '🔴 Ao vivo']] as const).map(([k, label]) => (
                  <Pill key={k} active={cat === k} onClick={() => setCat(k)} style={{ height: 46, borderRadius: 23, fontSize: 15 }}>{label}</Pill>
                ))}
              </div>
              {cat === 'slots' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                  {([['pg', 'PG Soft', SLOTS_PG.length], ['pr', 'Pragmatic', SLOTS_PR.length]] as const).map(([k, label, n]) => (
                    <motion.button key={k} whileTap={{ scale: 0.95 }} onClick={() => { sfx.pop(); setProv(k); }}
                      style={{ height: 40, borderRadius: 12, border: '1px solid var(--line)', fontWeight: 800, fontSize: 14, background: prov === k ? '#FFF' : 'var(--card)', color: prov === k ? 'var(--bg)' : '#FFF' }}>
                      {label} · {n}
                    </motion.button>
                  ))}
                </div>
              )}
            </Rise>
          )}

          {q && <div className="tiny" style={{ fontWeight: 700 }}>{games.length ? `${games.length} jogo(s) encontrado(s)` : `Não achei "${q}". Tenta só uma parte do nome.`}</div>}

          {/* Grade de jogos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            <AnimatePresence mode="popLayout">
              {games.map((g, i) => (
                <motion.button key={g.id} layout initial={{ opacity: 0, y: 14, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ...spring, delay: Math.min(i * 0.015, 0.25) }} whileTap={{ scale: 0.92, rotate: -1 }} onClick={() => openGame(g)}
                  style={{ background: 'none', border: 0, padding: 0, color: '#FFF', textAlign: 'left', minWidth: 0 }}>
                  <div style={{ position: 'relative' }}>
                    <Cover img={g.img} />
                    {g.isNew && <Badge style={{ left: 6, background: 'var(--amber)', color: '#1A1300' }}>NOVO</Badge>}
                    {!q && i < 3 && <Badge style={{ right: 6, background: 'var(--bg)', color: 'var(--amber)' }}>TOP {i + 1}</Badge>}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 13, marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted2)', fontWeight: 700 }}>
                    <span className="pulse" style={{ width: 7, height: 7, borderRadius: 4, background: '#5FD38D' }} />
                    {g.online > 0 ? `${liveOnline(g, tick).toLocaleString('pt-BR')} jogando` : 'mesa ao vivo'}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <div className="tiny" style={{ textAlign: 'center', lineHeight: 1.4, padding: '4px 8px' }}>
            Os jogos abrem na 1win com o seu cadastro. "Jogando agora" é a contagem da casa. +18 · Aposta não é investimento.
          </div>
        </div>
      </div>

      {/* Oferta do dia — aparece 1 vez só por jogador */}
      <AnimatePresence>
        {showOffer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(5,12,30,.84)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 30 }}>
            <motion.div initial={{ scale: 0.8, y: 30, rotate: -3 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{ width: '100%', background: 'var(--card)', border: '2px solid var(--amber)', borderRadius: 26, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <Papito size={104} pose="comemorando" />
              <div className="baloo" style={{ fontWeight: 800, fontSize: 20, color: 'var(--amber)', letterSpacing: 1 }}>OFERTA DO DIA</div>
              <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 1.3, repeat: Infinity }} className="baloo"
                style={{ fontWeight: 800, fontSize: 60, lineHeight: 0.95, textShadow: '0 4px 0 var(--blue)' }}>+500%</motion.div>
              <div style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 700 }}>de bônus no seu <span style={{ color: 'var(--amber)' }}>primeiro depósito</span></div>
              <div className="tiny">Regras e condições na casa parceira. +18 · Jogue com responsabilidade.</div>
              <Btn shine onClick={() => { sfx.coin(); dismissOffer(); openExternal(OFFER_URL); }} style={{ height: 56, fontSize: 20 }}>Aproveitar agora 🚀</Btn>
              <button onClick={() => { sfx.tap(); dismissOffer(); }} style={{ height: 44, width: '100%', borderRadius: 14, background: 'none', border: '2px solid var(--line)', color: '#FFF', fontWeight: 700, fontSize: 15 }}>Agora não</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tile({ emoji, title, sub, onClick, hot, gold }: { emoji: string; title: string; sub: string; onClick: () => void; hot?: boolean; gold?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.94 }} whileHover={{ y: -2 }} transition={spring} onClick={() => { sfx.whoosh(); haptic(8); onClick(); }}
      style={{ position: 'relative', textAlign: 'left', background: gold ? 'linear-gradient(135deg,#3A2A00,#12285E 70%)' : 'var(--card)', border: gold ? '1.5px solid var(--amber)' : '1.5px solid transparent', borderRadius: 18, padding: 12, color: '#FFF', minHeight: 92 }}>
      <motion.div animate={hot ? { y: [0, -3, 0] } : {}} transition={{ duration: 1.4, repeat: Infinity }} style={{ fontSize: 26 }}>{emoji}</motion.div>
      <div className="baloo" style={{ fontWeight: 800, fontSize: 16, marginTop: 2 }}>{title}</div>
      <div className="tiny" style={{ fontWeight: 700, color: gold ? 'var(--amber)' : 'var(--muted)' }}>{sub}</div>
      {hot && <span className="pulse" style={{ position: 'absolute', top: 10, right: 10, width: 10, height: 10, borderRadius: 5, background: '#FF5A5F' }} />}
    </motion.button>
  );
}

function SoundBtn() {
  const [m, setM] = useState(sfx.isMuted());
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={() => setM(sfx.toggle())} aria-label={m ? 'Ligar som' : 'Desligar som'}
      style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--card)', border: 0, color: '#FFF', fontSize: 18 }}>
      {m ? '🔇' : '🔊'}
    </motion.button>
  );
}
