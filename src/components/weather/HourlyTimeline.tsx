import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getWeatherEmoji } from '../../types/weather';
import type { HourlyWeather } from '../../types/weather';

interface HourlyTimelineProps {
  hourly: HourlyWeather;
  accentColor: string;
  unit: 'C' | 'F';
  timezone: string;
}

function convertTemp(c: number, unit: 'C' | 'F') {
  return unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

export default function HourlyTimeline({ hourly, accentColor, unit, timezone }: HourlyTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ITEM_W = 68;
  const HOURS_SHOWN = 24;

  const now = new Date();
  const currentHourIndex = useMemo(() => {
    const idx = hourly.time.findIndex(t => new Date(t) >= now);
    return idx >= 0 ? idx : 0;
  }, [hourly.time]);

  const hours = useMemo(() => {
    return hourly.time.slice(currentHourIndex, currentHourIndex + HOURS_SHOWN).map((t, i) => {
      const idx = currentHourIndex + i;
      return {
        time: t,
        temp: convertTemp(hourly.temperature_2m[idx], unit),
        code: hourly.weathercode[idx],
        precip: hourly.precipitation_probability[idx] ?? 0,
      };
    });
  }, [hourly, currentHourIndex, unit]);

  const svgPath = useMemo(() => {
    if (hours.length === 0) return '';
    const temps = hours.map(h => h.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const H = 36;
    const TOP_PAD = 4;

    const points = temps.map((t, i) => {
      const x = i * ITEM_W + ITEM_W / 2;
      const y = TOP_PAD + H - ((t - min) / range) * H;
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpx = (points[i].x + points[i + 1].x) / 2;
      d += ` C ${cpx} ${points[i].y} ${cpx} ${points[i + 1].y} ${points[i + 1].x} ${points[i + 1].y}`;
    }
    return { d, points, H: H + TOP_PAD };
  }, [hours]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
  }, [hours]);

  const formatHour = (time: string) => {
    const d = new Date(time);
    const h = d.getHours();
    return h === 0 ? '12AM' : h < 12 ? `${h}AM` : h === 12 ? '12PM' : `${h - 12}PM`;
  };

  const totalWidth = hours.length * ITEM_W;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="glass-panel overflow-hidden"
    >
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(160,140,110,0.15)' }}>
        <span className="font-mono-custom text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
          24-Hour Forecast
        </span>
      </div>

      <div ref={scrollRef} className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
        <div style={{ width: totalWidth, position: 'relative', padding: '8px 0 12px' }}>
          {/* Temperature curve */}
          {typeof svgPath === 'object' && svgPath.d && (
            <svg
              style={{
                position: 'absolute', top: 0, left: 0,
                width: totalWidth, height: svgPath.H + 8,
                pointerEvents: 'none', zIndex: 2,
              }}
            >
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2={totalWidth} y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                  <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path d={svgPath.d} fill="none" stroke="url(#curveGrad)" strokeWidth="2" strokeLinecap="round" />
              {svgPath.points.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill={accentColor} opacity="0.5" />
              ))}
            </svg>
          )}

          {/* Hour columns */}
          <div className="flex" style={{ paddingTop: typeof svgPath === 'object' ? svgPath.H + 8 : 40 }}>
            {hours.map((h, i) => {
              const isNow = i === 0;
              return (
                <div key={h.time} className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: ITEM_W }}>
                  <span
                    className="font-mono-custom text-xs"
                    style={{
                      color: isNow ? accentColor : 'var(--text-muted)',
                      fontSize: 10,
                      fontWeight: isNow ? 600 : 400,
                    }}
                  >
                    {isNow ? 'NOW' : formatHour(h.time)}
                  </span>
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{getWeatherEmoji(h.code)}</span>
                  <span className="font-mono-custom text-xs" style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 500 }}>
                    {h.temp}°
                  </span>
                  {h.precip > 0 && (
                    <span style={{ color: accentColor, fontSize: 9, fontFamily: 'var(--font-mono)' }}>
                      {h.precip}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
