import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './screens/Home';
import Recompensas from './screens/Recompensas';
import Votar from './screens/Votar';
import Quiz from './screens/Quiz';
import Reflexo from './screens/Reflexo';
import Ferramentas from './screens/Ferramentas';
import Laboratorio, { Strat, Compare } from './screens/Laboratorio';
import type { GameKey } from './lab/engine';
import Vip from './screens/Vip';
import Carteira from './screens/Carteira';
import Onboard from './components/Onboard';
import InstallGate from './components/InstallGate';
import { needsInstallGate } from './install';
import BottomNav, { TAB_KEYS } from './components/BottomNav';
import Papito from './components/Papito';
import { fireConfetti } from './components/ui';
import { useProfile } from './profile';
import { onGain } from './store';
import { onToast } from './toast';
import { levelInfo } from './utils';
import { sfx, haptic } from './sfx';

export default function App() {
  const [profile, setProfile] = useProfile();
  const [gate, setGate] = useState(needsInstallGate);
  const [stack, setStack] = useState<string[]>(['inicio']);
  const [dir, setDir] = useState(1);
  const [gains, setGains] = useState<{ id: number; amount: number; reason: string }[]>([]);
  const [lvlUp, setLvlUp] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);
  const gid = useRef(0);
  const screen = stack[stack.length - 1];

  // XP ganho: toast flutuante + checa subida de nível
  useEffect(() => onGain((g) => {
    const id = ++gid.current;
    setGains((x) => [...x, { id, amount: g.amount, reason: g.reason }]);
    setTimeout(() => setGains((x) => x.filter((y) => y.id !== id)), 1900);
    const fem = profile?.fem ?? false;
    const a = levelInfo(g.before, fem), b = levelInfo(g.after, fem);
    if (b.index > a.index) {
      setTimeout(() => { sfx.levelUp(); haptic([40, 60, 40]); fireConfetti(true); setLvlUp(b.name); }, 650);
    }
  }), [profile]);

  useEffect(() => onToast((t) => {
    setToasts((x) => [...x.slice(-1), t]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== t.id)), 2200);
  }), []);

  // botão "voltar" do celular volta uma tela dentro do app
  useEffect(() => {
    const onPop = () => {
      setDir(-1);
      setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const nav = (k: string) => {
    if (k === screen) return;
    if (TAB_KEYS.includes(k)) {
      setDir(TAB_KEYS.indexOf(k) >= TAB_KEYS.indexOf(screen) ? 1 : -1);
      setStack(k === 'inicio' ? ['inicio'] : ['inicio', k]);
    } else {
      setDir(1);
      setStack((s) => [...s, k]);
    }
    try { history.pushState({ k }, ''); } catch { /* */ }
  };
  const back = () => {
    if (stack.length > 1) { try { history.back(); } catch { setDir(-1); setStack((s) => s.slice(0, -1)); } }
  };
  const swapTop = (k: string) => setStack((s) => [...s.slice(0, -1), k]);

  // 1º: instalar o app (no celular, fora do app instalado)
  if (gate) return <InstallGate onSkip={() => setGate(false)} />;

  if (!profile) {
    return (
      <motion.div key="onboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Onboard onDone={setProfile} />
      </motion.div>
    );
  }

  const isTab = TAB_KEYS.includes(screen);
  const tabActive = isTab ? screen : [...stack].reverse().find((k) => TAB_KEYS.includes(k)) || 'inicio';

  let view: JSX.Element;
  switch (screen) {
    case 'recompensas': view = <Recompensas onNav={nav} />; break;
    case 'votar': view = <Votar onBack={back} />; break;
    case 'quiz': view = <Quiz onBack={back} />; break;
    case 'reflexo': view = <Reflexo onBack={back} />; break;
    case 'ferramentas': view = <Ferramentas />; break;
    case 'lab': view = <Laboratorio onNav={nav} />; break;
    case 'vip': view = <Vip onBack={back} onNav={nav} />; break;
    case 'carteira-dep': view = <Carteira mode="dep" onBack={back} onSwitch={(m) => swapTop(m === 'dep' ? 'carteira-dep' : 'carteira-saque')} />; break;
    case 'carteira-saque': view = <Carteira mode="saque" onBack={back} onSwitch={(m) => swapTop(m === 'dep' ? 'carteira-dep' : 'carteira-saque')} />; break;
    default:
      if (screen.startsWith('lab-s:')) { const [, g, i] = screen.split(':'); view = <Strat game={g as GameKey} sid={Number(i)} onBack={back} />; }
      else if (screen.startsWith('lab-c:')) { view = <Compare game={screen.split(':')[1] as GameKey} onBack={back} />; }
      else view = <Home onNav={nav} />;
  }

  return (
    <div className="phone" style={{ background: 'var(--bg)' }}>
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.div key={screen.startsWith('carteira') ? 'carteira' : screen} custom={dir}
          variants={{ in: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.98 }), show: { x: 0, opacity: 1, scale: 1 }, out: (d: number) => ({ x: d * -40, opacity: 0, scale: 0.98 }) }}
          initial="in" animate="show" exit="out" transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          style={{ position: 'absolute', inset: 0 }}>
          {view}
        </motion.div>
      </AnimatePresence>

      <BottomNav active={tabActive} onNav={nav} />

      {/* +XP flutuante */}
      <div style={{ position: 'absolute', top: 12, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none', zIndex: 50 }}>
        <AnimatePresence>
          {gains.map((g) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 20, scale: 0.6 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -30, scale: 0.9 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              style={{ background: 'var(--amber)', color: '#1A1300', borderRadius: 20, padding: '8px 14px', fontWeight: 900, fontSize: 15, boxShadow: '0 8px 24px rgba(255,201,40,.45)' }}>
              +{g.amount} XP <span style={{ fontWeight: 700, fontSize: 12 }}>· {g.reason}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* toast */}
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 'calc(var(--nav-h) + 14px)', zIndex: 45, pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              style={{ background: '#0F2250', border: '1px solid var(--line)', borderRadius: 14, padding: '12px 14px', fontWeight: 700, fontSize: 14, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.4)' }}>
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* subiu de nível */}
      <AnimatePresence>
        {lvlUp && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { sfx.tap(); setLvlUp(null); }}
            style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%, #1F4BD0 0%, #0A1A3F 55%, #050C1E 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, zIndex: 60, textAlign: 'center' }}>
            <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
              <Papito size={180} pose="comemorando" />
            </motion.div>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="baloo" style={{ fontWeight: 800, fontSize: 18, color: 'var(--muted2)', letterSpacing: 3 }}>SUBIU DE NÍVEL</motion.div>
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 12 }} className="baloo"
              style={{ fontWeight: 800, fontSize: 42, color: 'var(--amber)', lineHeight: 1, textShadow: '0 4px 0 #8a6a00' }}>Agora você é {lvlUp}!</motion.div>
            {(lvlUp === 'Brabo' || lvlUp === 'Braba') && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ fontWeight: 800, fontSize: 17 }}>🚀 Crash VIP liberado!</motion.div>}
            <div className="soft">Toque pra continuar</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
