import { motion } from 'framer-motion';
import Papito from '../components/Papito';
import { Screen, Card, Btn, Rise, Talk, Bar, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { LEVELS, levelInfo, levelName, VIP_XP } from '../utils';
import { store, useStore, streakOf, todayKey } from '../store';
import { getProfile } from '../profile';

const DOW = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Recompensas({ onNav }: { onNav: (k: string) => void }) {
  const fem = getProfile()?.fem ?? false;
  const st = useStore();
  const day = store.today();
  const streak = streakOf(st.checkins);
  const lvl = levelInfo(st.xp, fem);

  const week = Array.from({ length: 7 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - k));
    const key = todayKey(d);
    return { dow: DOW[d.getDay()], num: d.getDate(), done: st.checkins.includes(key), today: k === 6 };
  });

  const claim = () => {
    if (!store.checkin()) return;
    sfx.coin();
    haptic(20);
    fireConfetti();
  };

  const quizN = (day.quiz || []).length;
  const reflexN = (day.reflex || []).length;
  const missions = [
    { t: 'Abrir o app hoje', xp: '+5', done: !!day.opened, go: undefined as string | undefined },
    { t: 'Marcar presença', xp: '+50', done: !!day.checkin, go: undefined },
    { t: 'Escolher seus 3 jogos do dia', xp: '+20', done: !!day.votes, go: 'votar' },
    { t: `Quiz do dia (${quizN}/5)`, xp: 'até +50', done: quizN >= 5, go: 'quiz' },
    { t: `Mini game Reflexo (${reflexN}/3)`, xp: 'até +150', done: reflexN >= 3, go: 'reflexo' },
  ];
  const doneCount = missions.filter((m) => m.done).length;

  return (
    <Screen title="Prêmios" sub="XP vem de usar o app — sem depósito">
      <Rise i={0}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <Papito size={56} pose={day.checkin ? 'comemorando' : 'apontando'} />
          <Talk style={{ flex: 1 }}>
            {day.checkin
              ? `${streak} ${streak === 1 ? 'dia' : 'dias'} seguidos! Volta amanhã pra não perder a sequência, ${fem ? 'amiga' : 'parceiro'}.`
              : `Marca presença hoje e leva +50 XP. Sequência atual: ${streak} ${streak === 1 ? 'dia' : 'dias'}.`}
          </Talk>
        </div>
      </Rise>

      <Rise i={1}>
        <Card glow={!day.checkin}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="baloo" style={{ fontWeight: 800, fontSize: 19 }}>🔥 Sequência</div>
            <div style={{ fontWeight: 800, color: 'var(--amber)' }}>{streak} {streak === 1 ? 'dia' : 'dias'}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginTop: 12 }}>
            {week.map((w, k) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div className="tiny" style={{ fontWeight: 800 }}>{w.dow}</div>
                <motion.div
                  initial={false}
                  animate={w.done ? { scale: [0.6, 1.15, 1], background: '#FFC928' } : { scale: 1, background: w.today ? '#1F5BFF' : '#0A1A3F' }}
                  transition={{ duration: 0.45 }}
                  style={{ marginTop: 4, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: w.done ? '#1A1300' : '#FFF', border: w.today && !w.done ? '2px dashed #FFC928' : '0' }}>
                  {w.done ? '✓' : w.num}
                </motion.div>
              </div>
            ))}
          </div>
          <Btn shine={!day.checkin} disabled={day.checkin} onClick={claim} style={{ marginTop: 12 }}>
            {day.checkin ? '✓ Presença de hoje marcada' : 'Marcar presença de hoje · +50 XP'}
          </Btn>
        </Card>
      </Rise>

      <Rise i={2}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="baloo" style={{ fontWeight: 800, fontSize: 19 }}>Seu nível: {lvl.name}</div>
            <div style={{ fontWeight: 800, color: 'var(--amber)' }}>{st.xp} XP</div>
          </div>
          <div style={{ position: 'relative', marginTop: 14, marginBottom: 6 }}>
            <Bar pct={Math.min(100, (st.xp / 3000) * 100)} h={10} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {LEVELS.map((L) => {
                const on = st.xp >= L.at;
                return (
                  <div key={L.name} style={{ textAlign: 'center', width: 70 }}>
                    <motion.div animate={on ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.6, repeat: on ? Infinity : 0, repeatDelay: 2 }}
                      style={{ margin: '0 auto', width: 30, height: 30, borderRadius: 15, background: on ? 'var(--amber)' : 'var(--bg)', color: on ? '#1A1300' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
                      {L.at === VIP_XP ? '🚀' : on ? '★' : '☆'}
                    </motion.div>
                    <div style={{ fontSize: 11, fontWeight: 800, marginTop: 3 }}>{levelName(L.name, fem)}</div>
                    <div className="tiny">{L.at}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="tiny" style={{ marginTop: 6, lineHeight: 1.4 }}>No nível {levelName('Brabo', fem)} ({VIP_XP} XP) você libera o Crash VIP.</div>
        </Card>
      </Rise>

      <Rise i={3}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="baloo" style={{ fontWeight: 800, fontSize: 19 }}>Missões de hoje</div>
            <div style={{ fontWeight: 800, color: 'var(--amber)' }}>{doneCount}/{missions.length}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {missions.map((m, k) => (
              <motion.button key={k} whileTap={m.go && !m.done ? { scale: 0.97 } : {}} transition={spring}
                onClick={() => { if (m.go && !m.done) { sfx.whoosh(); onNav(m.go); } }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, background: m.done ? 'rgba(255,201,40,.1)' : 'var(--bg)', border: 0, color: '#FFF', textAlign: 'left' }}>
                <motion.div initial={false} animate={m.done ? { scale: [0.5, 1.2, 1], rotate: [0, 10, 0] } : {}}
                  style={{ width: 26, height: 26, borderRadius: 13, flex: 'none', background: m.done ? 'var(--amber)' : 'transparent', border: m.done ? 0 : '2px solid var(--line)', color: '#1A1300', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {m.done ? '✓' : ''}
                </motion.div>
                <div style={{ flex: 1, fontWeight: 700, fontSize: 14, textDecoration: m.done ? 'line-through' : 'none', opacity: m.done ? 0.7 : 1 }}>{m.t}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: 'var(--amber)' }}>{m.xp}</div>
                {m.go && !m.done && <div style={{ color: 'var(--muted)' }}>›</div>}
              </motion.button>
            ))}
          </div>
        </Card>
      </Rise>

      <Rise i={4}>
        <div className="baloo" style={{ fontWeight: 800, fontSize: 19 }}>Mini games do Papito</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          {[['⏱️', 'Reflexo', 'Para o relógio no 5,00', 'reflexo'], ['🧠', 'Quiz', '5 perguntas por dia', 'quiz']].map(([e, t, s, k]) => (
            <motion.button key={k} whileTap={{ scale: 0.94 }} onClick={() => { sfx.whoosh(); onNav(k); }}
              style={{ textAlign: 'left', background: 'var(--card)', border: 0, borderRadius: 18, padding: 14, color: '#FFF' }}>
              <div style={{ fontSize: 28 }}>{e}</div>
              <div className="baloo" style={{ fontWeight: 800, fontSize: 17 }}>{t}</div>
              <div className="tiny" style={{ fontWeight: 700 }}>{s}</div>
            </motion.button>
          ))}
        </div>
      </Rise>
    </Screen>
  );
}
