// Sons sintetizados com Web Audio API — sem arquivos de áudio, funciona offline.
// Cada som é uma ou mais notas curtas. Dá pra trocar por .mp3/.wav depois se quiser.

let ctx: AudioContext | null = null;
let muted = false;

try {
  muted = localStorage.getItem('papito.muted') === '1';
} catch {}

function ac(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

type ToneOpts = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  slideTo?: number;
  delay?: number;
};

function tone({ freq, dur = 0.12, type = 'sine', gain = 0.18, slideTo, delay = 0 }: ToneOpts) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  isMuted: () => muted,
  toggle() {
    muted = !muted;
    try {
      localStorage.setItem('papito.muted', muted ? '1' : '0');
    } catch {}
    if (!muted) tone({ freq: 660, dur: 0.08, type: 'triangle', gain: 0.14 });
    return muted;
  },
  // toque leve de UI
  tap() {
    tone({ freq: 420, dur: 0.05, type: 'triangle', gain: 0.1 });
  },
  // abrir tela / navegar
  whoosh() {
    tone({ freq: 300, slideTo: 620, dur: 0.14, type: 'sine', gain: 0.1 });
  },
  // ganhar XP / moeda
  coin() {
    tone({ freq: 880, dur: 0.08, type: 'square', gain: 0.12 });
    tone({ freq: 1320, dur: 0.1, type: 'square', gain: 0.12, delay: 0.06 });
  },
  // acerto
  correct() {
    tone({ freq: 660, dur: 0.1, type: 'triangle', gain: 0.16 });
    tone({ freq: 990, dur: 0.14, type: 'triangle', gain: 0.16, delay: 0.09 });
  },
  // erro, divertido
  wrong() {
    tone({ freq: 300, slideTo: 150, dur: 0.22, type: 'sawtooth', gain: 0.12 });
  },
  // marcar presença / completar
  check() {
    tone({ freq: 523, dur: 0.09, type: 'triangle', gain: 0.16 });
    tone({ freq: 784, dur: 0.12, type: 'triangle', gain: 0.16, delay: 0.08 });
  },
  // subir de nível — arpejo alegre
  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => tone({ freq: f, dur: 0.16, type: 'square', gain: 0.14, delay: i * 0.09 }));
  },
};

// vibração leve (háptico) onde o aparelho suportar
export function haptic(ms = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}
