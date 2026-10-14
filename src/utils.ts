import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    const to = target;
    prev.current = target;
    if (from === to) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(from + (to - from) * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export const LEVELS = [
  { at: 0, name: 'Novato' },
  { at: 500, name: 'Parceiro' },
  { at: 1000, name: 'Brabo' },
  { at: 3000, name: 'Lenda' },
];

// Área VIP (Crash) libera no nível Brabo.
export const VIP_XP = 1000;

export function levelName(name: string, fem: boolean) {
  if (!fem) return name;
  return ({ Parceiro: 'Parceira', Brabo: 'Braba' } as Record<string, string>)[name] || name;
}

export function levelInfo(totalXp: number, fem: boolean) {
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (totalXp >= LEVELS[k].at) i = k;
  const cur = LEVELS[i];
  const next = LEVELS[i + 1];
  const floor = cur.at;
  const ceil = next ? next.at : cur.at + 1000;
  const into = totalXp - floor;
  const span = ceil - floor;
  return {
    index: i,
    name: levelName(cur.name, fem),
    nextName: next ? levelName(next.name, fem) : levelName(cur.name, fem),
    into,
    span,
    pct: Math.max(0, Math.min(100, (into / span) * 100)),
    ceil,
    isMax: !next,
  };
}

export const money = (v: number) => {
  const [int, dec] = Math.abs(v).toFixed(2).split('.');
  return (v < 0 ? '-' : '') + 'R$ ' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
};

// número do dia (muda à meia-noite local) — usado pra sortear o conteúdo do dia
export function dayNumber(d = new Date()) {
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
}
