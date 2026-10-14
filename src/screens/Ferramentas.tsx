import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import type { Pose } from '../components/Papito';
import { Screen, Btn, Card, Pill, Talk, spring } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { money } from '../utils';
import { store, useStore, todayKey } from '../store';
import { getProfile } from '../profile';
import { toast } from '../toast';

type Tab = 'sessao' | 'calc' | 'diario';
type Sess = { limit: number; cap: number; t0: number } | null;
const SKEY = 'papito_session';
const loadSess = (): Sess => { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch { return null; } };
const saveSess = (s: Sess) => { try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch { /* */ } };

export default function Ferramentas() {
  const [tab, setTab] = useState<Tab>('sessao');
  return (
    <Screen title="Ferramentas" sub="Jogar com cabeça é jogar por mais tempo">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, background: 'var(--card)', padding: 4, borderRadius: 16 }}>
        {([['sessao', '⏱️ Sessão'], ['calc', '🧮 Banca'], ['diario', '📒 Diário']] as const).map(([k, l]) => (
          <motion.button key={k} whileTap={{ scale: 0.94 }} onClick={() => { sfx.pop(); setTab(k); }}
            style={{ position: 'relative', height: 42, border: 0, background: 'transparent', color: tab === k ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 14, borderRadius: 12 }}>
            {tab === k && <motion.span layoutId="ftab" transition={spring} style={{ position: 'absolute', inset: 0, background: 'var(--amber)', borderRadius: 12 }} />}
            <span style={{ position: 'relative' }}>{l}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'sessao' && <Sessao onEnd={() => setTab('diario')} />}
          {tab === 'calc' && <Calc />}
          {tab === 'diario' && <Diario />}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}

function Sessao({ onEnd }: { onEnd: () => void }) {
  const fem = getProfile()?.fem ?? false;
  const [sess, setSess] = useState<Sess>(loadSess);
  const [limit, setLimit] = useState(sess?.limit || 30);
  const [cap, setCap] = useState(sess?.cap || 50);
  const [now, setNow] = useState(Date.now());
  const warned = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, []);

  const el = sess ? Math.floor((now - sess.t0) / 1000) : 0;
  const lim = (sess?.limit || limit) * 60;
  const over = !!sess && el >= lim;
  const pct = sess ? Math.min(1, el / lim) : 0;
  useEffect(() => {
    if (over && !warned.current) { warned.current = true; sfx.wrong(); haptic([200, 100, 200]); }
  }, [over]);

  const startS = () => { const s = { limit, cap, t0: Date.now() }; saveSess(s); setSess(s); warned.current = false; sfx.check(); haptic(15); };
  const endS = () => { saveSess(null); setSess(null); sfx.check(); toast(`Sessão de ${Math.max(1, Math.round(el / 60))} min encerrada. Anota no diário!`); onEnd(); };

  const mm = String(Math.floor(el / 60)).padStart(2, '0');
  const ss = String(el % 60).padStart(2, '0');
  let talk = 'Antes de jogar, combina comigo: quanto tempo e quanto da banca?';
  let pose: Pose = 'apontando';
  if (sess && !over) { talk = `Tô de olho no relógio pra você. Limite: ${money(sess.cap)}. Bateu? Para.`; pose = 'joinha'; }
  if (over) { talk = `Deu o tempo que você combinou, ${fem ? 'amiga' : 'parceiro'}. Bora fazer uma pausa?`; pose = 'desconfiado'; }

  return (
    <>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={56} pose={pose} />
        <Talk style={{ flex: 1 }}>{talk}</Talk>
      </div>
      <Card glow={over}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 200, height: 200 }}>
            <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="86" stroke="#0A1A3F" strokeWidth="14" fill="none" />
              <circle cx="100" cy="100" r="86" stroke={over ? '#FF5A5F' : '#FFC928'} strokeWidth="14" fill="none" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 86} strokeDashoffset={2 * Math.PI * 86 * (1 - pct)} style={{ transition: 'stroke-dashoffset .5s' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={over ? { scale: [1, 1.08, 1] } : {}} transition={{ duration: 0.8, repeat: Infinity }} className="baloo"
                style={{ fontWeight: 800, fontSize: 46, color: over ? '#FF8A8E' : '#FFF', fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</motion.div>
              <div className="tiny" style={{ fontWeight: 700 }}>{sess ? `de ${sess.limit}:00 · banca ${money(sess.cap)}` : 'pronto pra começar'}</div>
            </div>
          </div>
        </div>
        {!sess && (
          <>
            <div style={{ fontWeight: 800, marginTop: 12 }}>Quanto tempo vou jogar</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{[15, 30, 60].map((m) => <Pill key={m} active={limit === m} onClick={() => setLimit(m)} style={{ flex: 1 }}>{m} min</Pill>)}</div>
            <div style={{ fontWeight: 800, marginTop: 12 }}>Limite de banca da sessão</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{[20, 50, 100].map((v) => <Pill key={v} active={cap === v} onClick={() => setCap(v)} style={{ flex: 1 }}>R$ {v}</Pill>)}</div>
          </>
        )}
        <div style={{ marginTop: 14 }}>
          {sess ? <Btn kind={over ? 'primary' : 'ghost'} shine={over} onClick={endS}>Encerrar sessão</Btn> : <Btn shine onClick={startS}>Começar sessão</Btn>}
        </div>
      </Card>
      <div className="tiny" style={{ textAlign: 'center' }}>O relógio continua mesmo se você sair dessa tela.</div>
    </>
  );
}

function Calc() {
  const [banca, setBanca] = useState('200');
  const [pct, setPct] = useState(2);
  const b = parseFloat(banca.replace(',', '.')) || 0;
  const stake = (b * pct) / 100;
  const n = stake > 0 ? Math.floor(b / stake) : 0;
  return (
    <>
      <Card>
        <div style={{ fontWeight: 800 }}>Minha banca (R$)</div>
        <input inputMode="decimal" value={banca} onChange={(e) => setBanca(e.target.value.replace(/[^\d,.]/g, ''))} aria-label="Minha banca"
          style={{ marginTop: 6, width: '100%', height: 56, borderRadius: 14, border: '2px solid var(--amber)', background: 'var(--bg)', color: '#FFF', fontSize: 26, fontWeight: 800, textAlign: 'center', outline: 'none' }} />
        <div style={{ fontWeight: 800, marginTop: 14 }}>Quanto da banca por aposta</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>{[1, 2, 5].map((p) => <Pill key={p} active={pct === p} onClick={() => setPct(p)} style={{ flex: 1 }}>{p}%</Pill>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          <Stat label="Valor por aposta" value={money(stake)} />
          <Stat label="Apostas que a banca cobre" value={String(n)} />
        </div>
      </Card>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={48} pose="pensativo" />
        <Talk style={{ flex: 1 }}>Apostar uma parte pequena da banca faz ela durar mais. Só use dinheiro que você pode perder.</Talk>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 14, padding: 12, textAlign: 'center' }}>
      <div className="tiny" style={{ fontWeight: 700 }}>{label}</div>
      <motion.div key={value} initial={{ scale: 1.25, color: '#FFFFFF' }} animate={{ scale: 1, color: '#FFC928' }} transition={spring} className="baloo" style={{ fontWeight: 800, fontSize: 24 }}>{value}</motion.div>
    </div>
  );
}

function Diario() {
  const st = useStore();
  const [open, setOpen] = useState(false);
  const [game, setGame] = useState('');
  const [entrou, setEntrou] = useState('');
  const [saiu, setSaiu] = useState('');
  const [min, setMin] = useState('');

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
  const wk = todayKey(weekAgo);
  const week = st.diary.filter((d) => d.date >= wk);
  const inn = week.reduce((a, d) => a + d.entrou, 0);
  const out = week.reduce((a, d) => a + d.saiu, 0);
  const mins = week.reduce((a, d) => a + d.min, 0);
  const res = out - inn;

  const num = (s: string) => parseFloat(s.replace(',', '.')) || 0;
  const add = () => {
    if (!game.trim()) { sfx.wrong(); toast('Coloca o nome do jogo'); return; }
    store.addDiary({ game: game.trim(), entrou: num(entrou), saiu: num(saiu), min: Math.round(num(min)) });
    sfx.check(); haptic(12);
    setGame(''); setEntrou(''); setSaiu(''); setMin(''); setOpen(false);
  };

  return (
    <>
      <Card>
        <div className="tiny" style={{ fontWeight: 800 }}>RESULTADO DOS ÚLTIMOS 7 DIAS</div>
        <motion.div key={res} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={spring} className="baloo" style={{ fontWeight: 800, fontSize: 38, color: res >= 0 ? '#5FD38D' : '#FF8A8E' }}>
          {res >= 0 ? '+' : ''}{money(res)}
        </motion.div>
        <div className="soft" style={{ fontSize: 13 }}>Entrou {money(inn)} · Saiu {money(out)} · {week.length} sessões · {Math.floor(mins / 60)}h{String(mins % 60).padStart(2, '0')} jogando</div>
      </Card>

      <AnimatePresence>
        {open ? (
          <motion.div key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <Card>
              <Field label="Jogo" value={game} set={setGame} placeholder="Ex: Fortune Tiger" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <Field label="Entrou R$" value={entrou} set={setEntrou} num />
                <Field label="Saiu R$" value={saiu} set={setSaiu} num />
                <Field label="Minutos" value={min} set={setMin} num />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginTop: 10 }}>
                <Btn kind="ghost" onClick={() => setOpen(false)}>Cancelar</Btn>
                <Btn onClick={add}>Salvar</Btn>
              </div>
            </Card>
          </motion.div>
        ) : (
          <Btn key="btn" shine onClick={() => setOpen(true)}>＋ Anotar sessão</Btn>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {st.diary.length === 0 && <div className="soft" style={{ textAlign: 'center', fontSize: 14, padding: 12 }}>Nenhuma sessão anotada ainda. Anotar ajuda a ver pra onde o dinheiro vai.</div>}
        <AnimatePresence>
          {st.diary.map((d) => {
            const r = d.saiu - d.entrou;
            return (
              <motion.div key={d.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={spring}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', borderRadius: 14, padding: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.game}</div>
                  <div className="tiny">{d.date.split('-').reverse().join('/')} · {d.min} min</div>
                </div>
                <div style={{ fontWeight: 800, color: r >= 0 ? '#5FD38D' : '#FF8A8E' }}>{r >= 0 ? '+' : ''}{money(r)}</div>
                <button onClick={() => { sfx.tap(); store.removeDiary(d.id); }} aria-label="Apagar" style={{ width: 30, height: 30, borderRadius: 15, border: 0, background: 'var(--bg)', color: 'var(--muted)' }}>✕</button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}

function Field({ label, value, set, placeholder, num }: { label: string; value: string; set: (v: string) => void; placeholder?: string; num?: boolean }) {
  return (
    <label style={{ display: 'block', marginTop: 8 }}>
      <div className="tiny" style={{ fontWeight: 800 }}>{label}</div>
      <input value={value} inputMode={num ? 'decimal' : 'text'} placeholder={placeholder}
        onChange={(e) => set(num ? e.target.value.replace(/[^\d,.]/g, '') : e.target.value)}
        style={{ marginTop: 4, width: '100%', height: 44, borderRadius: 12, border: '1.5px solid var(--line)', background: 'var(--bg)', color: '#FFF', fontSize: 16, fontWeight: 700, padding: '0 10px', outline: 'none' }} />
    </label>
  );
}
