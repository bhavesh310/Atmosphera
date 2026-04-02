import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LETTERS = 'ATMOSPHERA'.split('');

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(1);
  const [mounted, setMounted] = useState(true);
  const [dots, setDots] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const accentColor = '#9c7a50';
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const t1 = setTimeout(() => setShowStatus(true), 700);
    const t2 = setTimeout(() => setOpacity(0), 1600);
    const t3 = setTimeout(() => {
      setMounted(false);
      onCompleteRef.current();
    }, 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showStatus) return;
    let count = 0;
    const id = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, 280);
    return () => clearInterval(id);
  }, [showStatus]);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#e8ddd0',
        opacity,
        transition: 'opacity 0.5s ease',
        pointerEvents: opacity < 0.5 ? 'none' : 'auto',
      }}
    >
      {/* Pulsing orb */}
      <motion.div
        className="relative flex items-center justify-center mb-8"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        style={{ width: 140, height: 140 }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border"
            style={{ width: 36 + i * 34, height: 36 + i * 34, borderColor: `${accentColor}40` }}
            animate={{ opacity: [0, 0.4, 0], scale: [0.85, 1.3, 1.6] }}
            transition={{ duration: 2, delay: i * 0.35, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 52, height: 52,
            background: `radial-gradient(circle, ${accentColor} 0%, ${accentColor}40 55%, transparent 100%)`,
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>

      {/* Title */}
      <div className="flex gap-0.5 mb-3">
        {LETTERS.map((l, i) => (
          <motion.span
            key={i}
            className="font-mono-custom font-medium"
            style={{ fontSize: 26, letterSpacing: '0.22em', color: accentColor }}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.1 + i * 0.055, duration: 0.4 }}
          >
            {l}
          </motion.span>
        ))}
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="font-mono-custom text-xs tracking-[0.22em] mb-8"
        style={{ color: 'var(--text-muted)' }}
      >
        PRECISION WEATHER · CINEMATIC EXPERIENCE
      </motion.div>

      {/* Status */}
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <motion.div
            className="rounded-full"
            style={{ width: 5, height: 5, background: accentColor }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
          <span className="font-mono-custom text-xs tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
            FETCHING ATMOSPHERE{dots}
          </span>
        </motion.div>
      )}
    </div>
  );
}
