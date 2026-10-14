import { useSyncExternalStore } from 'react';

// Estado do jogador guardado no aparelho (localStorage).
// Tudo aqui é do app Papito: XP, presença, missões, quiz, mini game e diário.
// Nada de saldo da casa — isso só com a API oficial.

export type DiaryEntry = { id: string; date: string; game: string; entrou: number; saiu: number; min: number };
type Day = {
  opened?: boolean;
  checkin?: boolean;
  votes?: string[];
  quiz?: number[]; // respostas dadas (índice da opção) na ordem das 5 perguntas do dia
  reflex?: number[]; // diferenças (s) das tentativas do dia
};
type State = { xp: number; checkins: string[]; days: Record<string, Day>; diary: DiaryEntry[] };

const KEY = 'papito_state_v1';

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw) as State;
      return { xp: s.xp || 0, checkins: s.checkins || [], days: s.days || {}, diary: s.diary || [] };
    }
  } catch {
    /* sem storage */
  }
  return { xp: 0, checkins: [], days: {}, diary: [] };
}

let state: State = load();
const subs = new Set<() => void>();

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* modo privado */
  }
}
function set(next: State) {
  state = next;
  save();
  subs.forEach((f) => f());
}
function patchDay(p: Partial<Day>) {
  const k = todayKey();
  set({ ...state, days: { ...state.days, [k]: { ...(state.days[k] || {}), ...p } } });
}

// ---- eventos de XP (pra toast "+20 XP" e tela de subir de nível) ----
export type Gain = { amount: number; reason: string; before: number; after: number };
const gainSubs = new Set<(g: Gain) => void>();
export function onGain(f: (g: Gain) => void) {
  gainSubs.add(f);
  return () => {
    gainSubs.delete(f);
  };
}

export const store = {
  get: () => state,
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
  addXp(amount: number, reason: string) {
    const before = state.xp;
    set({ ...state, xp: before + amount });
    const g = { amount, reason, before, after: before + amount };
    gainSubs.forEach((f) => f(g));
  },
  today(): Day {
    return state.days[todayKey()] || {};
  },
  markOpened() {
    if (store.today().opened) return false;
    patchDay({ opened: true });
    store.addXp(5, 'Abriu o app hoje');
    return true;
  },
  checkin() {
    if (store.today().checkin) return false;
    const k = todayKey();
    set({ ...state, checkins: Array.from(new Set([...state.checkins, k])) });
    patchDay({ checkin: true });
    store.addXp(50, 'Presença do dia');
    return true;
  },
  vote(ids: string[]) {
    if (store.today().votes) return false;
    patchDay({ votes: ids });
    store.addXp(20, 'Escolheu os 3 jogos do dia');
    return true;
  },
  answerQuiz(answers: number[]) {
    patchDay({ quiz: answers });
  },
  addReflex(diff: number) {
    const cur = store.today().reflex || [];
    patchDay({ reflex: [...cur, diff] });
  },
  addDiary(e: Omit<DiaryEntry, 'id' | 'date'>) {
    const entry = { ...e, id: Math.random().toString(36).slice(2), date: todayKey() };
    set({ ...state, diary: [entry, ...state.diary].slice(0, 100) });
  },
  removeDiary(id: string) {
    set({ ...state, diary: state.diary.filter((d) => d.id !== id) });
  },
};

// sequência de dias seguidos com presença (conta hoje ou ontem como ponta)
export function streakOf(checkins: string[]) {
  const set = new Set(checkins);
  const d = new Date();
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function useStore() {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
