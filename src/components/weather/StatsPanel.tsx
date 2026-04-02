import { motion } from 'framer-motion';
import UVGauge from './UVGauge';
import type { CurrentWeather, DailyWeather } from '../../types/weather';

interface StatsPanelProps {
  current: CurrentWeather;
  daily: DailyWeather;
  accentColor: string;
  unit: 'C' | 'F';
}

function convertTemp(c: number, unit: 'C' | 'F') {
  return unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

function WindArrow({ degrees, color }: { degrees: number; color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24"
      style={{ transform: `rotate(${degrees}deg)`, transition: 'transform 1s ease', filter: `drop-shadow(0 0 4px ${color}60)` }}>
      <path d="M12 2L8 10H11V22H13V10H16L12 2Z" fill={color} opacity="0.9"/>
    </svg>
  );
}

function SunriseArc({ sunrise, sunset, accentColor }: { sunrise: string; sunset: string; accentColor: string }) {
  const toMin = (time: string) => {
    const d = new Date(time);
    return d.getHours() * 60 + d.getMinutes();
  };
  const srMin = toMin(sunrise);
  const ssMin = toMin(sunset);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const progress = Math.max(0, Math.min(1, (nowMin - srMin) / (ssMin - srMin)));

  const cx = 60; const cy = 48; const r = 36;
  const startRad = Math.PI;
  const endRad = 0;
  const progRad = startRad + (endRad - startRad) * progress;
  const sunX = cx + r * Math.cos(progRad);
  const sunY = cy + r * Math.sin(progRad);

  const fmt = (time: string) => {
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono-custom text-xs tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>SUN</span>
      <svg viewBox="0 0 120 56" width="100" height="48">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2"/>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(progRad - Math.PI)} ${cy + r * Math.sin(progRad - Math.PI)}`}
          fill="none" stroke={accentColor} strokeWidth="2" opacity="0.4"/>
        <circle cx={sunX} cy={sunY} r="4" fill={accentColor}
          style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}/>
        <line x1={cx - r - 2} y1={cy} x2={cx - r - 2} y2={cy - 8} stroke={accentColor} strokeWidth="1.5" opacity="0.5"/>
        <line x1={cx + r + 2} y1={cy} x2={cx + r + 2} y2={cy - 8} stroke={accentColor} strokeWidth="1.5" opacity="0.5"/>
      </svg>
      <div className="flex justify-between w-full px-1">
        <span className="font-mono-custom text-xs opacity-50" style={{ color: 'var(--text-primary)', fontSize: 9 }}>↑ {fmt(sunrise)}</span>
        <span className="font-mono-custom text-xs opacity-50" style={{ color: 'var(--text-primary)', fontSize: 9 }}>↓ {fmt(sunset)}</span>
      </div>
    </div>
  );
}

export default function StatsPanel({ current, daily, accentColor, unit }: StatsPanelProps) {
  const feelsLike = convertTemp(current.apparent_temperature, unit);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="glass-panel rounded-2xl p-4 flex flex-col gap-4"
      style={{ width: 200, minWidth: 180 }}
    >
      {/* Feels like */}
      <div>
        <div className="font-mono-custom text-xs tracking-widest opacity-40 mb-1" style={{ color: 'var(--text-primary)' }}>FEELS LIKE</div>
        <div className="font-display text-4xl" style={{ color: accentColor, fontWeight: 300, fontStyle: 'italic' }}>
          {feelsLike}°{unit}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-glass)' }} />

      {/* Humidity */}
      <div>
        <div className="font-mono-custom text-xs tracking-widest opacity-40 mb-2" style={{ color: 'var(--text-primary)' }}>HUMIDITY</div>
        <div className="flex items-end gap-3">
          <div className="font-mono-custom text-2xl" style={{ color: 'var(--text-primary)' }}>
            {current.relativehumidity_2m}%
          </div>
          {/* Drip bar */}
          <div className="flex gap-px items-end" style={{ height: 28 }}>
            {Array.from({ length: 8 }).map((_, i) => {
              const filled = (i / 7) * 100 < current.relativehumidity_2m;
              return (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4 + i * 3,
                    background: filled ? accentColor : 'rgba(255,255,255,0.08)',
                    borderRadius: 2,
                    transition: 'background 0.5s',
                    opacity: filled ? 0.7 + i * 0.04 : 1,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-glass)' }} />

      {/* Wind */}
      <div>
        <div className="font-mono-custom text-xs tracking-widest opacity-40 mb-2" style={{ color: 'var(--text-primary)' }}>WIND</div>
        <div className="flex items-center gap-3">
          <WindArrow degrees={225} color={accentColor} />
          <div>
            <div className="font-mono-custom text-xl" style={{ color: 'var(--text-primary)' }}>
              {Math.round(current.windspeed_10m)}
            </div>
            <div className="font-mono-custom text-xs opacity-40" style={{ color: 'var(--text-primary)' }}>KM/H</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-glass)' }} />

      {/* UV Index */}
      <UVGauge value={current.uv_index} accentColor={accentColor} />

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-glass)' }} />

      {/* Precipitation */}
      <div>
        <div className="font-mono-custom text-xs tracking-widest opacity-40 mb-1" style={{ color: 'var(--text-primary)' }}>PRECIP</div>
        <div className="font-mono-custom text-xl" style={{ color: 'var(--text-primary)' }}>
          {current.precipitation.toFixed(1)}<span className="text-xs opacity-40 ml-1">mm</span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-glass)' }} />

      {/* Sunrise/Sunset */}
      {daily.sunrise[0] && daily.sunset[0] && (
        <SunriseArc sunrise={daily.sunrise[0]} sunset={daily.sunset[0]} accentColor={accentColor} />
      )}
    </motion.div>
  );
}
