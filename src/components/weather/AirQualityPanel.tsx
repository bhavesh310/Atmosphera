import { motion } from 'framer-motion';
import { getAqiLabel } from '../../types/weather';
import type { AirQualityData } from '../../types/weather';

interface AirQualityPanelProps {
  airQuality: AirQualityData;
  accentColor: string;
}

export default function AirQualityPanel({ airQuality, accentColor }: AirQualityPanelProps) {
  const { label } = getAqiLabel(airQuality.european_aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.6 }}
      className="glass-panel p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="font-mono-custom text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Air Quality
        </span>
        <span className="font-mono-custom text-xs" style={{ color: 'var(--text-muted)' }}>·</span>
        <span className="font-mono-custom text-xs tracking-wider uppercase" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {label}
        </span>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { val: airQuality.pm2_5, label: 'PM2.5', unit: 'μg' },
          { val: airQuality.pm10, label: 'PM10', unit: 'μg' },
          { val: airQuality.nitrogen_dioxide, label: 'NO₂', unit: 'μg' },
          { val: airQuality.carbon_monoxide, label: 'CO', unit: 'μg' },
        ].map(({ val, label: l, unit: u }) => (
          <div key={l} className="flex flex-col items-center">
            <span className="font-mono-custom text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
              {val.toFixed(1)}
            </span>
            <span className="font-mono-custom text-xs mt-1" style={{ color: 'var(--text-muted)', fontSize: 10 }}>
              {l} {u}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
