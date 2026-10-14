import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './screens/Home';
import Papito from './components/Papito';
import Onboard from './components/Onboard';
import { useProfile } from './profile';
import { sfx } from './sfx';

// Router simples por estado. Só a Home está pronta nesta base;
// as outras telas (Recompensas, Laboratório, Votar, Ferramentas) vêm na sequência,
// reusando o protótipo que já validamos.
export default function App() {
  const [screen, setScreen] = useState('inicio');
  const [profile, setProfile] = useProfile();

  // Gênero primeiro, depois o nome — antes de tudo. Só entra na Home com perfil.
  if (!profile) {
    return (
      <motion.div key="onboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Onboard onDone={setProfile} />
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'inicio' ? (
        <motion.div key="inicio" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Home onNav={setScreen} />
        </motion.div>
      ) : (
        <motion.div key={screen} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22 }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Placeholder name={screen} onBack={() => { sfx.whoosh(); setScreen('inicio'); }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TITLES: Record<string, string> = {
  recompensas: 'Recompensas',
  ferramentas: 'Ferramentas',
  votar: 'Escolher 3 jogos',
};

function Placeholder({ name, onBack }: { name: string; onBack: () => void }) {
  return (
    <div className="phone">
      <div style={{ padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label="Voltar" style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--card)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="baloo" style={{ fontWeight: 800, fontSize: 22 }}>{TITLES[name] || 'Papito'}</div>
      </div>
      <div style={{ height: 'calc(100% - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
        <Papito size={150} pose="pensativo" />
        <div className="baloo" style={{ fontWeight: 800, fontSize: 24 }}>Esta tela vem na sequência</div>
        <div className="soft" style={{ lineHeight: 1.4 }}>A Home já está pronta com motion e som. As próximas telas reusam o protótipo que a gente validou.</div>
        <button onClick={onBack} style={{ marginTop: 8, height: 50, padding: '0 24px', borderRadius: 16, border: 0, background: 'var(--amber)', color: '#1A1300', fontWeight: 800, fontSize: 16 }}>Voltar pra Home</button>
      </div>
    </div>
  );
}
