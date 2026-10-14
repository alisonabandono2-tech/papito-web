import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SLOTS_PG, SLOTS_PR, type Game } from '../data/games';
import { Cover } from './ui';

// "Mais escolhidos hoje" AO VIVO: fica trocando entre os slots do catálogo (PG + Pragmatic),
// com % alta mexendo sozinha e os jogos entrando/saindo e trocando de posição animados.
// Termômetro de "quente na comunidade" (simulado; no app real vem dos votos do backend).
const CATALOG = [...SLOTS_PG, ...SLOTS_PR];
const ROWS = 3;

type Hot = { g: Game; pct: number };
const rpct = () => 62 + Math.floor(Math.random() * 35);

function pick(exclude: string[]): Hot {
  const pool = CATALOG.filter((g) => !exclude.includes(g.id));
  // favorece os mais jogados
  const w = pool.map((g) => Math.sqrt(g.online + 20));
  let r = Math.random() * w.reduce((a, b) => a + b, 0);
  let i = 0;
  while (r > w[i] && i < pool.length - 1) r -= w[i++];
  return { g: pool[i], pct: rpct() };
}
function seed(): Hot[] {
  const out: Hot[] = [];
  while (out.length < ROWS) out.push(pick(out.map((h) => h.g.id)));
  return out.sort((a, b) => b.pct - a.pct);
}

export default function LiveRanking({ onVote, onOpen }: { onVote: () => void; onOpen: (g: Game) => void }) {
  const [hot, setHot] = useState<Hot[]>(seed);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current++;
      setHot((prev) => {
        let next = prev.map((h) => ({ ...h, pct: Math.max(58, Math.min(97, h.pct + Math.round((Math.random() - 0.45) * 9))) }));
        if (tick.current % 2 === 0) {
          const lowIdx = next.reduce((lo, h, i, a) => (h.pct < a[lo].pct ? i : lo), 0);
          const fresh = pick(next.map((h) => h.g.id));
          next = next.map((h, i) => (i === lowIdx ? fresh : h));
        }
        return [...next].sort((a, b) => b.pct - a.pct);
      });
    }, 1700);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background: 'var(--card)', borderRadius: 22, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div className="baloo" style={{ fontWeight: 800, fontSize: 20 }}>🏆 Mais escolhidos hoje</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 'none' }}>
          <span className="pulse" style={{ width: 8, height: 8, borderRadius: 4, background: '#5FD38D', display: 'inline-block' }} />
          <span className="tiny" style={{ fontWeight: 700 }}>ao vivo</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, minHeight: 215 }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {hot.map((h, i) => (
            <motion.button
              key={h.g.id}
              layout
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 440, damping: 34 }}
              onClick={() => onOpen(h.g)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 0, padding: 0, color: '#FFF', textAlign: 'left' }}
            >
              <Cover img={h.g.img} radius={8} style={{ width: 44, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, gap: 8 }}>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <span style={{ color: i === 0 ? 'var(--amber)' : '#FFF', fontWeight: 800 }}>{i + 1}º</span> {h.g.name}
                  </span>
                  <motion.span key={h.pct} initial={{ scale: 1.35, y: -4 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                    style={{ color: 'var(--amber)', flex: 'none', fontWeight: 800 }}>
                    🔥 {h.pct}%
                  </motion.span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--bg)', marginTop: 5, overflow: 'hidden' }}>
                  <motion.div animate={{ width: `${h.pct}%` }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{ height: 8, borderRadius: 4, background: i === 0 ? 'var(--amber)' : 'var(--blue)' }} />
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <motion.button whileTap={{ scale: 0.96 }} onClick={onVote} className="shine"
        style={{ position: 'relative', overflow: 'hidden', marginTop: 12, height: 48, width: '100%', borderRadius: 14, border: 0, background: 'var(--amber)', color: '#1A1300', fontWeight: 800, fontSize: 16, boxShadow: '0 5px 0 #C99A00' }}>
        Escolher meus 3 jogos · +20 XP
      </motion.button>
    </div>
  );
}
