import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from '../components/Papito';
import { Screen, Btn, Card, Talk, spring } from '../components/ui';
import { sfx, haptic } from '../sfx';
import { DEPOSIT_URL, WITHDRAW_URL, openExternal } from '../data/links';
import { getProfile } from '../profile';

// Passo a passo de depósito e saque na 1win.
// Depósito: a casa tem atalho oficial (?open=deposit) — o botão já abre a janela de depósito.
// Saque: não tem atalho por link, então mostramos onde tocar e abrimos o site.

type Step = { title: string; text: string; mock: ReactNode };

export default function Carteira({ mode, onBack, onSwitch }: { mode: 'dep' | 'saque'; onBack: () => void; onSwitch: (m: 'dep' | 'saque') => void }) {
  const fem = getProfile()?.fem ?? false;
  const [i, setI] = useState(0);
  const steps = mode === 'dep' ? DEP_STEPS : SAQUE_STEPS;
  const last = i === steps.length - 1;
  const S = steps[i];

  const go = (n: number) => { sfx.pop(); haptic(8); setI(Math.max(0, Math.min(steps.length - 1, n))); };
  const abrir = () => {
    sfx.coin();
    haptic(16);
    openExternal(mode === 'dep' ? DEPOSIT_URL : WITHDRAW_URL);
  };

  return (
    <Screen title={mode === 'dep' ? 'Depositar' : 'Sacar'} sub="Na sua conta da 1win" onBack={onBack}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--card)', padding: 4, borderRadius: 16 }}>
        {(['dep', 'saque'] as const).map((m) => (
          <motion.button key={m} whileTap={{ scale: 0.95 }} onClick={() => { sfx.pop(); setI(0); onSwitch(m); }}
            style={{ position: 'relative', height: 42, borderRadius: 12, border: 0, background: 'transparent', color: mode === m ? '#1A1300' : '#FFF', fontWeight: 800, fontSize: 15 }}>
            {mode === m && <motion.span layoutId="cartab" transition={spring} style={{ position: 'absolute', inset: 0, borderRadius: 12, background: 'var(--amber)' }} />}
            <span style={{ position: 'relative' }}>{m === 'dep' ? '＋ Depositar' : '↓ Sacar'}</span>
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <Papito size={52} pose={mode === 'dep' ? 'apontando' : 'joinha'} />
        <Talk style={{ flex: 1 }}>
          {mode === 'dep'
            ? `Seu saldo fica na sua conta da 1win, ${fem ? 'amiga' : 'parceiro'}. Te mostro rapidinho e já abro a janela de depósito pra você.`
            : `Ganhou? Saca e comemora! A 1win não deixa abrir o saque por link, então te mostro onde tocar.`}
        </Talk>
      </div>

      {/* progresso */}
      <div style={{ display: 'flex', gap: 6 }}>
        {steps.map((_, k) => (
          <motion.div key={k} onClick={() => go(k)} animate={{ background: k <= i ? '#FFC928' : '#2A4790', flex: k === i ? 2.2 : 1 }} transition={spring}
            style={{ height: 6, borderRadius: 3, cursor: 'pointer' }} />
        ))}
      </div>

      <Card style={{ padding: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div key={mode + i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={spring}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
            onDragEnd={(_, info) => { if (info.offset.x < -60) go(i + 1); else if (info.offset.x > 60) go(i - 1); }}
            style={{ padding: 16, touchAction: 'pan-y' }}>
            <div className="tiny" style={{ fontWeight: 800, color: 'var(--amber)', letterSpacing: 1 }}>PASSO {i + 1} DE {steps.length}</div>
            <div className="baloo" style={{ fontWeight: 800, fontSize: 21, lineHeight: 1.15, marginTop: 2 }}>{S.title}</div>
            <div className="soft" style={{ fontSize: 14, lineHeight: 1.4, marginTop: 4 }}>{S.text}</div>
            <div style={{ marginTop: 14 }}>{S.mock}</div>
          </motion.div>
        </AnimatePresence>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: i > 0 ? '1fr 2fr' : '1fr', gap: 8 }}>
        {i > 0 && <Btn kind="ghost" onClick={() => go(i - 1)}>Voltar</Btn>}
        {!last ? <Btn onClick={() => go(i + 1)}>Próximo passo →</Btn> : <Btn shine kind="green" onClick={abrir} style={{ height: 56, fontSize: 18 }}>{mode === 'dep' ? 'Abrir depósito na 1win' : 'Abrir a 1win pra sacar'}</Btn>}
      </div>
      {!last && <Btn kind={mode === 'dep' ? 'primary' : 'ghost'} shine={mode === 'dep'} onClick={abrir} style={{ height: 46, fontSize: 15 }}>{mode === 'dep' ? 'Já sei, abrir depósito direto' : 'Já sei, abrir a 1win'}</Btn>}

      <div className="tiny" style={{ textAlign: 'center', lineHeight: 1.4 }}>
        {mode === 'dep' ? 'Deposite só o que pode perder sem apertar o mês. +18.' : 'Dica: defina uma meta e saque quando bater. O dinheiro na conta é seu.'}
      </div>
    </Screen>
  );
}

/* ---------- mini telas que imitam a 1win (só desenho, pra orientar o toque) ---------- */

function Phone({ children }: { children: ReactNode }) {
  return (
    <div style={{ margin: '0 auto', width: 230, height: 300, borderRadius: 22, background: '#141414', border: '6px solid #05070F', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,.4)' }}>
      {children}
    </div>
  );
}
function Finger({ x, y }: { x: number; y: number }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: [1, 0.85, 1], y: [0, 6, 0] }} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
      style={{ position: 'absolute', left: x, top: y, fontSize: 30, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.5))', zIndex: 3 }}>👆</motion.div>
  );
}
function Ring({ x, y, w, h, r = 10 }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <motion.div animate={{ boxShadow: ['0 0 0 0 rgba(255,201,40,.9)', '0 0 0 8px rgba(255,201,40,0)'] }} transition={{ duration: 1.1, repeat: Infinity }}
      style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, border: '2.5px solid #FFC928', zIndex: 2 }} />
  );
}
const Logo = () => <div style={{ position: 'absolute', top: 10, left: 12, color: '#FFF', fontWeight: 900, fontSize: 18, fontStyle: 'italic' }}>1win</div>;
const Lines = ({ top }: { top: number }) => (
  <div style={{ position: 'absolute', top, left: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ height: 60, borderRadius: 10, background: 'linear-gradient(135deg,#22325a,#1b1b1b)' }} />
    <div style={{ display: 'flex', gap: 6 }}>{[0, 1, 2].map((k) => <div key={k} style={{ flex: 1, height: 70, borderRadius: 8, background: ['#2a3f9e', '#6b2a8a', '#1f8a52'][k] }} />)}</div>
  </div>
);
const TabBar = () => (
  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 44, background: '#0d0d0d', display: 'flex', justifyContent: 'space-around', alignItems: 'center', color: '#9a9a9a', fontSize: 9, fontWeight: 700 }}>
    {['☰\nMenu', '⌂\nInício', '◎\nCassino', '$\nFree', '⚽\nEsporte'].map((t) => <div key={t} style={{ whiteSpace: 'pre', textAlign: 'center', lineHeight: 1.2 }}>{t}</div>)}
  </div>
);

