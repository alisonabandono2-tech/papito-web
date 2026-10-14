import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLOTS_PG, SLOTS_PR, coverPos } from '../data/games';
import { sfx, haptic } from '../sfx';

// Catálogo rotativo: todos os slots (no app real, 50 PG + 50 Pragmatic puxados da casa).
const CATALOG = [...SLOTS_PG, ...SLOTS_PR];
const ROWS = 3;

type Hot = { name: string; idx: number; pct: number };

const rpct = () => 62 + Math.floor(Math.random() * 35); // 62..96 (sempre alto)

function pick(exclude: string[]): Hot {
  const pool = CATALOG.filter((g) => !exclude.includes(g.name));
  const g = pool[Math.floor(Math.random() * pool.length)] || CATALOG[0];
  return { name: g.name, idx: g.idx, pct: rpct() };
}

function seed(): Hot[] {
  const out: Hot[] = [];
  while (out.length < ROWS) out.push(pick(out.map((h) => h.name)));
  return out.sort((a, b) => b.pct - a.pct);
}

// "Mais escolhidos hoje" AO VIVO: fica trocando entre o catálogo todo (PG + Pragmatic),
// com % alta mexendo sozinha e os jogos entrando/saindo e trocando de posição animados.
// É o termômetro de "quente na comunidade" (aqui simulado; no app real vem do backend).
export default function LiveRanking({ onVote }: { onVote: () => void }) {
  const [hot, setHot] = useState<Hot[]>(seed);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current++;
      setHot((prev) => {
        let next = prev.map((h) => {
          const d = Math.round((Math.random() - 0.45) * 9);
          return { ...h, pct: Math.max(58, Math.min(97, h.pct + d)) };
        });
        // a cada 2 batidas, troca o de menor % por um jogo novo do catálogo
        if (tick.current % 2 === 0) {
          const lowIdx = next.reduce((lo, h, i, a) => (h.pct < a[lo].pct ? i : lo), 0);
          const fresh = pick(next.map((h) => h.name));
          next = next.map((h, i) => (i === lowIdx ? fresh : h));
        }
        return [...next].sort((a, b) => b.pct - a.pct);
      });
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: 'var(--card)', borderRadius: 20, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div className="baloo" style={{ fontWeight: 800, fontSize: 20 }}>🏆 Mais escolhidos hoje</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 'none' }}>
          <motion.span
            animate={{ opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            style={{ width: 8, height: 8, borderRadius: 4, background: '#5FD38D', display: 'inline-block' }}
          />
          <span className="tiny" style={{ fontWeight: 700 }}>ao vivo</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, minHeight: 215 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {hot.map((h, i) => (
            <motion.div
              key={h.name}
              layout
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ type: 'spring', stiffness: 440, damping: 34 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div className="cover" style={{ width: 40, height: 55, borderRadius: 8, flex: 'none', backgroundPosition: coverPos(h.idx) }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: i === 0 ? 'var(--amber)' : '#FFF', fontWeight: 800 }}>{i + 1}º</span> {h.name}
                  </span>
                  <motion.span
                    key={h.pct}
                    initial={{ scale: 1.35, y: -4 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    style={{ color: 'var(--amber)', flex: 'none', fontWeight: 800 }}
                  >
                    🔥 {h.pct}%
                  </motion.span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--bg)', marginTop: 4, overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${h.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ height: 8, borderRadius: 4, background: i === 0 ? 'var(--amber)' : 'var(--blue)' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => { sfx.tap(); haptic(10); onVote(); }}
        style={{
          marginTop: 12, height: 46, width: '100%', borderRadius: 14, border: 0,
          background: 'var(--amber)', color: '#1A1300', fontWeight: 800, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}
      >
        Escolher meus 3 jogos · +20 XP
      </motion.button>
    </div>
  );
}
