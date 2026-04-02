interface UVGaugeProps {
  value: number;
  accentColor: string;
}

export default function UVGauge({ value, accentColor }: UVGaugeProps) {
  const max = 11;
  const clamped = Math.min(value, max);
  const angle = (clamped / max) * 180;
  
  // Arc from 180° to 0° (left to right, top semicircle)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const cx = 50;
  const cy = 50;
  const r = 38;

  const startAngle = toRad(180);
  const endAngle = toRad(180 - angle);
  
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  
  const largeArc = angle > 180 ? 1 : 0;

  const uvLabel = value <= 2 ? 'LOW' : value <= 5 ? 'MODERATE' : value <= 7 ? 'HIGH' : value <= 10 ? 'V.HIGH' : 'EXTREME';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono-custom text-xs tracking-widest opacity-40" style={{ color: 'var(--text-primary)' }}>UV INDEX</span>
      <div className="relative" style={{ width: 80, height: 48 }}>
        <svg viewBox="0 0 100 60" width="80" height="48">
          {/* Track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Fill */}
          {angle > 0 && (
            <path
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={accentColor}
              strokeWidth="5"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${accentColor}80)` }}
            />
          )}
          {/* Center value */}
          <text x={cx} y={cy + 6} textAnchor="middle" fill="var(--text-primary)"
            fontSize="14" fontFamily="DM Mono, monospace" fontWeight="400">
            {Math.round(value)}
          </text>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <span className="font-mono-custom text-xs tracking-wider" style={{ color: accentColor, fontSize: 9 }}>{uvLabel}</span>
        </div>
      </div>
    </div>
  );
}