const MockLogin = (
  <Phone>
    <Logo />
    <div style={{ position: 'absolute', top: 8, right: 10, display: 'flex', gap: 5 }}>
      <div style={{ background: '#2b2b2b', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '6px 8px', borderRadius: 7 }}>Login</div>
      <div style={{ background: '#1FA45A', color: '#FFF', fontSize: 10, fontWeight: 800, padding: '6px 8px', borderRadius: 7 }}>Registro</div>
    </div>
    <Ring x={128} y={4} w={48} h={30} />
    <Finger x={140} y={34} />
    <Lines top={50} />
    <TabBar />
  </Phone>
);
const MockDepositoAberto = (
  <Phone>
    <Logo />
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.55)' }} />
    <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 210, background: '#FFF', borderRadius: '16px 16px 0 0', padding: 12 }}>
      <div style={{ fontWeight: 900, fontSize: 14, color: '#111' }}>Depósito</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>{['PIX', 'Cartão', 'Cripto'].map((t, k) => <div key={t} style={{ flex: 1, height: 34, borderRadius: 8, border: k === 0 ? '2px solid #1FA45A' : '1px solid #ddd', fontSize: 11, fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t}</div>)}</div>
      <div style={{ height: 34, borderRadius: 8, background: '#f1f1f1', marginTop: 8, fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', padding: '0 10px', fontWeight: 700 }}>Valor: R$ ___</div>
      <div style={{ height: 38, borderRadius: 10, background: '#1FA45A', marginTop: 10, color: '#FFF', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Depositar</div>
    </motion.div>
    <Ring x={10} y={126} w={66} h={40} r={8} />
    <Finger x={30} y={160} />
  </Phone>
);
const MockPix = (
  <Phone>
    <div style={{ position: 'absolute', inset: 0, background: '#FFF', padding: 14, color: '#111' }}>
      <div style={{ fontWeight: 900, fontSize: 14 }}>Pague com PIX</div>
      <div style={{ margin: '12px auto', width: 120, height: 120, background: 'repeating-conic-gradient(#111 0 25%, #fff 0 50%) 0 0/16px 16px', borderRadius: 6 }} />
      <div style={{ height: 32, borderRadius: 8, background: '#f1f1f1', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>Copiar código PIX</div>
      <div className="tiny" style={{ color: '#555', textAlign: 'center', marginTop: 8 }}>Cai na conta em poucos minutos</div>
    </div>
    <Ring x={14} y={160} w={190} h={34} r={8} />
    <Finger x={100} y={190} />
  </Phone>
);
const MockMenu = (
  <Phone>
    <Logo />
    <Lines top={44} />
    <TabBar />
    <Ring x={4} y={252} w={42} h={40} />
    <Finger x={14} y={218} />
  </Phone>
);
const MockId = (
  <Phone>
    <div style={{ position: 'absolute', inset: 0, background: '#161616', padding: 12, color: '#FFF' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 17, background: '#333' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 13 }}>seu_usuario</div>
          <div style={{ fontSize: 10, color: '#999' }}>ID 383•••423</div>
        </div>
        <div style={{ fontSize: 18, color: '#ccc' }}>›</div>
      </div>
      <div style={{ height: 52, borderRadius: 12, background: 'linear-gradient(90deg,#2f6b3a,#9bbf7a)', marginTop: 10, fontSize: 11, fontWeight: 900, padding: 8 }}>Free money</div>
      {['1win Token', 'Cassino', 'Esportes', 'Markets'].map((t) => <div key={t} style={{ fontSize: 12, fontWeight: 700, padding: '9px 0', borderBottom: '1px solid #262626' }}>{t}</div>)}
    </div>
    <Ring x={6} y={6} w={206} h={44} />
    <Finger x={176} y={40} />
  </Phone>
);
const MockSaque = (
  <Phone>
    <div style={{ position: 'absolute', inset: 0, background: '#F4F4F6', padding: 12, color: '#111' }}>
      <div style={{ fontWeight: 900, fontSize: 15 }}>Perfil</div>
      <div style={{ background: '#FFF', borderRadius: 12, padding: 10, marginTop: 10 }}>
        <div style={{ fontSize: 10, color: '#777' }}>Conta</div>
        <div style={{ fontWeight: 900, fontSize: 16 }}>R$ •••,••</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <div style={{ flex: 1.3, height: 32, borderRadius: 9, background: '#1FA45A', color: '#FFF', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⊕ Fazer um depósito</div>
          <div style={{ flex: 1, height: 32, borderRadius: 9, background: '#ECECEE', fontSize: 10, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Fazer saque</div>
        </div>
      </div>
      {['Bônus', 'Bonus codes', 'VIP Loyalty Program'].map((t) => <div key={t} style={{ background: '#FFF', borderRadius: 10, padding: '9px 10px', marginTop: 6, fontSize: 11, fontWeight: 800 }}>{t}</div>)}
    </div>
    <Ring x={128} y={92} w={82} h={40} r={10} />
    <Finger x={156} y={126} />
  </Phone>
);
const MockValor = (
  <Phone>
    <div style={{ position: 'absolute', inset: 0, background: '#FFF', padding: 14, color: '#111' }}>
      <div style={{ fontWeight: 900, fontSize: 14 }}>Saque</div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>{['PIX', 'Cripto'].map((t, k) => <div key={t} style={{ flex: 1, height: 34, borderRadius: 8, border: k === 0 ? '2px solid #1FA45A' : '1px solid #ddd', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t}</div>)}</div>
      <div style={{ height: 34, borderRadius: 8, background: '#f1f1f1', marginTop: 10, fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', padding: '0 10px', fontWeight: 700 }}>Chave PIX</div>
      <div style={{ height: 34, borderRadius: 8, background: '#f1f1f1', marginTop: 8, fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', padding: '0 10px', fontWeight: 700 }}>Valor: R$ ___</div>
      <div style={{ height: 38, borderRadius: 10, background: '#1FA45A', marginTop: 12, color: '#FFF', fontWeight: 900, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sacar</div>
    </div>
    <Ring x={14} y={170} w={190} h={40} r={10} />
    <Finger x={100} y={202} />
  </Phone>
);

const DEP_STEPS: Step[] = [
  { title: 'Entre na sua conta da 1win', text: 'Toca no botão aqui embaixo. Se pedir, faz o login (ou o cadastro, se ainda não tiver conta).', mock: MockLogin },
  { title: 'A janela de depósito abre sozinha', text: 'Escolhe PIX, que é o mais rápido, e digita o valor.', mock: MockDepositoAberto },
  { title: 'Paga o PIX e pronto', text: 'Copia o código ou lê o QR no app do banco. O saldo cai na conta da 1win em minutos.', mock: MockPix },
];
const SAQUE_STEPS: Step[] = [
  { title: 'Toque em Menu', text: 'Com a 1win aberta e logada, toca em "Menu", no canto de baixo à esquerda.', mock: MockMenu },
  { title: 'Toque no seu ID', text: 'Lá em cima aparece seu usuário e o ID. Toca nele (na setinha ›).', mock: MockId },
  { title: 'Toque em "Fazer saque"', text: 'No seu Perfil aparece o saldo da conta e o botão "Fazer saque".', mock: MockSaque },
  { title: 'Escolha o PIX e o valor', text: 'Coloca sua chave PIX e quanto quer sacar. Confirma e o dinheiro vai pra sua conta.', mock: MockValor },
];
