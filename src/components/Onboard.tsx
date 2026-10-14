import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from './Papito';
import { sfx, haptic } from '../sfx';
import type { Profile } from '../profile';

// Abertura do app: PRIMEIRO o gênero (antes de qualquer coisa), depois o nome.
// Papito fala direto com a pessoa, no tom de parceiro/parceira.
export default function Onboard({ onDone }: { onDone: (p: Profile) => void }) {
  const [step, setStep] = useState<'genero' | 'nome'>('genero');
  const [fem, setFem] = useState(false);
  const [nome, setNome] = useState('');

  const pickGenero = (f: boolean) => {
    sfx.tap();
    haptic(12);
    setFem(f);
    setStep('nome');
  };

  const confirmar = () => {
    const limpo = nome.trim();
    if (limpo.length < 2) {
      sfx.wrong();
      haptic(20);
      return;
    }
    sfx.correct();
    haptic(18);
    onDone({ nome: limpo, fem });
  };

  return (
    <div className="phone">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(130% 90% at 50% 0%, #163a8a 0%, var(--bg) 60%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 18,
          textAlign: 'center',
        }}
      >
        <AnimatePresence mode="wait">
          {step === 'genero' ? (
            <motion.div
              key="genero"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}
            >
              <motion.div initial={{ scale: 0.6, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
                <Papito size={150} pose="joinha" />
              </motion.div>
              <div className="baloo" style={{ fontWeight: 800, fontSize: 28, lineHeight: 1.1 }}>
                Salve! Eu sou o <span style={{ color: 'var(--amber)' }}>Papito</span>
              </div>
              <div className="soft" style={{ fontSize: 16, lineHeight: 1.4, maxWidth: 300 }}>
                Antes de começar, me diz: como eu te chamo?
              </div>
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 6 }}>
                <GeneroBtn label="Sou parceiro" emoji="👊" onClick={() => pickGenero(false)} />
                <GeneroBtn label="Sou parceira" emoji="💅" onClick={() => pickGenero(true)} />
              </div>
              <div className="tiny" style={{ marginTop: 4 }}>+18 · Jogue com responsabilidade</div>
            </motion.div>
          ) : (
            <motion.div
              key="nome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
            >
              <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 13 }}>
                <Papito size={130} pose="apontando" />
              </motion.div>
              <div className="baloo" style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1 }}>
                Fechou, {fem ? 'parceira' : 'parceiro'}! E seu nome?
              </div>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmar()}
                placeholder="Digita seu nome aqui"
                maxLength={24}
                style={{
                  width: '100%',
                  height: 56,
                  borderRadius: 16,
                  border: '2px solid var(--amber)',
                  background: 'var(--card)',
                  color: '#FFF',
                  fontSize: 20,
                  fontWeight: 700,
                  textAlign: 'center',
                  outline: 'none',
                }}
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={confirmar}
                style={{
                  width: '100%',
                  height: 54,
                  borderRadius: 16,
                  border: 0,
                  background: 'var(--amber)',
                  color: '#1A1300',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                Bora, {fem ? 'braba' : 'brabo'}! 🚀
              </motion.button>
              <button
                onClick={() => { sfx.tap(); setStep('genero'); }}
                style={{ background: 'none', border: 0, color: 'var(--muted2)', fontSize: 14, fontWeight: 700 }}
              >
                ← voltar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GeneroBtn({ label, emoji, onClick }: { label: string; emoji: string; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      style={{
        height: 92,
        borderRadius: 18,
        border: '2px solid var(--line)',
        background: 'var(--card)',
        color: '#FFF',
        fontWeight: 800,
        fontSize: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <span style={{ fontSize: 30 }}>{emoji}</span>
      {label}
    </motion.button>
  );
}
