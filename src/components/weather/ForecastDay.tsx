import { motion } from 'framer-motion';
import { getWeatherEmoji } from '../../types/weather';
import type { DailyWeather } from '../../types/weather';

interface ForecastDayProps {
  daily: DailyWeather;
  accentColor: string;
  unit: 'C' | 'F';
  timezone: string;
}

function convertTemp(c: number, unit: 'C' | 'F') {
  return unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

function getDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export default function ForecastDay({ daily, accentColor, unit }: ForecastDayProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="glass-panel p-5 flex flex-col gap-0"
    >
      <div className="font-mono-custom text-xs tracking-[0.2em] uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
        7-Day Forecast
      </div>

      {daily.time.map((date, i) => {
        const isToday = date === today || i === 0;
        const maxT = convertTemp(daily.temperature_2m_max[i], unit);
        const minT = convertTemp(daily.temperature_2m_min[i], unit);
        const code = daily.weathercode[i];

        return (
          <div
            key={date}
            className="flex items-center justify-between py-3"
            style={{
              borderBottom: i < daily.time.length - 1 ? '1px solid rgba(160,140,110,0.15)' : 'none',
            }}
          >
            <span
              className="font-mono-custom text-sm"
              style={{
                color: isToday ? 'var(--text-primary)' : 'var(--text-muted)',
                width: 100,
                fontWeight: isToday ? 500 : 400,
              }}
            >
              {getDayName(date, i)}
            </span>

            <span style={{ fontSize: 18, lineHeight: 1 }}>{getWeatherEmoji(code)}</span>

            <div className="flex gap-1 items-center font-mono-custom text-sm" style={{ width: 80, justifyContent: 'flex-end' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{maxT}°</span>
              <span style={{ color: 'var(--text-dim)' }}>/</span>
              <span style={{ color: 'var(--text-muted)' }}>{minT}°</span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
