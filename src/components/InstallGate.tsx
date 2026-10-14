import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Papito from './Papito';
import { Btn, Talk, spring, fireConfetti } from './ui';
import { sfx, haptic } from '../sfx';
import { SKIP_AFTER_SEC, canPrompt, promptInstall, onInstallChange, justInstalled, isIOS, isAndroid, isInApp, isIOSNotSafari, chromeIntentUrl } from '../install';

// Tela que aparece quando o link é aberto no celular pelo navegador:
// "instala o Papito pra usar". Mostra o caminho certo pra cada aparelho.
export default function InstallGate({ onSkip }: { onSkip: () => void }) {
  const [, force] = useState(0);
  const [waited, setWaited] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [done, setDone] = useState(justInstalled());
  const [copied, setCopied] = useState(false);

  useEffect(() => onInstallChange(() => { force((x) => x + 1); if (justInstalled()) { setDone(true); sfx.levelUp(); fireConfetti(true); } }), []);
  useEffect(() => {
    const a = setTimeout(() => setWaited(true), 2500);
    const b = SKIP_AFTER_SEC > 0 ? setTimeout(() => setShowSkip(true), SKIP_AFTER_SEC * 1000) : 0;
    return () => { clearTimeout(a); if (b) clearTimeout(b); };
  }, []);

  const ios = isIOS(), android = isAndroid(), inApp = isInApp();
  const iosOther = isIOSNotSafari();

  const install = async () => {
    sfx.tap(); haptic(12);
    const ok = await promptInstall();
    if (ok) { setDone(true); sfx.levelUp(); fireConfetti(true); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(location.href.replace(/[?&]instalar\b/, '')); setCopied(true); sfx.check(); } catch { /* */ }
  };

  let body: ReactNode;
  if (done) {
    body = (
      <>
        <Big>Pronto! O Papito tá instalado 🎉</Big>
        <Sub>Agora fecha essa página e abre o <b>Papito</b> pelo ícone na tela inicial do seu celular.</Sub>
        <IconHint />
      </>
    );
  } else if (inApp && android) {
    body = (
      <>
        <Big>Abre no Chrome pra instalar</Big>
        <Sub>Você abriu por dentro de outro app (WhatsApp, Instagram…). Daqui não dá pra instalar. Toca no botão que eu te levo pro Chrome:</Sub>
        <Btn shine onClick={() => { sfx.whoosh(); location.href = chromeIntentUrl(); }} style={{ height: 60, fontSize: 19 }}>Abrir no Chrome</Btn>
        <Steps items={[['⋮', 'Ou toca nos 3 pontinhos lá em cima'], ['🌐', 'Escolhe "Abrir no navegador" / "Abrir no Chrome"']]} />
      </>
    );
  } else if ((inApp || iosOther) && ios) {
    body = (
      <>
        <Big>Abre no Safari pra instalar</Big>
        <Sub>No iPhone, o app só instala pelo <b>Safari</b>. É rapidinho:</Sub>
        <Steps items={[['⋯', 'Toca nos 3 pontinhos ou no ícone de compartilhar'], ['🧭', 'Escolhe "Abrir no Safari"'], ['📲', 'Lá no Safari eu te mostro o resto']]} />
        <Btn kind="ghost" onClick={copy}>{copied ? '✓ Link copiado! Cola no Safari' : '📋 Copiar link pra colar no Safari'}</Btn>
        <ArrowTo pos="top" />
      </>
    );
  } else if (ios) {
    body = (
      <>
        <Big>Instala em 3 toques</Big>
        <Sub>No iPhone é pelo menu do Safari, igual salvar um contato:</Sub>
        <Steps items={[[<ShareIcon key="s" />, 'Toca em Compartilhar, embaixo no meio da tela'], ['➕', 'Rola e toca em "Adicionar à Tela de Início"'], ['✅', 'Toca em "Adicionar", lá em cima à direita']]} />
        <ArrowTo pos="bottom" />
      </>
    );
  } else if (canPrompt()) {
    body = (
      <>
        <Big>Instala o Papito em 1 toque</Big>
        <Sub>É grátis, leve e abre direto da tela inicial, igual app. Sem loja, sem cadastro.</Sub>
        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <Btn shine onClick={install} style={{ height: 64, fontSize: 21 }}>📲 Instalar o Papito</Btn>
        </motion.div>
      </>
    );
  } else if (android && waited) {
    body = (
      <>
        <Big>Instala pelo menu do Chrome</Big>
        <Sub>É só adicionar na tela inicial:</Sub>
        <Steps items={[['⋮', 'Toca nos 3 pontinhos, lá em cima à direita'], ['📲', 'Toca em "Instalar app" ou "Adicionar à tela inicial"'], ['✅', 'Confirma em "Instalar"']]} />
        <ArrowTo pos="top" />
      </>
    );
  } else {
    body = (
      <>
        <Big>Preparando a instalação…</Big>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ width: 36, height: 36, borderRadius: 18, border: '4px solid var(--line)', borderTopColor: 'var(--amber)', margin: '10px auto' }} />
      </>
    );
  }

  return (
    <div className="phone">
      <div className="scroll" style={{ background: 'radial-gradient(130% 80% at 50% 0%, #163a8a 0%, var(--bg) 60%)' }}>
        <div style={{ minHeight: '100%', padding: '28px 20px 30px', display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Papito size={128} pose={done ? 'comemorando' : 'joinha'} />
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 1.2, repeat: Infinity }}
                style={{ position: 'absolute', right: -14, bottom: -4, width: 48, height: 48, borderRadius: 14, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 6px 16px rgba(0,0,0,.35)' }}>📲</motion.div>
            </div>
          </motion.div>
          <Talk style={{ textAlign: 'center' }}>Pra usar o Papito, instala ele no seu celular. Fica na tela inicial e abre na hora!</Talk>
          <AnimatePresence mode="wait">
            <motion.div key={String(done) + String(canPrompt()) + String(waited)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={spring}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
              {body}
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }} className="tiny">
            <span>✓ Grátis</span><span>✓ Sem loja</span><span>✓ Menos de 1 MB</span><span>+18</span>
          </div>
          {showSkip && !done && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => { try { sessionStorage.setItem('papito_skip_install', '1'); } catch { /* */ } onSkip(); }}
              style={{ background: 'none', border: 0, color: 'var(--muted)', fontSize: 12, textDecoration: 'underline' }}>
              Não consigo instalar, usar pelo navegador
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

const Big = ({ children }: { children: ReactNode }) => <div className="baloo" style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.1 }}>{children}</div>;
const Sub = ({ children }: { children: ReactNode }) => <div className="soft" style={{ fontSize: 15, lineHeight: 1.45 }}>{children}</div>;

