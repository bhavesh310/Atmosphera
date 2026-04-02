import { motion } from 'framer-motion';

interface LoadingOverlayProps {
  accentColor: string;
}

export default function LoadingOverlay({ accentColor }: LoadingOverlayProps) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 pointer-events-none"
    >
      <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
        <motion.div
          className="absolute rounded-full"
          style={{ width: 60, height: 60, border: `2px solid rgba(160,140,110,0.2)`, borderTopColor: accentColor }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="rounded-full"
          style={{ width: 10, height: 10, background: accentColor }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <span className="font-mono-custom text-xs tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
        LOADING...
      </span>
    </motion.div>
  );
}
