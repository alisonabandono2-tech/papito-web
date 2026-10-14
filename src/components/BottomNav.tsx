import { motion } from 'framer-motion';
import { sfx, haptic } from '../sfx';

type Item = { key: string; label: string; icon: JSX.Element };

const items: Item[] = [
  {
    key: 'inicio',
    label: 'Início',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>
    ),
  },
  {
    key: 'recompensas',
    label: 'Recompensas',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8" /><path d="M12 8v12" /><path d="M12 8C10 4 6 4 7.5 7 8.5 8 12 8 12 8zM12 8c2-4 6-4 4.5-1C15.5 8 12 8 12 8z" /></svg>
    ),
  },
  {
    key: 'ferramentas',
    label: 'Ferramentas',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /><path d="M9 2h6" /></svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.8-1.2-2.3-2.3l.8-1-1-2z" /></svg>
    ),
  },
];

export default function BottomNav({ active, onNav }: { active: string; onNav: (k: string) => void }) {
  const go = (k: string) => {
    sfx.tap();
    haptic(10);
    onNav(k);
  };
  return (
    <nav
      aria-label="Navegação principal"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 'var(--nav-h)',
        background: '#0F2250',
        borderTop: '1px solid var(--line)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        alignItems: 'end',
        padding: '0 6px 12px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
      }}
    >
      {items.slice(0, 2).map((it) => (
        <NavBtn key={it.key} it={it} active={active === it.key} onClick={() => go(it.key)} />
      ))}
      <button
        onClick={() => go('depositar')}
        aria-label="Depositar"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 0, color: 'var(--amber)', fontSize: 12, fontWeight: 800 }}
      >
        <motion.span
          whileTap={{ scale: 0.9 }}
          style={{ width: 62, height: 62, borderRadius: 31, background: 'var(--amber)', border: '4px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -26 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A1300" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
        </motion.span>
        Depositar
      </button>
      {items.slice(2).map((it) => (
        <NavBtn key={it.key} it={it} active={active === it.key} onClick={() => go(it.key)} />
      ))}
    </nav>
  );
}

function NavBtn({ it, active, onClick }: { it: Item; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 0, color: active ? 'var(--amber)' : 'var(--muted)', fontSize: 11, fontWeight: 700, paddingTop: 8 }}
    >
      {it.icon}
      {it.label}
    </motion.button>
  );
}
