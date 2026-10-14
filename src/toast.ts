// Toast global simples: qualquer tela chama toast('mensagem') e o App mostra embaixo.
type T = { id: number; msg: string };
const subs = new Set<(t: T) => void>();
let n = 0;
export function toast(msg: string) {
  const t = { id: ++n, msg };
  subs.forEach((f) => f(t));
}
export function onToast(f: (t: T) => void) {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
}
