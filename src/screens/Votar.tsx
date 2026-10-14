import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import { Screen, Btn, Pill, Cover, Talk, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { SLOTS_PG, SLOTS_PR, CRASH, LIVE, ALL_GAMES, gameUrl, norm, type Game } from '../data/games';
import { openExternal } from '../data/links';
import { store, useStore } from '../store';
import { getProfile } from '../profile';
import { toast } from '../toast';

const FILTERS = [['pg', 'PG Soft', SLOTS_PG], ['pr', 'Pragmatic', SLOTS_PR], ['crash', 'Crash', CRASH], ['vivo', 'Ao vivo', LIVE]] as const;

export default function Votar({ onBack }: { onBack: () => void }) {
  const fem = getProfile()?.fem ?? false;
  useStore();
  const voted = store.today().votes;
  const [sel, setSel] = useState<string[]>([]);
  const [f, setF] = useState<(typeof FILTERS)[number][0]>('pg');
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const nq = norm(q.trim());
    if (nq) return ALL_GAMES.filter((g) => norm(g.name).includes(nq));
    return [...(FILTERS.find((x) => x[0] === f)![2] as readonly Game[])];
  }, [f, q]);

  const toggle = (g: Game) => {
    if (sel.includes(g.id)) { sfx.tap(); setSel(sel.filter((x) => x !== g.id)); return; }
    if (sel.length >= 3) { sfx.wrong(); haptic(30); toast('Já escolheu 3! Tira um pra trocar.'); return; }
    sfx.pop(); haptic(10);
    setSel([...sel, g.id]);
  };
  const confirm = () => {
    if (store.vote(sel)) { sfx.levelUp(); fireConfetti(); }
  };

  if (voted) {
    const picks = voted.map((id) => ALL_GAMES.find((g) => g.id === id)).filter(Boolean) as Game[];
    return (
      <Screen title="Seus 3 jogos de hoje" sub="Missão do dia concluída ✓" onBack={onBack}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <Papito size={60} pose="comemorando" />
          <Talk style={{ flex: 1 }}>Valeu, {fem ? 'amiga' : 'parceiro'}! Seus votos já entraram no ranking. Volta amanhã pra escolher de novo.</Talk>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {picks.map((g, i) => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 30, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ ...spring, delay: i * 0.12 }}>
              <div style={{ position: 'relative' }}>
                <Cover img={g.img} />
                <div style={{ position: 'absolute', top: -8, left: -8, width: 28, height: 28, borderRadius: 14, background: 'var(--amber)', color: '#1A1300', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 12, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
              <Btn onClick={() => openExternal(gameUrl(g))} style={{ height: 34, fontSize: 13, borderRadius: 10, marginTop: 4, boxShadow: 'none' }}>Jogar</Btn>
            </motion.div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen title="Escolha seus 3 jogos" sub="Missão do dia · +20 XP" onBack={onBack}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={52} pose="apontando" />
        <Talk style={{ flex: 1 }}>Quais 3 jogos você vai jogar hoje? O mais escolhido vira destaque pra galera.</Talk>
      </div>

      <div style={{ position: 'relative' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar jogo" aria-label="Pesquisar jogo"
          style={{ width: '100%', height: 46, borderRadius: 14, border: '1.5px solid var(--line)', background: 'var(--card)', color: '#FFF', fontSize: 15, padding: '0 14px 0 40px', outline: 'none' }} />
        <span style={{ position: 'absolute', left: 13, top: 12 }}>🔎</span>
      </div>
      {!q && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(([k, label]) => <Pill key={k} active={f === k} onClick={() => setF(k)}>{label}</Pill>)}
        </div>
      )}
      {q && !list.length && <div className="soft">Não achei esse jogo, {fem ? 'amiga' : 'parceiro'}. Tenta só uma parte, tipo "tiger".</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, paddingBottom: 80 }}>
        {list.map((g) => {
          const k = sel.indexOf(g.id);
          const on = k >= 0;
          return (
            <motion.button key={g.id} whileTap={{ scale: 0.92 }} animate={{ scale: on ? 1.03 : 1, opacity: !on && sel.length >= 3 ? 0.45 : 1 }} transition={spring}
              onClick={() => toggle(g)} style={{ background: 'none', border: 0, padding: 0, color: '#FFF', textAlign: 'left', minWidth: 0 }}>
              <div style={{ position: 'relative', borderRadius: 12, boxShadow: on ? '0 0 0 3px var(--amber)' : 'none' }}>
                <Cover img={g.img} />
                <AnimatePresence>
                  {on && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 14, background: 'var(--amber)', color: '#1A1300', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k + 1}</motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div style={{ fontWeight: 800, fontSize: 12, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</div>
            </motion.button>
          );
        })}
      </div>

      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 'calc(var(--nav-h) + 10px)', zIndex: 6 }}>
        <Btn shine={sel.length === 3} disabled={sel.length < 3} onClick={confirm} style={{ height: 56 }}>
          {sel.length < 3 ? `Escolhidos: ${sel.length}/3` : 'Confirmar e ganhar +20 XP'}
        </Btn>
      </div>
    </Screen>
  );
}
