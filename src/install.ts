// Instalação do app (PWA): detecta o aparelho e guarda o pedido de instalação do Android.
// Nenhum navegador instala sozinho — a pessoa sempre dá 1 toque. A tela de instalação guia esse toque.

// ===== Configuração =====
// Depois de quantos segundos aparece o link discreto "não consigo instalar, usar no navegador".
// 0 = nunca aparece (trava total). Recomendo deixar um valor: alguns celulares antigos não instalam.
export const SKIP_AFTER_SEC = 25;

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
let bip: BIP | null = null;
const subs = new Set<() => void>();
let installed = false;

// precisa rodar o quanto antes (main.tsx chama), senão o evento passa batido
export function initInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    bip = e as BIP;
    subs.forEach((f) => f());
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    bip = null;
    try { localStorage.setItem('papito_installed', '1'); } catch { /* */ }
    subs.forEach((f) => f());
  });
}

export const canPrompt = () => !!bip;
export const justInstalled = () => installed;
export function onInstallChange(f: () => void) {
  subs.add(f);
  return () => { subs.delete(f); };
}
export async function promptInstall(): Promise<boolean> {
  if (!bip) return false;
  await bip.prompt();
  const r = await bip.userChoice;
  bip = null;
  subs.forEach((f) => f());
  return r.outcome === 'accepted';
}

const ua = () => navigator.userAgent || '';
export const isIOS = () => /iPhone|iPad|iPod/i.test(ua()) || (/Macintosh/.test(ua()) && navigator.maxTouchPoints > 1);
export const isAndroid = () => /Android/i.test(ua());
export const isMobile = () => isIOS() || isAndroid();
// navegador interno de app (Instagram, Facebook, TikTok, Telegram, etc.) — não deixa instalar
export const isInApp = () => /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|TikTok|musical_ly|BytedanceWebview|Snapchat|Telegram|KAKAOTALK|; wv\)|WebView/i.test(ua());
// iPhone fora do Safari (Chrome/Firefox do iPhone também não instalam bem)
export const isIOSNotSafari = () => isIOS() && /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua());

export function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.matchMedia?.('(display-mode: fullscreen)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
}

// Mostra a tela de instalação? Só no celular, fora do app instalado.
// Teste no PC: adicione ?instalar no endereço pra ver a tela.
export function needsInstallGate() {
  const force = new URLSearchParams(location.search).has('instalar');
  if (force) return true;
  if (isStandalone()) return false;
  try { if (sessionStorage.getItem('papito_skip_install') === '1') return false; } catch { /* */ }
  return isMobile();
}

// Abre a mesma página no Chrome (Android), saindo do navegador do WhatsApp/Instagram.
export function chromeIntentUrl() {
  const u = new URL(location.href);
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(u.href)};end`;
}
