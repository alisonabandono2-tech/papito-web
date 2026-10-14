import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import type { Pose } from '../components/Papito';
import { Screen, Btn, Talk, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { store, useStore } from '../store';

// Mini game: começa o relógio e tenta parar exatamente em 5,00 s.
// O número some depois de 2 s — tem que contar de cabeça. Prêmio só em XP, 3 tentativas por dia.
const TARGET = 5;
const prizeFor = (d: number) => (d <= 0.05 ? 50 : d <= 0.2 ? 30 : d <= 0.5 ? 15 : 5);

export default function Reflexo({ onBack }: { onBack: () => void }) {
  useStore();
  const tries = store.today().reflex || [];
  const left = 3 - tries.length;
  const [phase, setPhase] = useState<'idle' | 'run' | 'done'>('idle');
  const [now, setNow] = useState(0);
  const [result, setResult] = useState(0);
  const t0 = useRef(0);
  const raf = useRef(0);
  const lastTick = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = () => {
    if (left <= 0) return;
    sfx.whoosh(); haptic(10);
    t0.current = performance.now();
    lastTick.current = 0;
    setPhase('run');
    const loop = (t: number) => {
      const e = (t - t0.current) / 1000;
      setNow(e);
      if (e < 2 && Math.floor(e * 4) !== lastTick.current) { lastTick.current = Math.floor(e * 4); sfx.tick(); }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf.current);
    const e = (performance.now() - t0.current) / 1000;
    const d = Math.abs(e - TARGET);
    setResult(e);
    setPhase('done');
    store.addReflex(d);
    const p = prizeFor(d);
    store.addXp(p, 'Mini game Reflexo');
    if (d <= 0.2) { sfx.levelUp(); fireConfetti(d <= 0.05); } else sfx.coin();
    haptic(25);
  };

  const fmt = (s: number) => s.toFixed(2).replace('.', ',');
  const d = Math.abs(result - TARGET);
  const shown = phase === 'run' ? (now < 2 ? fmt(now) : '?,??') : phase === 'done' ? fmt(result) : '0,00';
  let talk = 'Aperta COMEÇAR e para o relógio no 5,00. Depois de 2 segundos o número some!';
  let pose: Pose = 'apontando';
  if (phase === 'run') { talk = 'Conta de cabeça… 1… 2… 3…'; pose = 'pensativo'; }
  if (phase === 'done') {
    talk = d <= 0.05 ? 'PERFEITO! Relógio suíço!' : d <= 0.2 ? 'Muito perto! Que reflexo!' : d <= 0.5 ? 'Bom! Dá pra chegar mais perto.' : 'Passou longe, mas valeu o XP!';
    pose = d <= 0.2 ? 'comemorando' : d <= 0.5 ? 'joinha' : 'rindo';
  }
  const ringPct = phase === 'run' ? Math.min(1, now / TARGET) : phase === 'done' ? Math.min(1, result / TARGET) : 0;

  return (
    <Screen title="Reflexo do Papito" sub={`${Math.max(0, left)} tentativas hoje · prêmio em XP`} onBack={onBack}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={56} pose={pose} />
        <Talk style={{ flex: 1 }}>{talk}</Talk>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
        <div style={{ position: 'relative', width: 240, height: 240 }}>
          <svg width="240" height="240" viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="120" cy="120" r="104" stroke="#12285E" strokeWidth="16" fill="none" />
            <circle cx="120" cy="120" r="104" stroke={phase === 'done' && d <= 0.2 ? '#5FD38D' : '#FFC928'} strokeWidth="16" fill="none" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 104} strokeDashoffset={2 * Math.PI * 104 * (1 - ringPct)} style={{ transition: phase === 'run' ? 'none' : 'stroke-dashoffset .5s' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="tiny" style={{ fontWeight: 800 }}>ALVO 5,00 s</div>
            <motion.div key={phase} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={spring} className="baloo"
              style={{ fontWeight: 800, fontSize: 58, lineHeight: 1, color: phase === 'done' ? (d <= 0.2 ? '#5FD38D' : 'var(--amber)') : '#FFF', fontVariantNumeric: 'tabular-nums' }}>{shown}</motion.div>
          </div>
        </div>
      </div>

      <div style={{ minHeight: 48, marginTop: -6 }}>
        <AnimatePresence>
          {phase === 'done' && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring} style={{ textAlign: 'center' }}>
              <div className="soft" style={{ fontSize: 14 }}>Diferença de {fmt(d)} s</div>
              <div className="baloo" style={{ fontWeight: 800, color: 'var(--amber)', fontSize: 24, lineHeight: 1 }}>+{prizeFor(d)} XP</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase === 'run' ? (
        <motion.button whileTap={{ scale: 0.9 }} onClick={stop}
          style={{ height: 90, borderRadius: 45, border: 0, background: '#E5484D', color: '#FFF', fontWeight: 900, fontSize: 32, boxShadow: '0 8px 0 #9c2a2f' }} className="baloo">PARA!</motion.button>
      ) : (
        <Btn shine={left > 0} disabled={left <= 0} onClick={start} style={{ height: 64, fontSize: 22 }}>
          {left <= 0 ? 'Volta amanhã pra jogar de novo' : phase === 'done' ? 'Tentar de novo' : 'COMEÇAR'}
        </Btn>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, textAlign: 'center' }}>
        {[['≤ 0,05 s', '+50'], ['≤ 0,20 s', '+30'], ['≤ 0,50 s', '+15'], ['resto', '+5']].map(([a, b]) => (
          <div key={a} style={{ background: 'var(--card)', borderRadius: 12, padding: '8px 4px' }}>
            <div className="tiny" style={{ fontWeight: 700 }}>{a}</div>
            <div style={{ fontWeight: 800, color: 'var(--amber)' }}>{b} XP</div>
          </div>
        ))}
      </div>
      <div className="tiny" style={{ textAlign: 'center' }}>Prêmio só em XP do Papito. 3 tentativas por dia.</div>
    </Screen>
  );
}
