import { useRef, useEffect } from 'react';
import { useParticles } from '../../hooks/useParticles';
import type { WeatherCondition } from '../../types/weather';

interface WeatherCanvasProps {
  condition: WeatherCondition;
  accentColor: string;
}

export default function WeatherCanvas({ condition, accentColor }: WeatherCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef, condition, accentColor);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
