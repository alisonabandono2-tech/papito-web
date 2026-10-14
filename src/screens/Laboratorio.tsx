import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import type { Pose } from '../components/Papito';
import { Screen, Btn, Card, Talk, spring } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { getProfile } from '../profile';
import { GAMES, chip, fresh, step, rng, runCompare, talkFor, money, signed, sideName, rankTxt, isRed, type GameKey, type Sim, type CmpRow, type Roll } from '../lab/engine';

type Tab = 'como' | 'sim' | 'riscos';

// lembra o jogo escolhido quando volta de uma estratégia
let lastGame: GameKey = 'bacbo';

export default function Laboratorio({ onNav }: { onNav: (k: string) => void }) {
  const [game, setGameS] = useState<GameKey>(lastGame);
  const setGame = (g: GameKey) => { lastGame = g; setGameS(g); };
  const G = GAMES[game];
  const fem = getProfile()?.fem ?? false;

  return (
    <Screen title="Laboratório do Papito" sub="Aprenda, veja e simule — sem dinheiro de verdade">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, background: 'var(--card)', padding: 4, borderRadius: 16 }}>
        {(['bacbo', 'fs', 'roleta'] as GameKey[]).map((k) => (
          <motion.button key={k} whileTap={{ scale: 0.94 }} onClick={() => { sfx.pop(); setGame(k); }}
            style={{ position: 'relative', height: 42, border: 0, background: 'transparent', color: game === k ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 13, borderRadius: 12 }}>
            {game === k && <motion.span layoutId="labtab" transition={spring} style={{ position: 'absolute', inset: 0, background: 'var(--amber)', borderRadius: 12 }} />}
            <span style={{ position: 'relative' }}>{GAMES[k].label}</span>
          </motion.button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={54} pose="apontando" />
        <Talk style={{ flex: 1 }}>{fem ? 'Oi, amiga! ' : 'E aí, parceiro! '}Escolhe uma estratégia de {G.label} que eu te mostro como ela funciona, sem enrolação e sem promessa.</Talk>
      </div>
      <AnimatePresence mode="popLayout">
        {G.strats.map((s, i) => (
          <motion.button key={game + i} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ ...spring, delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }} onClick={() => { sfx.whoosh(); haptic(8); onNav(`lab-s:${game}:${i}`); }}
            style={{ display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left', background: 'var(--card)', border: 0, borderRadius: 18, padding: 14, color: '#FFF' }}>
            <div className="baloo" style={{ width: 38, height: 38, borderRadius: 19, flex: 'none', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'var(--amber)' }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span className="baloo" style={{ fontWeight: 800, fontSize: 17 }}>{s.name}</span>
                <span style={{ fontSize: 10, fontWeight: 800, borderRadius: 6, padding: '2px 6px', background: s.tag === 'Padrão' ? '#1F5BFF' : s.tag === 'Progressão' ? '#FFC928' : '#FFFFFF', color: s.tag === 'Padrão' ? '#FFF' : '#1A1300' }}>{s.tag}</span>
              </div>
              <div className="soft" style={{ fontSize: 13, marginTop: 2 }}>{s.short}</div>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 20 }}>›</div>
          </motion.button>
        ))}
      </AnimatePresence>
      <Btn kind="ghost" onClick={() => onNav(`lab-c:${game}`)}>⚖️ Comparar as 5 estratégias</Btn>
      <Card style={{ background: 'rgba(255,201,40,.08)', border: '1.5px solid var(--amber)' }}>
        <div style={{ fontWeight: 800, color: 'var(--amber)' }}>Papo reto do Papito</div>
        <div style={{ fontSize: 14, lineHeight: 1.45, marginTop: 4 }}>{G.truth1} {G.truth2}</div>
      </Card>
      <div className="tiny" style={{ textAlign: 'center' }}>{G.foot}</div>
    </Screen>
  );
}

