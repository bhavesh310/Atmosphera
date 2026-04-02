import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConditionLabel } from '../../types/weather';

interface HeroTempProps {
  temperature: number;
  weatherCode: number;
  accentColor: string;
  unit: 'C' | 'F';
  visible: boolean;
}


function AnimatedNumber({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(value);
  const displayedRef = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = displayedRef.current;
    const end = value;
    if (start === end) {
      setDisplayed(end);
      return;
    }
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const current = Math.round(start + (end - start) * eased);
      displayedRef.current = current;
      setDisplayed(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <>{displayed}</>;
}

export default function HeroTemp({ temperature, weatherCode, accentColor, unit, visible }: HeroTempProps) {
  const temp = unit === 'F' ? Math.round(temperature * 9 / 5 + 32) : Math.round(temperature);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative flex flex-col items-center justify-center select-none pointer-events-none"
        >
          {/* Glow behind number */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
              filter: 'blur(40px)',
              transform: 'scale(1.5)',
            }}
          />

          {/* Giant temperature */}
          <div
            className="font-display leading-none"
            style={{
              fontSize: 'clamp(120px, 22vw, 280px)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              textShadow: `0 0 80px ${accentColor}40, 0 0 160px ${accentColor}18`,
              fontWeight: 300,
              fontStyle: 'italic',
            }}
          >
            <AnimatedNumber value={temp} />
            <span
              className="font-display"
              style={{
                fontSize: 'clamp(40px, 6vw, 80px)',
                verticalAlign: 'super',
                color: accentColor,
                opacity: 0.8,
              }}
            >
              °{unit}
            </span>
          </div>

          {/* Condition label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono-custom text-sm tracking-[0.35em] mt-2"
            style={{ color: accentColor, opacity: 0.9 }}
          >
            {getConditionLabel(weatherCode)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
