import { motion } from 'framer-motion';

export type Pose =
  | 'apontando' | 'rindo' | 'pensativo' | 'surpreso' | 'joinha'
  | 'bravo' | 'desconfiado' | 'triste' | 'comemorando' | 'rosto';

export default function Papito({
  size = 72,
  pose = 'apontando',
  breathe = true,
  ring = true,
}: {
  size?: number;
  pose?: Pose;
  breathe?: boolean;
  ring?: boolean;
}) {
  const bw = Math.max(2, Math.round(size / 40));
  return (
    <motion.div
      aria-hidden={false}
      role="img"
      aria-label={`Papito ${pose}`}
      initial={false}
      animate={breathe ? { y: [0, -2, 0], scale: [1, 1.02, 1] } : {}}
      transition={breathe ? { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        flex: 'none',
        background: 'var(--card)',
        border: ring ? `${bw}px solid var(--amber)` : 'none',
        boxShadow: '0 6px 16px rgba(0,0,0,.25)',
      }}
    >
      <motion.img
        key={pose}
        src={`/papito/${pose}.jpg`}
        alt=""
        initial={{ opacity: 0.4, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </motion.div>
  );
}
