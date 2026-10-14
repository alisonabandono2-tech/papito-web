import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import type { Pose } from '../components/Papito';
import { Screen, Btn, Card, Talk, Pill, Cover, Bar, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { VIP_XP, levelName, money } from '../utils';
import { CRASH, gameUrl } from '../data/games';
import { openExternal } from '../data/links';
import { useStore } from '../store';
import { getProfile } from '../profile';

// Crash VIP: libera no nível Brabo (por XP de uso do app, não por depósito).
// Dentro: simulador de vela com a distribuição real de um crash (RTP 97%) e dinheiro fictício.
// Nada aqui prevê a próxima vela — cada rodada é sorteada do zero.

const RTP = 0.97;
const drawCrash = () => { const u = Math.random(); return Math.max(1, Math.floor((RTP / (1 - u)) * 100) / 100); };
const chance = (m: number) => Math.min(100, (RTP / m) * 100);
const TARGETS = [1.5, 2, 5, 10];

export default function Vip({ onBack, onNav }: { onBack: () => void; onNav: (k: string) => void }) {
  const fem = getProfile()?.fem ?? false;
  const st = useStore();
  const open = st.xp >= VIP_XP;
  const [gi, setGi] = useState(0);
  const was = useRef(open);
  useEffect(() => { if (open && !was.current) { sfx.unlock(); fireConfetti(true); } was.current = open; }, [open]);

  if (!open) {
    const falta = VIP_XP - st.xp;
    return (
      <Screen title="Crash VIP" sub={`Libera no nível ${levelName('Brabo', fem)}`} onBack={onBack}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', paddingTop: 6 }}>
          <motion.div animate={{ rotate: [0, -10, 10, -6, 0], y: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }} style={{ fontSize: 64 }}>🔒</motion.div>
          <div className="baloo" style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1 }}>Faltam <span style={{ color: 'var(--amber)' }}>{falta} XP</span></div>
          <div style={{ width: '100%' }}><Bar pct={(st.xp / VIP_XP) * 100} h={14} /></div>
          <div className="tiny" style={{ fontWeight: 700 }}>{st.xp} / {VIP_XP} XP</div>
        </motion.div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <Papito size={54} pose="apontando" />
          <Talk style={{ flex: 1 }}>O VIP é pra quem é de casa, {fem ? 'amiga' : 'parceiro'}: vem todo dia, faz as missões e sobe de nível. Sem pagar nada.</Talk>
        </div>
        <Card>
          <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>Como juntar XP rápido</div>
          {[['🎁 Presença diária', '+50', 'recompensas'], ['🧠 Quiz do dia', 'até +50', 'quiz'], ['⏱️ Reflexo (3x por dia)', 'até +150', 'reflexo'], ['🗳️ Escolher 3 jogos', '+20', 'votar']].map(([t, x, k]) => (
            <motion.button key={k} whileTap={{ scale: 0.97 }} onClick={() => { sfx.whoosh(); onNav(k); }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'var(--bg)', border: 0, borderRadius: 12, padding: '12px', marginTop: 8, color: '#FFF', fontWeight: 700, fontSize: 14 }}>
              <span>{t}</span><span style={{ color: 'var(--amber)', fontWeight: 800 }}>{x} ›</span>
            </motion.button>
          ))}
        </Card>
        <Card style={{ position: 'relative' }}>
          <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>O que tem lá dentro</div>
          {['Simulador de vela dos 10 crashs (Aviator, JetX, Spaceman…)', 'Chance real de cada vela: 2x, 5x, 10x…', 'Treino de cash out com dinheiro fictício', 'Abre o jogo direto na 1win'].map((t) => (
            <div key={t} style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 14 }}><span style={{ color: 'var(--amber)' }}>✓</span>{t}</div>
          ))}
        </Card>
      </Screen>
    );
  }

  const g = CRASH[gi];
  return (
    <Screen title="Crash VIP" sub="Liberado ✓ · treino com dinheiro fictício" onBack={onBack}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
        {CRASH.map((c, i) => (
          <motion.button key={c.id} whileTap={{ scale: 0.92 }} onClick={() => { sfx.pop(); setGi(i); }}
            style={{ flex: 'none', width: 64, background: 'none', border: 0, padding: 0, color: '#FFF' }}>
            <div style={{ borderRadius: 10, boxShadow: gi === i ? '0 0 0 3px var(--amber)' : 'none' }}><Cover img={c.img} radius={10} /></div>
            <div style={{ fontSize: 10, fontWeight: 800, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
          </motion.button>
        ))}
      </div>
      <CrashSim key={g.id} name={g.name} fem={fem} />
      <Card>
        <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>Chance real de cada vela</div>
        <div className="tiny">Num crash com RTP de 97%, a chance da vela passar de um valor é 97 ÷ valor.</div>
        {[1.5, 2, 3, 5, 10, 50, 100].map((m, i) => (
          <motion.div key={m} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: i * 0.05 }} style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}><span>Passar de {String(m).replace('.', ',')}x</span><b style={{ color: 'var(--amber)' }}>{chance(m).toFixed(m >= 50 ? 2 : 1).replace('.', ',')}%</b></div>
            <Bar pct={chance(m)} h={7} color="#1F5BFF" />
          </motion.div>
        ))}
      </Card>
      <Btn shine kind="green" onClick={() => { sfx.coin(); openExternal(gameUrl(g)); }}>Abrir {g.name} na 1win</Btn>
      <div className="tiny" style={{ textAlign: 'center', lineHeight: 1.4 }}>Simulação. Cada rodada do jogo real é sorteada do zero: o histórico mostra o passado, nunca a próxima vela. +18.</div>
    </Screen>
  );
}

