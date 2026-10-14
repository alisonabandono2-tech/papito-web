import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    const to = target;
    prev.current = target;
    if (from === to) { setVal(to); return; }
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

export function levelInfo(totalXp: number, fem: boolean) {
  const nm = (n: string) => (fem ? ({ Parceiro: 'Parceira', Brabo: 'Braba' } as any)[n] || n : n);
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
    name: nm(cur.name),
    nextName: next ? nm(next.name) : nm(cur.name),
    into,
    span,
    pct: Math.max(0, Math.min(100, (into / span) * 100)),
    ceil,
    isMax: !next,
  };
}

export const money = (cents: number) => {
  const [int, dec] = (cents / 100).toFixed(2).split('.');
  return 'R$ ' + int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + dec;
};