function Steps({ items }: { items: [ReactNode, string][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
      {items.map(([ic, t], i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ ...spring, delay: 0.15 + i * 0.12 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--card)', borderRadius: 16, padding: '12px 14px' }}>
          <div className="baloo" style={{ width: 30, height: 30, borderRadius: 15, background: 'var(--amber)', color: '#1A1300', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>{i + 1}</div>
          <div style={{ fontSize: 22, width: 28, textAlign: 'center', flex: 'none' }}>{ic}</div>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{t}</div>
        </motion.div>
      ))}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F9BFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Compartilhar">
      <path d="M12 3v12" /><path d="M8 7l4-4 4 4" /><path d="M6 11v9h12v-9" />
    </svg>
  );
}

// seta animada apontando pro menu do navegador (em cima) ou pra barra do Safari (embaixo)
function ArrowTo({ pos }: { pos: 'top' | 'bottom' }) {
  const top = pos === 'top';
  return (
    <motion.div animate={{ y: top ? [0, -10, 0] : [0, 10, 0] }} transition={{ duration: 0.9, repeat: Infinity }}
      style={{ position: 'fixed', zIndex: 20, fontSize: 44, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.5))', ...(top ? { top: 6, right: 14 } : { bottom: 6, left: '50%', marginLeft: -22 }) }}>
      {top ? '☝️' : '👇'}
    </motion.div>
  );
}

function IconHint() {
  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.3 }} style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <img src="/icon-192.png" alt="" style={{ width: 72, height: 72, borderRadius: 18, boxShadow: '0 0 0 3px var(--amber), 0 10px 24px rgba(0,0,0,.4)' }} />
        <div style={{ fontWeight: 800 }}>Papito</div>
      </div>
    </motion.div>
  );
}
