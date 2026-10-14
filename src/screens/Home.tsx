import { useEffect, useMemo, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Papito from '../components/Papito';
import BottomNav from '../components/BottomNav';
import LiveRanking from '../components/LiveRanking';
import { sfx, haptic } from '../sfx';
import { useCountUp, levelInfo, money } from '../utils';
import { SLOTS_PG, SLOTS_PR, CRASH, LIVE, coverPos, gameUrl, type Game } from '../data/games';
import { getProfile, firstName } from '../profile';

// Link da promoção de 500% (usado só no popup "Oferta do dia").
const OFFER_URL = 'https://r1wvwsu.life/v3/aggressive-casino?p=bldr';
// gameUrl (link por jogo, trackeado) vem de ../data/games


function fireConfetti(big = false) {
  const colors = ['#FFC928', '#1F5BFF', '#FFFFFF', '#5FD38D', '#FF8A8E'];
  if (big) {
    confetti({ particleCount: 140, spread: 100, startVelocity: 45, origin: { y: 0.4 }, colors, scalar: 1.1 });
    setTimeout(() => confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 }, colors }), 220);
  } else {
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.45 }, colors });
  }
}

export default function Home({ onNav }: { onNav: (k: string) => void }) {
  const prof = getProfile();
  const NOME = firstName(prof?.nome || 'Parceiro') || 'Parceiro';
  const FEM = prof?.fem ?? false;

  const [cat, setCat] = useState<'slots' | 'crash' | 'vivo'>('slots');
  const [prov, setProv] = useState<'pg' | 'pr'>('pg');
  const [totalXp, setTotalXp] = useState(920);
  const [claimed, setClaimed] = useState(false);
  const [saldoTarget, setSaldoTarget] = useState(0);
  const [levelUp, setLevelUp] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showOffer, setShowOffer] = useState(() => {
    // Aparece só UMA vez na vida do jogador; depois de ver/fechar, nunca mais.
    try { return localStorage.getItem('papito_offer_seen') !== '1'; } catch { return true; }
  });

  useEffect(() => {
    const t = setTimeout(() => setSaldoTarget(24780), 200);
    return () => clearTimeout(t);
  }, []);

  const saldo = useCountUp(saldoTarget, 900);
  const lvl = levelInfo(totalXp, FEM);
  const xpInto = useCountUp(lvl.into, 700);

  const games: Game[] = useMemo(() => {
    const list = cat === 'crash' ? CRASH : cat === 'vivo' ? LIVE : prov === 'pg' ? SLOTS_PG : SLOTS_PR;
    return [...list].sort((a, b) => b.online - a.online);
  }, [cat, prov]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 1800);
  };

  const claim = () => {
    if (claimed) return;
    setClaimed(true);
    haptic(18);
    sfx.coin();
    fireConfetti();
    const before = levelInfo(totalXp, FEM).index;
    const nt = totalXp + 100;
    setTotalXp(nt);
    const afterInfo = levelInfo(nt, FEM);
    if (afterInfo.index > before) {
      setTimeout(() => {
        sfx.levelUp();
        haptic(30);
        fireConfetti(true);
        setLevelUp(afterInfo.name);
      }, 650);
    }
  };

  const openGame = (g: Game) => {
    sfx.whoosh();
    haptic(10);
    showToast(`Abrindo ${g.name} na casa…`);
    // Abre a casa com seu link de afiliado (trackeado), numa aba nova.
    window.open(gameUrl(g), '_blank', 'noopener,noreferrer');
  };

  const tapNav = (k: string) => {
    if (k === 'depositar' || k === 'whatsapp') showToast('Liga na casa parceira quando o SSO estiver ativo.');
    else onNav(k);
  };

  // Fecha a oferta e marca que o jogador já viu — não volta nunca mais.
  const dismissOffer = () => {
    try { localStorage.setItem('papito_offer_seen', '1'); } catch { /* storage off */ }
    setShowOffer(false);
  };

  // Aproveitar a oferta: abre o cadastro da casa (link de afiliado) numa nova aba.
  const abrirOferta = () => {
    sfx.coin();
    haptic(16);
    dismissOffer();
    window.open(OFFER_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="phone">
      <div className="scroll" style={{ paddingBottom: 'calc(var(--nav-h) + 16px)' }}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
          style={{ padding: '18px 14px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {/* Header */}
          <Row>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Papito size={48} pose="joinha" />
              <div>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 20, lineHeight: 1 }}>
                  {FEM ? `Oi, ${NOME}!` : `E aí, ${NOME}!`}
                </div>
                <div className="tiny">Nível {lvl.index + 1} · {lvl.name}</div>
              </div>
              <div style={{ flex: 1 }} />
              <button onClick={() => { sfx.tap(); showToast('Sua conta'); }} aria-label="Minha conta"
                style={{ width: 42, height: 42, borderRadius: 21, background: 'var(--card)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" /></svg>
              </button>
            </div>
          </Row>

          {/* Saldo */}
          <Row>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="tiny" style={{ fontWeight: 700 }}>Seu saldo</div>
                  <div className="baloo" style={{ fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{money(saldo)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg)', border: '2px solid var(--amber)', borderRadius: 12, padding: '5px 9px', fontWeight: 800, fontSize: 14 }}>
                  <Flame /> 5 dias
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <Btn onClick={() => tapNav('depositar')} primary>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1300" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg> Depositar
                </Btn>
                <Btn onClick={() => tapNav('sacar')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7 7 7-7" /></svg> Sacar
                </Btn>
              </div>
              <div style={{ fontSize: 11, color: '#8FB0FF', marginTop: 8, lineHeight: 1.35 }}>Saldo, depósito e saque ligados à sua conta. Nenhuma senha passa pelo Papito.</div>
            </Card>
          </Row>

          {/* XP + baú diário */}
          <Row>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>Seu nível</div>
                <div style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 800 }}>{xpInto} / {lvl.span} XP</div>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: 'var(--bg)', overflow: 'hidden', marginTop: 8 }}>
                <motion.div animate={{ width: `${lvl.pct}%` }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ height: 12, borderRadius: 6, background: 'var(--amber)' }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6 }}>Próximo: {lvl.nextName}</div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={claim}
                disabled={claimed}
                style={{
                  marginTop: 12, height: 50, width: '100%', borderRadius: 14, border: 0,
                  background: claimed ? 'var(--bg)' : 'var(--amber)', color: claimed ? 'var(--amber)' : '#1A1300',
                  fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {claimed ? '✓ Baú de hoje resgatado!' : '🎁 Resgatar meu baú de hoje · +100 XP'}
              </motion.button>
            </Card>
          </Row>

          {/* Ranking ao vivo */}
          <Row>
            <LiveRanking onVote={() => onNav('votar')} />
          </Row>

          {/* Categorias */}
          <Row>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {([['slots', '🎰 Slots'], ['crash', '🚀 Crash'], ['vivo', '🔴 Ao vivo']] as const).map(([k, label]) => (
                <motion.button key={k} whileTap={{ scale: 0.95 }}
                  onClick={() => { sfx.tap(); haptic(8); setCat(k); }}
                  style={{ height: 46, borderRadius: 23, border: '2px solid var(--line)', fontWeight: 800, fontSize: 15,
                    background: cat === k ? 'var(--amber)' : 'var(--card)', color: cat === k ? '#1A1300' : '#FFF' }}>
                  {label}
                </motion.button>
              ))}
            </div>
          </Row>

          {cat === 'slots' && (
            <Row>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {([['pg', 'PG Soft'], ['pr', 'Pragmatic']] as const).map(([k, label]) => (
                  <motion.button key={k} whileTap={{ scale: 0.96 }}
                    onClick={() => { sfx.tap(); setProv(k); }}
                    style={{ height: 40, borderRadius: 12, border: '1px solid var(--line)', fontWeight: 800, fontSize: 14,
                      background: prov === k ? '#FFF' : 'var(--card)', color: prov === k ? 'var(--bg)' : '#FFF' }}>
                    {label} · {k === 'pg' ? SLOTS_PG.length : SLOTS_PR.length}
                  </motion.button>
                ))}
              </div>
            </Row>
          )}

          {/* Grade de jogos */}
          <Row>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <AnimatePresence mode="popLayout">
                {games.map((g, i) => (
                  <motion.button
                    key={g.name}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => openGame(g)}
                    style={{ background: 'none', border: 0, padding: 0, color: '#FFF', textAlign: 'left', minWidth: 0 }}
                  >
                    <div style={{ position: 'relative' }}>
                      <div className="cover" style={{ width: '100%', aspectRatio: '120 / 164', borderRadius: 12, backgroundPosition: coverPos(g.idx) }} />
                      {g.isNew && <Badge style={{ left: 6, background: 'var(--amber)', color: '#1A1300' }}>NOVO</Badge>}
                      {i < 3 && <Badge style={{ right: 6, background: 'var(--bg)', color: 'var(--amber)' }}>TOP {i + 1}</Badge>}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 13, marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted2)', fontWeight: 700 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--amber)' }} />
                      {g.online > 0 ? `${g.online.toLocaleString('pt-BR')} jogando` : 'mesa ao vivo'}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </Row>

          <div className="tiny" style={{ textAlign: 'center', lineHeight: 1.4, padding: '4px 8px' }}>
            "Jogando agora" é a contagem de jogadores na casa. +18 · Aposta não é investimento.
          </div>
        </motion.div>
      </div>

      <BottomNav active="inicio" onNav={tapNav} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            style={{ position: 'absolute', left: 16, right: 16, bottom: 'calc(var(--nav-h) + 14px)', background: '#0F2250', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 14px', fontWeight: 700, fontSize: 14, textAlign: 'center', zIndex: 20 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Oferta do dia */}
      <AnimatePresence>
        {showOffer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(5,12,30,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 30 }}>
            <motion.div initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{ width: '100%', background: 'var(--card)', border: '2px solid var(--amber)', borderRadius: 24, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <Papito size={104} pose="comemorando" />
              <div className="baloo" style={{ fontWeight: 800, fontSize: 22, lineHeight: 1, color: 'var(--amber)', letterSpacing: 1 }}>OFERTA DO DIA</div>
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.3, repeat: Infinity }}
                className="baloo"
                style={{ fontWeight: 800, fontSize: 58, lineHeight: 0.95, color: '#FFF', textShadow: '0 3px 0 var(--blue)' }}
              >
                +500%
              </motion.div>
              <div style={{ fontSize: 17, lineHeight: 1.35, fontWeight: 700 }}>de bônus no seu <span style={{ color: 'var(--amber)' }}>primeiro depósito</span></div>
              <div className="tiny">Regras e condições na casa parceira. +18 · Jogue com responsabilidade.</div>
              <Btn onClick={abrirOferta} primary style={{ width: '100%', height: 54, fontSize: 20 }}>Aproveitar agora 🚀</Btn>
              <button onClick={() => { sfx.tap(); dismissOffer(); }} style={{ height: 44, width: '100%', borderRadius: 14, background: 'none', border: '2px solid var(--line)', color: '#FFF', fontWeight: 700, fontSize: 15 }}>Agora não</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subiu de nível */}
      <AnimatePresence>
        {levelUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { sfx.tap(); setLevelUp(null); }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(5,12,30,.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, zIndex: 40, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
              <Papito size={180} pose="comemorando" />
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
              className="baloo" style={{ fontWeight: 800, fontSize: 18, color: 'var(--muted2)', letterSpacing: 2 }}>SUBIU DE NÍVEL</motion.div>
            <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 14 }}
              className="baloo" style={{ fontWeight: 800, fontSize: 40, color: 'var(--amber)', lineHeight: 1 }}>
              Agora você é {levelUp}!
            </motion.div>
            <div className="soft">Toque pra continuar</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- pequenos componentes de apoio ---- */

function Row({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return <div style={{ background: 'var(--card)', borderRadius: 20, padding: 16 }}>{children}</div>;
}

function Btn({ children, onClick, primary, style }: { children: ReactNode; onClick?: () => void; primary?: boolean; style?: CSSProperties }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46, borderRadius: 14,
        border: primary ? 0 : '2px solid var(--line)', background: primary ? 'var(--amber)' : 'transparent',
        color: primary ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 16, width: '100%', ...style,
      }}>
      {children}
    </motion.button>
  );
}

function Badge({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: 'absolute', top: 6, fontSize: 10, fontWeight: 800, borderRadius: 6, padding: '2px 6px', ...style }}>{children}</div>;
}

function Flame() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--amber)" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-4-1-6 1-9z" /></svg>;
}
