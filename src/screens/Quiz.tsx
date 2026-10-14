import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import type { Pose } from '../components/Papito';
import { Screen, Btn, Card, Talk, spring, fireConfetti } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { BANK } from '../data/quiz';
import { dayNumber } from '../utils';
import { store, useStore } from '../store';
import { getProfile } from '../profile';

// 5 perguntas por dia, vindas do banco de 52. O conjunto muda todo dia e só repete depois de ~10 dias.
function todaysQuestions() {
  const sets = Math.ceil(BANK.length / 5);
  const s = dayNumber() % sets;
  return Array.from({ length: 5 }, (_, k) => BANK[(s * 5 + k) % BANK.length]);
}
const XP_PER = 10;

export default function Quiz({ onBack }: { onBack: () => void }) {
  const fem = getProfile()?.fem ?? false;
  useStore();
  const QS = todaysQuestions();
  const saved = store.today().quiz || [];
  const [answers, setAnswers] = useState<number[]>(saved);
  const [picked, setPicked] = useState<number | null>(null);
  const idx = answers.length;
  const done = idx >= QS.length;
  const score = answers.filter((a, k) => a === QS[k].ok).length;

  const choose = (o: number) => {
    if (picked !== null || done) return;
    setPicked(o);
    const right = o === QS[idx].ok;
    if (right) { sfx.correct(); haptic(15); store.addXp(XP_PER, 'Acertou no quiz'); }
    else { sfx.wrong(); haptic([30, 40, 30]); }
  };
  const next = () => {
    const a = [...answers, picked!];
    setAnswers(a);
    store.answerQuiz(a);
    setPicked(null);
    sfx.whoosh();
    if (a.length >= QS.length && a.filter((x, k) => x === QS[k].ok).length >= 4) fireConfetti(true);
  };

  if (done) {
    const pose: Pose = score >= 4 ? 'comemorando' : score >= 2 ? 'joinha' : 'rindo';
    return (
      <Screen title="Quiz do dia" sub="Concluído ✓" onBack={onBack}>
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', paddingTop: 20 }}>
          <Papito size={150} pose={pose} />
          <div className="baloo" style={{ fontWeight: 800, fontSize: 46, color: 'var(--amber)', lineHeight: 1 }}>{score}/5</div>
          <div className="baloo" style={{ fontWeight: 800, fontSize: 20 }}>+{score * XP_PER} XP</div>
          <Talk>{score >= 4 ? `Mandou muito, ${fem ? 'braba' : 'brabo'}! Sabe mais que muito jogador por aí.` : score >= 2 ? 'Boa! Amanhã tem 5 perguntas novas.' : 'Faz parte! Amanhã tem pergunta nova e você manda melhor.'}</Talk>
          <div className="tiny">Novas perguntas amanhã. Elas só repetem depois de uns 10 dias.</div>
        </motion.div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {QS.map((q, k) => (
            <div key={k} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', background: 'var(--card)', borderRadius: 14, padding: 10, fontSize: 13 }}>
              <span>{answers[k] === q.ok ? '✅' : '❌'}</span>
              <span><b>{q.text}</b><br /><span className="soft">{q.opts[q.ok]}</span></span>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  const Q = QS[idx];
  const right = picked !== null && picked === Q.ok;
  return (
    <Screen title="Quiz do dia" sub={`Pergunta ${idx + 1} de 5 · +${XP_PER} XP por acerto`} onBack={onBack}>
      <div style={{ display: 'flex', gap: 6 }}>
        {QS.map((_, k) => (
          <motion.div key={k} animate={{ background: k < idx ? (answers[k] === QS[k].ok ? '#5FD38D' : '#FF8A8E') : k === idx ? '#FFC928' : '#2A4790', flex: k === idx ? 2 : 1 }} transition={spring} style={{ height: 6, borderRadius: 3 }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={56} pose={picked === null ? 'pensativo' : right ? 'comemorando' : 'surpreso'} />
        <Talk style={{ flex: 1 }}>{picked === null ? 'Pensa bem antes de responder…' : right ? 'ACERTOU! +10 XP' : 'Quase! Olha a explicação.'}</Talk>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Card><div className="baloo" style={{ fontWeight: 800, fontSize: 20, lineHeight: 1.2 }}>{Q.text}</div></Card>
          {Q.opts.map((o, k) => {
            const isOk = picked !== null && k === Q.ok;
            const isBad = picked === k && k !== Q.ok;
            return (
              <motion.button key={k} whileTap={picked === null ? { scale: 0.97 } : {}} onClick={() => choose(k)}
                animate={isBad ? { x: [0, -8, 8, -6, 6, 0] } : isOk ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 0.4 }}
                style={{ minHeight: 54, borderRadius: 16, padding: '12px 14px', textAlign: 'left', fontWeight: 800, fontSize: 15, color: isOk ? '#062B15' : '#FFF', border: isOk || isBad ? 0 : '2px solid var(--line)', background: isOk ? '#5FD38D' : isBad ? '#C2414A' : 'var(--card)', opacity: picked !== null && !isOk && !isBad ? 0.5 : 1 }}>
                {['A', 'B', 'C', 'D'][k]}. {o}
              </motion.button>
            );
          })}
          <AnimatePresence>
            {picked !== null && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'rgba(255,201,40,.1)', border: '1.5px solid var(--amber)', borderRadius: 14, padding: 12, fontSize: 14, lineHeight: 1.4 }}>
                  <b style={{ color: 'var(--amber)' }}>Papo reto: </b>{Q.why}
                </div>
                <Btn shine onClick={next}>{idx === 4 ? 'Ver meu resultado' : 'Próxima pergunta →'}</Btn>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
