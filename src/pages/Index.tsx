import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { getWeatherCondition, getAccentColor, getConditionLabel } from '../types/weather';
import WeatherCanvas from '../components/weather/WeatherCanvas';
import SearchBar from '../components/weather/SearchBar';
import StatsPanel from '../components/weather/StatsPanel';
import ForecastDay from '../components/weather/ForecastDay';
import HourlyTimeline from '../components/weather/HourlyTimeline';
import AirQualityPanel from '../components/weather/AirQualityPanel';
import SplashScreen from '../components/weather/SplashScreen';
import LoadingOverlay from '../components/weather/LoadingOverlay';

type Unit = 'C' | 'F';

function useLocalTime(timezone: string | undefined) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [dayName, setDayName] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const tz = timezone || undefined;
      try {
        setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, ...(tz ? { timeZone: tz } : {}) }));
        setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(tz ? { timeZone: tz } : {}) }));
        setDayName(now.toLocaleDateString('en-US', { weekday: 'long', ...(tz ? { timeZone: tz } : {}) }).toUpperCase());
      } catch {
        setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
        setDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        setDayName(now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase());
      }
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return { time, date, dayName };
}

function convertTemp(c: number, unit: 'C' | 'F') {
  return unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

export default function Index() {
  const { weather, location, loading, error, searchResults, searchLoading, searchCities, selectLocation } = useWeather();
  const [unit, setUnit] = useState<Unit>('C');
  const [splashDone, setSplashDone] = useState(false);
  const [weatherKey, setWeatherKey] = useState(0);
  const prevLocId = useRef<number | null>(null);

  const condition = weather ? getWeatherCondition(weather.current.weathercode) : 'clear';
  const accentColor = getAccentColor(condition);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    if (!location) return;
    if (prevLocId.current !== null && prevLocId.current !== location.id) {
      setWeatherKey(k => k + 1);
    }
    prevLocId.current = location.id;
  }, [location]);

  useEffect(() => {
    const t = setTimeout(() => selectLocation({
      id: 2643743, name: 'London', latitude: 51.5085, longitude: -0.1257,
      country: 'United Kingdom', country_code: 'GB', timezone: 'Europe/London', admin1: 'England',
    }), 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { time, date, dayName } = useLocalTime(weather?.timezone);
  const showDashboard = splashDone && weather && !loading;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: 'var(--bg)' }}>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

      {/* Decorative blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full" style={{ background: 'rgba(160,130,90,0.15)' }} />
        <div className="absolute top-10 -right-10 w-48 h-48 rounded-full" style={{ background: 'rgba(160,130,90,0.1)' }} />
        <div className="absolute bottom-20 right-40 w-32 h-32 rounded-full" style={{ background: 'rgba(140,120,90,0.08)' }} />
      </div>

      {/* TOP BAR */}
      {splashDone && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-3"
        >
          {/* Search */}
          <div className="flex-1" style={{ maxWidth: 320 }}>
            <SearchBar
              onSelect={selectLocation} onSearch={searchCities}
              results={searchResults} loading={searchLoading}
              locationName={location?.name} accentColor={accentColor}
            />
          </div>

          {/* Unit toggle + time */}
          <div className="flex items-center gap-4 min-w-fit">
            <div
              className="flex items-center gap-1 font-mono-custom text-xs tracking-widest rounded-full px-3 py-1.5"
              style={{ background: 'rgba(200,185,165,0.5)', border: '1px solid rgba(180,160,130,0.3)' }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setUnit('C')}
                style={{ color: unit === 'C' ? accentColor : 'var(--text-dim)', cursor: 'pointer', fontWeight: unit === 'C' ? 600 : 400 }}
              >°C</motion.button>
              <span style={{ color: 'var(--text-dim)' }} className="mx-0.5">/</span>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => setUnit('F')}
                style={{ color: unit === 'F' ? accentColor : 'var(--text-dim)', cursor: 'pointer', fontWeight: unit === 'F' ? 600 : 400 }}
              >°F</motion.button>
            </div>
            <div className="text-right hidden md:block">
              <div className="font-mono-custom text-xs tracking-widest" style={{ color: 'var(--text-primary)' }}>{time}</div>
              <div className="font-mono-custom text-xs tracking-wider opacity-50 mt-0.5" style={{ color: 'var(--text-muted)' }}>{date}</div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Loading overlay */}
      {loading && splashDone && <LoadingOverlay accentColor={accentColor} />}

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-40 glass-panel px-5 py-3 flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#dc2626' }} />
            <span className="font-mono-custom text-xs tracking-wider" style={{ color: '#dc2626' }}>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DASHBOARD */}
      {showDashboard && (
        <motion.div
          key={weatherKey}
          className="fixed inset-0 z-20 overflow-y-auto pt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-8 py-4 min-h-full">
            {/* LEFT COLUMN — Location, Hero Temp, Quick Stats */}
            <motion.div
              className="flex-1 flex flex-col justify-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Location header */}
              <div className="mb-2">
                <span className="font-mono-custom text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--text-muted)' }}>
                  {location?.name}{location?.admin1 ? `, ${location.admin1}` : ''} · {dayName}
                </span>
              </div>

              {/* Giant temperature */}
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="font-display leading-none"
                  style={{
                    fontSize: 'clamp(80px, 14vw, 160px)',
                    color: 'var(--text-primary)',
                    fontWeight: 300,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {convertTemp(weather.current.temperature_2m, unit)}
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 'clamp(28px, 4vw, 48px)',
                    color: 'var(--text-muted)',
                    fontWeight: 300,
                  }}
                >
                  °{unit}
                </span>
              </div>

              {/* Condition */}
              <div
                className="font-display text-xl md:text-2xl mb-6"
                style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 400 }}
              >
                {getConditionLabel(weather.current.weathercode).charAt(0) + getConditionLabel(weather.current.weathercode).slice(1).toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
              </div>

              {/* Quick stat pills */}
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  { label: 'Feels', val: `${convertTemp(weather.current.apparent_temperature, unit)}°` },
                  { label: 'Humidity', val: `${weather.current.relativehumidity_2m}%` },
                  { label: 'Wind', val: `${Math.round(weather.current.windspeed_10m)} km/h` },
                  { label: 'Rain', val: `${weather.current.precipitation.toFixed(1)} mm` },
                ].map(({ label, val }) => (
                  <div key={label} className="stat-pill">
                    <span className="font-mono-custom text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span className="font-mono-custom text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{val}</span>
                  </div>
                ))}
              </motion.div>

              {/* UV + Sunrise row — desktop */}
              <motion.div
                className="hidden lg:flex gap-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-pill flex-col !items-start !gap-1 !rounded-2xl !px-4 !py-3">
                  <span className="font-mono-custom text-xs" style={{ color: 'var(--text-muted)' }}>UV Index</span>
                  <span className="font-mono-custom text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                    {Math.round(weather.current.uv_index)}
                    <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>
                      {weather.current.uv_index <= 2 ? 'Low' : weather.current.uv_index <= 5 ? 'Moderate' : weather.current.uv_index <= 7 ? 'High' : 'Very High'}
                    </span>
                  </span>
                </div>
                {weather.daily.sunrise[0] && weather.daily.sunset[0] && (
                  <div className="stat-pill flex-col !items-start !gap-1 !rounded-2xl !px-4 !py-3">
                    <span className="font-mono-custom text-xs" style={{ color: 'var(--text-muted)' }}>Sunrise / Sunset</span>
                    <span className="font-mono-custom text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      {' / '}
                      {new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* RIGHT COLUMN — Forecast + Air Quality */}
            <motion.div
              className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <ForecastDay daily={weather.daily} accentColor={accentColor} unit={unit} timezone={weather.timezone} />
              {weather.airQuality && (
                <AirQualityPanel airQuality={weather.airQuality} accentColor={accentColor} />
              )}
            </motion.div>
          </div>

          {/* HOURLY TIMELINE */}
          <motion.div
            className="px-4 md:px-8 pb-4"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <HourlyTimeline hourly={weather.hourly} accentColor={accentColor} unit={unit} timezone={weather.timezone} />
          </motion.div>
        </motion.div>
      )}

      {/* Empty state */}
      {splashDone && !weather && !loading && (
        <motion.div
          className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ fontSize: 80, color: accentColor, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
          >
            ⊙
          </motion.div>
          <p className="font-mono-custom text-sm tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
            SEARCH A CITY TO BEGIN
          </p>
        </motion.div>
      )}
    </div>
  );
}
