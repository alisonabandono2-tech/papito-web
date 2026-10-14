import { useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sfx, haptic } from '../sfx';
import { coverUrl } from '../data/links';

export const spring = { type: 'spring' as const, stiffness: 420, damping: 30 };

export function fireConfetti(big = false) {
  const colors = ['#FFC928', '#1F5BFF', '#FFFFFF', '#5FD38D', '#FF8A8E'];
  if (big) {
    confetti({ particleCount: 150, spread: 100, startVelocity: 46, origin: { y: 0.4 }, colors, scalar: 1.1 });
    setTimeout(() => confetti({ particleCount: 90, spread: 130, origin: { y: 0.3 }, colors }), 220);
  } else {
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.5 }, colors });
  }
}

// Tela com cabeçalho (voltar + título) e conteúdo rolável, entrando com mola.
export function Screen({ title, sub, onBack, children, right, pad = true }: { title: string; sub?: string; onBack?: () => void; children: ReactNode; right?: ReactNode; pad?: boolean }) {
  return (
    <div className="screen">
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5, padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(var(--bg) 70%, rgba(10,26,63,0))' }}>
        {onBack && (
          <motion.button whileTap={{ scale: 0.88 }} onClick={() => { sfx.whoosh(); haptic(8); onBack(); }} aria-label="Voltar"
            style={{ width: 42, height: 42, borderRadius: 21, background: 'var(--card)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </motion.button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="baloo" style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          {sub && <div className="tiny" style={{ fontWeight: 700 }}>{sub}</div>}
        </div>
        {right}
      </div>
      <div className="scroll" style={{ paddingTop: 70, paddingBottom: 'calc(var(--nav-h) + 20px)' }}>
        <div style={{ padding: pad ? '0 14px' : 0, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
      </div>
    </div>
  );
}

// Entra em cascata (usar dentro de um Stagger)
export function Rise({ children, i = 0, style }: { children: ReactNode; i?: number; style?: CSSProperties }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring, delay: Math.min(i * 0.05, 0.4) }} style={style}>
      {children}
    </motion.div>
  );
}

export function Card({ children, style, glow }: { children: ReactNode; style?: CSSProperties; glow?: boolean }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 22, padding: 16, position: 'relative', overflow: 'hidden', boxShadow: glow ? '0 0 0 2px var(--amber), 0 10px 30px rgba(255,201,40,.18)' : '0 8px 24px rgba(0,0,0,.18)', ...style }}>
      {children}
    </div>
  );
}

export function Btn({ children, onClick, kind = 'primary', style, disabled, shine }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'ghost' | 'light' | 'green'; style?: CSSProperties; disabled?: boolean; shine?: boolean }) {
  const bg = { primary: 'var(--amber)', ghost: 'transparent', light: '#FFFFFF', green: '#1FA45A' }[kind];
  const fg = { primary: '#1A1300', ghost: '#FFFFFF', light: 'var(--bg)', green: '#FFFFFF' }[kind];
  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.95, y: 1 }}
      whileHover={disabled ? {} : { y: -1 }}
      transition={spring}
      onClick={() => { if (disabled) return; sfx.tap(); haptic(10); onClick?.(); }}
      disabled={disabled}
      className={shine && !disabled ? 'shine' : undefined}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 16, width: '100%',
        border: kind === 'ghost' ? '2px solid var(--line)' : 0, background: bg, color: fg, fontWeight: 800, fontSize: 16,
        opacity: disabled ? 0.45 : 1, boxShadow: kind === 'primary' && !disabled ? '0 6px 0 #C99A00' : undefined,
        ...Object.fromEntries(Object.entries(style || {}).filter(([, v]) => v !== undefined)),
      }}
    >
      {children}
    </motion.button>
  );
}

export function Pill({ active, children, onClick, style }: { active: boolean; children: ReactNode; onClick: () => void; style?: CSSProperties }) {
  return (
    <motion.button whileTap={{ scale: 0.93 }} onClick={() => { sfx.pop(); haptic(6); onClick(); }}
      style={{ height: 40, padding: '0 14px', borderRadius: 20, border: active ? 0 : '1.5px solid var(--line)', background: active ? 'var(--amber)' : 'var(--card)', color: active ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', ...style }}>
      {children}
    </motion.button>
  );
}

// Capa de jogo vinda do CDN da casa, com brilho enquanto carrega.
export function Cover({ img, style, radius = 12 }: { img: string; style?: CSSProperties; radius?: number }) {
  const [ok, setOk] = useState(false);
  const [bad, setBad] = useState(false);
  return (
    <div className={ok ? undefined : 'skeleton'} style={{ position: 'relative', borderRadius: radius, overflow: 'hidden', background: 'var(--card2)', aspectRatio: '440 / 600', ...style }}>
      <motion.img
        src={coverUrl(img)}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setOk(true)}
        onError={() => setBad(true)}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={ok ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.35 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: bad ? 'none' : 'block' }}
      />
    </div>
  );
}

export function Badge({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ position: 'absolute', top: 6, fontSize: 10, fontWeight: 800, borderRadius: 6, padding: '2px 6px', ...style }}>{children}</div>;
}

// Balão de fala do Papito
export function Talk({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <motion.div key={String(children)} initial={{ opacity: 0, x: -8, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={spring}
      style={{ background: '#FFFFFF', color: 'var(--bg)', borderRadius: '16px 16px 16px 4px', padding: '10px 12px', fontWeight: 700, fontSize: 14, lineHeight: 1.35, ...style }}>
      {children}
    </motion.div>
  );
}

export function Bar({ pct, color = 'var(--amber)', h = 10 }: { pct: number; color?: string; h?: number }) {
  return (
    <div style={{ height: h, borderRadius: h / 2, background: 'var(--bg)', overflow: 'hidden' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }} transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ height: h, borderRadius: h / 2, background: color }} />
    </div>
  );
}
