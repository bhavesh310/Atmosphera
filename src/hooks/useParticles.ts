import { useEffect, useRef, useCallback } from 'react';
import type { WeatherCondition } from '../types/weather';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  phase: number;
}

export function useParticles(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  condition: WeatherCondition,
  accentColor: string
) {
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const lightningRef = useRef<{ active: boolean; opacity: number; nextFlash: number }>({
    active: false,
    opacity: 0,
    nextFlash: Date.now() + 4000 + Math.random() * 4000,
  });
  const conditionRef = useRef(condition);
  const accentRef = useRef(accentColor);

  useEffect(() => {
    conditionRef.current = condition;
    accentRef.current = accentColor;
    // Reset particles on condition change
    particlesRef.current = [];
  }, [condition, accentColor]);

  const hexToRgb = useCallback((hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }, []);

  const initParticle = useCallback((canvas: HTMLCanvasElement, cond: WeatherCondition): Particle => {
    const w = canvas.width;
    const h = canvas.height;

    switch (cond) {
      case 'rain':
      case 'thunderstorm':
        return {
          x: Math.random() * (w + 200) - 100,
          y: Math.random() * h * -1,
          vx: -2.5,
          vy: 18 + Math.random() * 8,
          size: 1 + Math.random() * 1.5,
          opacity: 0.3 + Math.random() * 0.5,
          life: 0,
          maxLife: 100,
          phase: 0,
        };
      case 'snow':
        return {
          x: Math.random() * w,
          y: Math.random() * h * -0.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 0.5 + Math.random() * 1.5,
          size: 1 + Math.random() * 3,
          opacity: 0.4 + Math.random() * 0.5,
          life: 0,
          maxLife: 200 + Math.random() * 100,
          phase: Math.random() * Math.PI * 2,
        };
      case 'clear':
        return {
          x: w * 0.85 + (Math.random() - 0.5) * 50,
          y: h * 0.1 + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.2 + Math.random() * 0.3,
          size: 80 + Math.random() * 120,
          opacity: 0.02 + Math.random() * 0.04,
          life: 0,
          maxLife: 300 + Math.random() * 200,
          phase: Math.random() * Math.PI * 2,
        };
      case 'cloudy':
        return {
          x: -200,
          y: Math.random() * h * 0.6,
          vx: 0.3 + Math.random() * 0.5,
          vy: (Math.random() - 0.5) * 0.1,
          size: 80 + Math.random() * 160,
          opacity: 0.03 + Math.random() * 0.05,
          life: 0,
          maxLife: 600 + Math.random() * 400,
          phase: 0,
        };
      case 'fog':
        return {
          x: -300,
          y: Math.random() * h,
          vx: 0.4 + Math.random() * 0.6,
          vy: (Math.random() - 0.5) * 0.1,
          size: 3 + Math.random() * 2,
          opacity: 0.03 + Math.random() * 0.05,
          life: 0,
          maxLife: 500,
          phase: 0,
        };
      default:
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: 2,
          opacity: 0.1,
          life: 0,
          maxLife: 100,
          phase: 0,
        };
    }
  }, []);

  const getParticleCount = useCallback((cond: WeatherCondition) => {
    switch (cond) {
      case 'rain': return 150;
      case 'thunderstorm': return 200;
      case 'snow': return 80;
      case 'clear': return 8;
      case 'cloudy': return 6;
      case 'fog': return 20;
      default: return 20;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const animate = () => {
      const cond = conditionRef.current;
      const accent = accentRef.current;
      const { r, g, b } = hexToRgb(accent.startsWith('#') ? accent : '#f59e0b');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animated gradient mesh background
      const gradient = ctx.createRadialGradient(
        canvas.width * (0.2 + Math.sin(time * 0.0005) * 0.1),
        canvas.height * (0.5 + Math.cos(time * 0.0003) * 0.1),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, `rgba(${r},${g},${b},0.04)`);
      gradient.addColorStop(0.5, `rgba(8,12,18,0)`);
      gradient.addColorStop(1, `rgba(8,12,18,0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Maintain particle count
      const target = getParticleCount(cond);
      while (particlesRef.current.length < target) {
        particlesRef.current.push(initParticle(canvas, cond));
      }
      if (particlesRef.current.length > target + 20) {
        particlesRef.current = particlesRef.current.slice(0, target);
      }

      // Draw & update particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.life++;
        const lifeRatio = p.life / p.maxLife;

        if (cond === 'rain' || cond === 'thunderstorm') {
          p.x += p.vx;
          p.y += p.vy;
          // Fade in/out
          const alpha = lifeRatio < 0.1 ? lifeRatio * 10 * p.opacity : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 * p.opacity : p.opacity;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 3);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.stroke();
          return p.y < canvas.height + 50;
        }

        if (cond === 'snow') {
          p.phase += 0.02;
          p.x += Math.sin(p.phase) * 0.5 + p.vx;
          p.y += p.vy;
          const alpha = lifeRatio < 0.1 ? lifeRatio * 10 * p.opacity : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 * p.opacity : p.opacity;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224,242,254,${alpha})`;
          ctx.fill();
          return p.y < canvas.height + 20;
        }

        if (cond === 'clear') {
          // Rotating light ray
          p.phase += 0.002;
          p.opacity = 0.015 + Math.sin(time * 0.001 + p.phase) * 0.01;
          const x = canvas.width * 0.85;
          const y = canvas.height * 0.05;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(p.phase);
          const rayGrad = ctx.createLinearGradient(0, 0, p.size, 0);
          rayGrad.addColorStop(0, `rgba(${r},${g},${b},${p.opacity * 3})`);
          rayGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(0, -2);
          ctx.lineTo(p.size, -8);
          ctx.lineTo(p.size, 8);
          ctx.lineTo(0, 2);
          ctx.fill();
          ctx.restore();
          return p.life < p.maxLife;
        }

        if (cond === 'cloudy') {
          p.x += p.vx;
          p.y += p.vy;
          const alpha = lifeRatio < 0.1 ? lifeRatio * 10 * p.opacity : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 * p.opacity : p.opacity;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, `rgba(148,163,184,${alpha})`);
          grad.addColorStop(1, `rgba(148,163,184,0)`);
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          return p.x < canvas.width + 300;
        }

        if (cond === 'fog') {
          p.x += p.vx;
          const alpha = lifeRatio < 0.1 ? lifeRatio * 10 * p.opacity : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 * p.opacity : p.opacity;
          ctx.fillStyle = `rgba(156,163,175,${alpha})`;
          ctx.fillRect(p.x, p.y, canvas.width * 0.4, p.size * 20);
          return p.x < canvas.width + 400;
        }

        return false;
      });

      // Lightning flash for thunderstorm
      if (cond === 'thunderstorm') {
        const ln = lightningRef.current;
        const now = Date.now();
        if (!ln.active && now >= ln.nextFlash) {
          ln.active = true;
          ln.opacity = 0.15;
          ln.nextFlash = now + 4000 + Math.random() * 6000;
        }
        if (ln.active) {
          ln.opacity *= 0.88;
          ctx.fillStyle = `rgba(200,180,255,${ln.opacity})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (ln.opacity < 0.005) ln.active = false;
        }
      }

      time++;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef, hexToRgb, initParticle, getParticleCount]);
}