function CrashSim({ name, fem }: { name: string; fem: boolean }) {
  const [target, setTarget] = useState(2);
  const [bank, setBank] = useState(100);
  const [phase, setPhase] = useState<'idle' | 'fly' | 'end'>('idle');
  const [mult, setMult] = useState(1);
  const [crashAt, setCrashAt] = useState(1);
  const [won, setWon] = useState<boolean | null>(null);
  const [hist, setHist] = useState<number[]>([]);
  const [pts, setPts] = useState<[number, number][]>([]);
  const raf = useRef(0);
  const BET = 10;
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = () => {
    if (phase === 'fly' || bank < BET) return;
    const c = drawCrash();
    setCrashAt(c); setWon(null); setPts([]); setPhase('fly'); setBank((b) => b - BET);
    sfx.whoosh(); haptic(10);
    const t0 = performance.now();
    let last = 0, cashed = false;
    const loop = (t: number) => {
      const s = (t - t0) / 1000;
      const m = Math.min(c, Math.exp(0.32 * s));
      setMult(m);
      setPts((p) => [...p, [s, m] as [number, number]].slice(-160));
      if (!cashed && m >= target) {
        cashed = true; setWon(true); setBank((b) => b + BET * target);
        sfx.coin(); haptic(20);
      }
      if (Math.floor(m * 4) !== last) { last = Math.floor(m * 4); sfx.rise(m); }
      if (m >= c) {
        setPhase('end'); setHist((h) => [c, ...h].slice(0, 14));
        if (!cashed) { setWon(false); sfx.crash(); haptic([60, 40, 60]); }
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  const maxS = Math.max(4, ...pts.map((p) => p[0]));
  const maxM = Math.max(2, ...pts.map((p) => p[1]));
  const X = (s: number) => (s / maxS) * 300 + 10;
  const Y = (m: number) => 150 - ((m - 1) / (maxM - 1)) * 130;
  const path = pts.length ? 'M10,150 ' + pts.map(([s, m]) => `L${X(s).toFixed(1)},${Y(m).toFixed(1)}`).join(' ') : '';
  const tip = pts.length ? pts[pts.length - 1] : null;
  const crashed = phase === 'end';
  let talk = `Escolhe o cash out e solta a vela. Aposta fictícia de ${money(BET)}.`;
  let pose: Pose = 'apontando';
  if (phase === 'fly') { talk = won ? `Saiu no ${String(target).replace('.', ',')}x! Agora só assiste.` : 'Segura… segura…'; pose = won ? 'comemorando' : 'surpreso'; }
  if (crashed) { talk = won ? `GREEN no ${String(target).replace('.', ',')}x! A vela foi até ${crashAt.toFixed(2).replace('.', ',')}x — sorte da rodada.` : `Quebrou em ${crashAt.toFixed(2).replace('.', ',')}x antes do seu ${String(target).replace('.', ',')}x. Faz parte, ${fem ? 'amiga' : 'parceiro'}.`; pose = won ? 'joinha' : 'triste'; }
  if (bank < BET && phase !== 'fly') { talk = 'A banca fictícia acabou. Na vida real, é aqui que o limite tinha que ter parado antes.'; pose = 'triste'; }

  return (
    <>
      <Card style={{ padding: 10, background: 'radial-gradient(120% 100% at 0% 100%, #2a1650 0%, #0A1A3F 70%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800 }}>
          <span>{name} · simulação</span><span style={{ color: 'var(--amber)' }}>Banca {money(bank)}</span>
        </div>
        <div style={{ position: 'relative', height: 170 }}>
          <svg viewBox="0 0 320 160" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
            {path && <path d={path + ` L${tip ? X(tip[0]) : 10},150 Z`} fill={crashed && !won ? 'rgba(229,72,77,.2)' : 'rgba(255,201,40,.18)'} />}
            {path && <path d={path} fill="none" stroke={crashed && !won ? '#E5484D' : '#FFC928'} strokeWidth="3" strokeLinecap="round" />}
          </svg>
          {tip && (
            <motion.div animate={crashed ? { scale: [1, 1.6, 0], rotate: 90 } : { y: [0, -3, 0] }} transition={crashed ? { duration: 0.5 } : { duration: 0.4, repeat: Infinity }}
              style={{ position: 'absolute', left: `${(X(tip[0]) / 320) * 100}%`, top: `${(Y(tip[1]) / 160) * 100}%`, transform: 'translate(-50%,-50%)', fontSize: 28 }}>{crashed && !won ? '💥' : '🚀'}</motion.div>
          )}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div animate={crashed && !won ? { scale: [1, 1.15, 1] } : {}} className="baloo"
              style={{ fontWeight: 800, fontSize: 48, color: crashed && !won ? '#FF5A5F' : won ? '#5FD38D' : '#FFF', textShadow: '0 3px 10px rgba(0,0,0,.5)', fontVariantNumeric: 'tabular-nums' }}>
              {phase === 'idle' ? '1,00x' : mult.toFixed(2).replace('.', ',') + 'x'}
            </motion.div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', minHeight: 22 }}>
          <AnimatePresence initial={false}>
            {hist.map((h, i) => (
              <motion.span key={hist.length - i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                style={{ fontSize: 11, fontWeight: 800, borderRadius: 8, padding: '3px 7px', background: h < 2 ? '#2A4790' : h < 10 ? '#6B3FD9' : '#C9338F' }}>{h.toFixed(2).replace('.', ',')}x</motion.span>
            ))}
          </AnimatePresence>
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={48} pose={pose} />
        <Talk style={{ flex: 1 }}>{talk}</Talk>
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Cash out automático em</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          {TARGETS.map((t) => <Pill key={t} active={target === t} onClick={() => phase !== 'fly' && setTarget(t)} style={{ flex: 1 }}>{String(t).replace('.', ',')}x</Pill>)}
        </div>
        <div className="tiny" style={{ marginTop: 6 }}>Chance real de chegar no {String(target).replace('.', ',')}x: {chance(target).toFixed(1).replace('.', ',')}%</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: bank < BET ? '1fr' : '2fr 1fr', gap: 8 }}>
        {bank >= BET && <Btn shine={phase !== 'fly'} disabled={phase === 'fly'} onClick={play} style={{ height: 56, fontSize: 18 }}>{phase === 'fly' ? 'Voando…' : '🚀 Soltar vela'}</Btn>}
        <Btn kind="ghost" disabled={phase === 'fly'} onClick={() => { setBank(100); setHist([]); setPhase('idle'); setPts([]); sfx.tap(); }} style={{ height: 56 }}>↺ Banca</Btn>
      </div>
    </>
  );
}