export function Strat({ game, sid, onBack }: { game: GameKey; sid: number; onBack: () => void }) {
  const quem = (getProfile()?.fem ?? false) ? 'amiga' : 'parceiro';
  const G = GAMES[game], S = G.strats[sid];
  const [tab, setTab] = useState<Tab>('como');
  return (
    <Screen title={S.name} sub={`${G.label} · ${S.tag}`} onBack={onBack}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, background: 'var(--card)', padding: 4, borderRadius: 16 }}>
        {([['como', 'Como funciona'], ['sim', 'Simulador'], ['riscos', 'Riscos']] as const).map(([k, l]) => (
          <motion.button key={k} whileTap={{ scale: 0.94 }} onClick={() => { sfx.pop(); setTab(k); }}
            style={{ position: 'relative', height: 40, border: 0, background: 'transparent', color: tab === k ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 13, borderRadius: 12 }}>
            {tab === k && <motion.span layoutId="stab" transition={spring} style={{ position: 'absolute', inset: 0, background: 'var(--amber)', borderRadius: 12 }} />}
            <span style={{ position: 'relative' }}>{l}</span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'como' && (
            <>
              <Card>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>A ideia</div>
                <div style={{ fontSize: 15, lineHeight: 1.45, marginTop: 4 }}>{S.how}</div>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 18, marginTop: 12 }}>As regras</div>
                {S.rules.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.1 + i * 0.08 }} style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 14, lineHeight: 1.4 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 12, flex: 'none', background: 'var(--amber)', color: '#1A1300', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{i + 1}</span>{r}
                  </motion.div>
                ))}
              </Card>
              <Card>
                <div className="baloo" style={{ fontWeight: 800, fontSize: 18 }}>Exemplo</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {S.ex.map((x, i) => { const c = chip(game, x); return <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.15 + i * 0.12 }} style={{ width: 34, height: 34, borderRadius: 17, background: c.bg, color: c.fg, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,.25)' }}>{c.t}</motion.span>; })}
                  <span style={{ fontSize: 20, margin: '0 4px' }}>→</span>
                  <span style={{ fontWeight: 800, color: 'var(--amber)' }}>{S.exBet}</span>
                </div>
                <div className="soft" style={{ fontSize: 14, marginTop: 8, lineHeight: 1.4 }}>{S.exText}</div>
              </Card>
              <Btn shine onClick={() => setTab('sim')}>▶ Ver no simulador</Btn>
            </>
          )}
          {tab === 'sim' && <Simulador game={game} sid={sid} quem={quem} />}
          {tab === 'riscos' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <Card style={{ textAlign: 'center' }}><div className="tiny" style={{ fontWeight: 800 }}>CHANCE DE ACERTO</div><div className="baloo" style={{ fontWeight: 800, fontSize: 22, color: 'var(--amber)' }}>{S.win}</div></Card>
                <Card style={{ textAlign: 'center' }}><div className="tiny" style={{ fontWeight: 800 }}>PERDA MÉDIA A CADA R$ 100</div><div className="baloo" style={{ fontWeight: 800, fontSize: 22, color: '#FF8A8E' }}>{S.edge}</div></Card>
              </div>
              {S.risks.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 10, background: 'var(--card)', borderRadius: 16, padding: 14, fontSize: 14, lineHeight: 1.45 }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>{r}
                </motion.div>
              ))}
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <Papito size={48} pose="desconfiado" />
                <Talk style={{ flex: 1 }}>{G.noMemory} Nenhuma estratégia muda a vantagem da casa — ela só muda o jeito de ganhar e de perder.</Talk>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}

