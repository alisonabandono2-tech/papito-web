import { motion } from 'framer-motion';
import { sfx, haptic } from '../sfx';

type Item = { key: string; label: string; icon: JSX.Element };

const I = (d: JSX.Element) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const left: Item[] = [
  { key: 'inicio', label: 'Início', icon: I(<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>) },
  { key: 'recompensas', label: 'Prêmios', icon: I(<><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8v12" /><path d="M12 8C10 4 6 4 7.5 7 8.5 8 12 8 12 8zM12 8c2-4 6-4 4.5-1C15.5 8 12 8 12 8z" /></>) },
];
const right: Item[] = [
  { key: 'lab', label: 'Laboratório', icon: I(<><path d="M9 3h6" /><path d="M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" /><path d="M7 15h10" /></>) },
  { key: 'ferramentas', label: 'Ferramentas', icon: I(<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /><path d="M9 2h6" /></>) },
];

export const TAB_KEYS = ['inicio', 'recompensas', 'lab', 'ferramentas'];

export default function BottomNav({ active, onNav }: { active: string; onNav: (k: string) => void }) {
  const go = (k: string) => {
    sfx.tap();
    haptic(10);
    onNav(k);
  };
  return (
    <nav aria-label="Navegação principal"
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 'var(--nav-h)', background: 'rgba(15,34,80,.96)', backdropFilter: 'blur(10px)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', alignItems: 'end', padding: '0 6px 12px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))', zIndex: 10 }}>
      {left.map((it) => <NavBtn key={it.key} it={it} active={active === it.key} onClick={() => go(it.key)} />)}
      <button onClick={() => go('carteira-dep')} aria-label="Depositar"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 0, color: 'var(--amber)', fontSize: 12, fontWeight: 800 }}>
        <motion.span whileTap={{ scale: 0.88 }} animate={{ boxShadow: ['0 0 0 0 rgba(255,201,40,.55)', '0 0 0 12px rgba(255,201,40,0)'] }} transition={{ duration: 1.8, repeat: Infinity }}
          style={{ width: 62, height: 62, borderRadius: 31, background: 'var(--amber)', border: '4px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -26 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1300" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        </motion.span>
        Depositar
      </button>
      {right.map((it) => <NavBtn key={it.key} it={it} active={active === it.key} onClick={() => go(it.key)} />)}
    </nav>
  );
}

function NavBtn({ it, active, onClick }: { it: Item; active: boolean; onClick: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={onClick}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 0, color: active ? 'var(--amber)' : 'var(--muted)', fontSize: 11, fontWeight: 700, paddingTop: 8 }}>
      {active && <motion.span layoutId="navdot" transition={{ type: 'spring', stiffness: 500, damping: 32 }} style={{ position: 'absolute', top: 0, width: 26, height: 4, borderRadius: 2, background: 'var(--amber)' }} />}
      <motion.span animate={{ y: active ? -2 : 0, scale: active ? 1.12 : 1 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}>{it.icon}</motion.span>
      {it.label}
    </motion.button>
  );
}
