import { useState } from 'react';

// Perfil do jogador guardado só no aparelho dele (localStorage).
// No app real, isso vem junto do login vinculado à casa (SSO) — sem senha passar pelo Papito.
export type Profile = { nome: string; fem: boolean };

const KEY = 'papito_profile';

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* modo privado / storage bloqueado: segue sem salvar */
  }
}

// Primeiro nome, pra saudação ("E aí, Carlos!")
export function firstName(nome: string) {
  return (nome || '').trim().split(/\s+/)[0] || '';
}

export function useProfile(): [Profile | null, (p: Profile) => void] {
  const [p, setP] = useState<Profile | null>(() => getProfile());
  const set = (np: Profile) => {
    saveProfile(np);
    setP(np);
  };
  return [p, set];
}