function Simulador({ game, sid, quem }: { game: GameKey; sid: number; quem: string }) {
  const G = GAMES[game];
  const [s, setS] = useState<Sim>(fresh);
  const [auto, setAuto] = useState(false);
  const [log, setLog] = useState<{ t: string; r: string; good: boolean }[]>([]);
  const r = useRef(rng(Math.floor(Math.random() * 1e9)));
  const sRef = useRef(s);
  sRef.current = s;

  const run = (k: number) => {
    let cur = sRef.current;
    const lg: typeof log = [];
    for (let i = 0; i < k && !cur.broke; i++) {
      cur = step(game, sid, cur, r.current);
      const ev = cur.ev!;
      if (ev.bet) lg.unshift({ t: `Rodada ${cur.n} · ${ev.bet.label}`, r: (ev.kind === 'green' ? 'GREEN ' : ev.kind === 'tie' ? 'EMPATE ' : 'RED ') + signed(ev.net), good: ev.kind === 'green' });
    }
    if (k === 1) {
      const ev = cur.ev;
      if (ev?.kind === 'green') { sfx.coin(); haptic(15); } else if (ev?.bet) { sfx.wrong(); haptic(25); } else sfx.tick();
    } else sfx.whoosh();
    setLog((l) => [...lg.slice(0, 5), ...l].slice(0, 5));
    setS(cur);
    if (cur.broke) setAuto(false);
  };
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => run(1), 900);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);
  const reset = () => { setAuto(false); r.current = rng(Math.floor(Math.random() * 1e9)); setS(fresh()); setLog([]); sfx.tap(); };

  const profit = s.bank - 100;
  const gp = s.greens + s.reds ? Math.round((s.greens / (s.greens + s.reds)) * 100) : 0;
  let { talk, pose } = talkFor(game, sid, s.n ? s.ev : null, quem);
  if (s.broke) { talk = 'A banca fictícia não aguenta a próxima aposta. Na vida real, é aqui que o stop de perda tinha que ter entrado antes.'; pose = 'triste'; }
  else if (s.n >= 20) {
    if (G.strats[sid].tag === 'Progressão' && gp >= 60 && profit < 0) { talk = `${gp}% de green e a banca no vermelho. É a progressão: as derrotas vêm maiores que as vitórias.`; pose = 'desconfiado'; }
    else if (profit > 0) { talk = `Tá no lucro agora, ${quem}. Na mesa de verdade, é aqui que quem é esperto para. Aperta +100 e vê se continua.`; pose = 'joinha'; }
  }

  const h = s.hb, lo = Math.min(0, ...h), hi = Math.max(130, ...h);
  const yOf = (v: number) => 66 - ((v - lo) / (hi - lo)) * 62;
  const pts = h.length < 2 ? `0,${yOf(100)} 330,${yOf(100)}` : h.map((v, i) => `${((i / (h.length - 1)) * 330).toFixed(1)},${yOf(v).toFixed(1)}`).join(' ');

  return (
    <>
      <Mesa game={game} ro={s.last} hist={s.hist} n={s.n} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={50} pose={pose as Pose} />
        <Talk style={{ flex: 1 }}>{talk}</Talk>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        <Mini l="Rodadas" v={String(s.n)} />
        <Mini l="Green" v={String(s.greens)} c="#5FD38D" />
        <Mini l="Red" v={String(s.reds)} c="#FF8A8E" />
        <Mini l="Banca" v={money(s.bank)} c={profit >= 0 ? '#FFC928' : '#FFFFFF'} />
      </div>
      <Card style={{ padding: 12 }}>
        <div className="tiny" style={{ fontWeight: 800 }}>BANCA FICTÍCIA EM {s.n} RODADAS</div>
        <svg viewBox="0 0 330 70" style={{ width: '100%', height: 80, marginTop: 4 }} preserveAspectRatio="none">
          <line x1="0" x2="330" y1={yOf(100)} y2={yOf(100)} stroke="#2A4790" strokeDasharray="4 4" />
          <polyline points={pts} fill="none" stroke={profit >= 0 ? '#FFC928' : '#FF8A8E'} strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <div className="tiny">Maior aposta exigida: {money(s.maxStake)} · menor saldo: {money(s.minBank)}</div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <Btn disabled={s.broke || auto} onClick={() => run(1)} style={{ height: 50 }}>1 rodada</Btn>
        <Btn kind="light" disabled={s.broke || auto} onClick={() => run(100)} style={{ height: 50 }}>+100</Btn>
        <Btn kind={auto ? 'light' : 'ghost'} disabled={s.broke} onClick={() => setAuto(!auto)} style={{ height: 50 }}>{auto ? '⏸ Parar' : '▶ Auto'}</Btn>
      </div>
      <Card style={{ padding: 12 }}>
        <div className="tiny" style={{ fontWeight: 800, marginBottom: 6 }}>O QUE SAIU × CHANCE REAL</div>
        {G.freq.map(([k, name, real]) => {
          const hp = s.n ? ((s.cnt[k] || 0) / s.n) * 100 : 0;
          return (
            <div key={k} style={{ marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}><span>{name}</span><span>{s.n ? hp.toFixed(1).replace('.', ',') + '%' : '—'} <span className="tiny">/ real {real.toFixed(2).replace('.', ',')}%</span></span></div>
              <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'var(--bg)', marginTop: 3 }}>
                <motion.div animate={{ width: `${hp}%` }} transition={spring} style={{ height: 8, borderRadius: 4, background: '#1F5BFF' }} />
                <div style={{ position: 'absolute', top: -3, left: `${real}%`, width: 3, height: 14, background: '#FFC928', borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </Card>
      {log.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <AnimatePresence initial={false}>
            {log.map((l, i) => (
              <motion.div key={l.t + i} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={spring}
                style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--card)', borderRadius: 12, padding: '8px 12px', fontSize: 13 }}>
                <span className="soft">{l.t}</span><b style={{ color: l.good ? '#FFC928' : '#FFFFFF' }}>{l.r}</b>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <button onClick={reset} style={{ background: 'none', border: 0, color: 'var(--muted2)', fontWeight: 700 }}>↺ Zerar simulação</button>
      <div className="tiny" style={{ textAlign: 'center' }}>{G.foot}</div>
    </>
  );
}

function Mini({ l, v, c }: { l: string; v: string; c?: string }) {
  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, padding: '8px 4px', textAlign: 'center' }}>
      <div className="tiny" style={{ fontWeight: 700 }}>{l}</div>
      <motion.div key={v} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={spring} style={{ fontWeight: 800, fontSize: 14, color: c || '#FFF' }}>{v}</motion.div>
    </div>
  );
}

// Mesa visual: dados (Bac Bo), cartas (Football Studio) ou roleta.
function Mesa({ game, ro, hist, n }: { game: GameKey; ro: Roll | null; hist: (string | number)[]; n: number }) {
  const road = hist.slice(-14);
  let res = game === 'roleta' ? 'Aperta pra girar a roleta' : game === 'fs' ? 'Aperta pra virar as cartas' : 'Aperta pra rolar os dados';
  let resColor = '#B8C6EA';
  if (ro) {
    if (game === 'roleta') { res = 'SAIU ' + ro.n; resColor = ro.n === 0 ? '#5FD38D' : isRed(ro.n!) ? '#FF8A8E' : '#FFFFFF'; }
    else {
      const T = game === 'bacbo' ? 'T' : 'E';
      res = ro.w === T ? 'EMPATE' + (game === 'bacbo' ? ` ${ro.ps} a ${ro.bs}` : '') : sideName(game, ro.w).toUpperCase() + ' VENCEU';
      resColor = ro.w === (game === 'bacbo' ? 'P' : 'C') ? '#8FB0FF' : ro.w === T ? '#FFC928' : '#FF8A8E';
    }
  }
  return (
    <Card style={{ background: 'radial-gradient(120% 90% at 50% 0%, #1d6b45 0%, #0d3a26 70%)', padding: 14 }}>
      {game === 'bacbo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {([['P', 'PLAYER', ro?.p, ro?.ps, '#4F7BFF'], ['B', 'BANKER', ro?.b, ro?.bs, '#E5484D']] as const).map(([k, name, dice, sum, color]) => (
            <div key={k} style={{ borderRadius: 14, padding: 10, textAlign: 'center', background: ro?.w === k ? color : 'rgba(0,0,0,.25)', border: `2px solid ${ro?.w === k ? '#FFF' : color}` }}>
              <div style={{ fontWeight: 900, fontSize: 12 }}>{name}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '8px 0' }}>
                {[0, 1].map((d) => <Die key={d + '-' + n} v={dice ? dice[d] : 0} pip={k === 'P' ? '#1F5BFF' : '#D93A3F'} />)}
              </div>
              <div className="baloo" style={{ fontWeight: 800, fontSize: 22 }}>{ro ? sum : '?'}</div>
            </div>
          ))}
        </div>
      )}
      {game === 'fs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {([['C', 'CASA', ro?.c, ro?.cs, '#4F7BFF'], ['V', 'VISITANTE', ro?.v, ro?.vs, '#E5484D']] as const).map(([k, name, rank, su, color]) => {
            const SU = ['♠', '♥', '♦', '♣'];
            return (
              <div key={k} style={{ borderRadius: 14, padding: 10, textAlign: 'center', background: ro?.w === k ? color : 'rgba(0,0,0,.25)', border: `2px solid ${ro?.w === k ? '#FFF' : color}` }}>
                <div style={{ fontWeight: 900, fontSize: 12 }}>{name}</div>
                <motion.div key={n} initial={{ rotateY: 180 }} animate={{ rotateY: 0 }} transition={{ duration: 0.5 }}
                  style={{ margin: '8px auto', width: 56, height: 78, borderRadius: 8, background: ro ? '#FFF' : '#2A4790', color: su === 1 || su === 2 ? '#D93A3F' : '#05070F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 900, boxShadow: '0 4px 10px rgba(0,0,0,.35)' }}>
                  {ro ? <><span style={{ fontSize: 22 }}>{rankTxt(rank!)}</span><span style={{ fontSize: 20 }}>{SU[su!]}</span></> : <span style={{ color: '#FFF' }}>?</span>}
                </motion.div>
              </div>
            );
          })}
        </div>
      )}
      {game === 'roleta' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
          <motion.div key={n} initial={{ rotate: -720 }} animate={{ rotate: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ width: 120, height: 120, borderRadius: 60, background: 'conic-gradient(#D93A3F 0 10%, #05070F 0 20%, #D93A3F 0 30%, #05070F 0 40%, #1F9D55 0 43%, #D93A3F 0 53%, #05070F 0 63%, #D93A3F 0 73%, #05070F 0 83%, #D93A3F 0 93%, #05070F 0)', border: '6px solid #C9A227', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="baloo" style={{ width: 62, height: 62, borderRadius: 31, background: ro ? (ro.n === 0 ? '#1F9D55' : isRed(ro.n!) ? '#D93A3F' : '#05070F') : '#12285E', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26 }}>{ro ? ro.n : '?'}</div>
          </motion.div>
        </div>
      )}
      <motion.div key={'r' + n} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} className="baloo"
        style={{ textAlign: 'center', fontWeight: 800, fontSize: 18, marginTop: 8, color: resColor }}>{res}</motion.div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        {road.map((x, i) => { const c = chip(game, x); return <span key={i} style={{ width: 20, height: 20, borderRadius: 10, background: c.bg, color: c.fg, fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: i === road.length - 1 ? '0 0 0 2px #FFF' : 'none' }}>{c.t}</span>; })}
      </div>
    </Card>
  );
}

const PIPS: Record<number, number[]> = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
function Die({ v, pip }: { v: number; pip: string }) {
  return (
    <motion.div initial={{ rotate: -200, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}
      style={{ width: 40, height: 40, borderRadius: 9, background: '#FFF', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', padding: 5, gap: 2, boxShadow: '0 3px 8px rgba(0,0,0,.35)' }}>
      {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ borderRadius: '50%', background: v && PIPS[v].includes(i) ? pip : 'transparent' }} />)}
    </motion.div>
  );
}

export function Compare({ game, onBack }: { game: GameKey; onBack: () => void }) {
  const G = GAMES[game];
  const [rows, setRows] = useState<CmpRow[] | null>(null);
  const [busy, setBusy] = useState(false);
  const go = () => {
    if (busy) return;
    setBusy(true); sfx.whoosh();
    setTimeout(() => { setRows(runCompare(game)); setBusy(false); sfx.check(); haptic(15); }, 40);
  };
  return (
    <Screen title="Comparar estratégias" sub={`${G.label} · mesmas rodadas pras 5`} onBack={onBack}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={54} pose={rows ? 'pensativo' : 'apontando'} />
        <Talk style={{ flex: 1 }}>{rows ? 'Repara que nenhuma escapa da perda média. O que muda é quantas sessões fecham no lucro e o tamanho do tombo.' : `Vou jogar as 5 estratégias de ${G.label}: 500 sessões de 200 rodadas, com banca fictícia de R$ 100.`}</Talk>
      </div>
      <Btn shine={!busy} onClick={go}>{busy ? 'Calculando…' : rows ? '↺ Rodar de novo' : 'Rodar comparação'}</Btn>
      {rows && rows.map((r, i) => (
        <motion.div key={r.name + i + String(r.median)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: i * 0.07 }}>
          <Card style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="baloo" style={{ fontWeight: 800, fontSize: 17 }}>{r.name}</span>
              <span className="tiny" style={{ fontWeight: 800 }}>{r.tag}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 6 }}><span>Sessões no lucro</span><b style={{ color: 'var(--amber)' }}>{Math.round(r.lucroPct * 100)}%</b></div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--bg)', marginTop: 4 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round(r.lucroPct * 100)}%` }} transition={{ duration: 0.8 }} style={{ height: 8, borderRadius: 4, background: 'var(--amber)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 10, textAlign: 'center' }}>
              <div><div className="tiny">Banca típica</div><b>{money(r.median)}</b></div>
              <div><div className="tiny">Pior momento</div><b style={{ color: '#FF8A8E' }}>{money(r.worst)}</b></div>
              <div><div className="tiny">Maior aposta</div><b>{money(r.maxStake)}</b></div>
            </div>
          </Card>
        </motion.div>
      ))}
      {rows && <div className="tiny" style={{ lineHeight: 1.45 }}>A perda média de toda estratégia, no longo prazo, é {G.edgeTxt} a cada R$ 100. A diferença entre os cards é sorte desta amostra: roda de novo e elas trocam de lugar.</div>}
    </Screen>
  );
}
