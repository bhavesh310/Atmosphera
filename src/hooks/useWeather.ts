import { useState, useCallback } from 'react';
import type { GeoLocation, WeatherData, AirQualityData } from '../types/weather';

interface UseWeatherReturn {
  weather: WeatherData | null;
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
  searchResults: GeoLocation[];
  searchLoading: boolean;
  searchCities: (query: string) => Promise<void>;
  selectLocation: (loc: GeoLocation) => Promise<void>;
}

async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData | undefined> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,european_aqi',
    });
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
    if (!res.ok) return undefined;
    const data = await res.json();
    const c = data.current;
    return {
      pm2_5: c.pm2_5 ?? 0,
      pm10: c.pm10 ?? 0,
      carbon_monoxide: c.carbon_monoxide ?? 0,
      nitrogen_dioxide: c.nitrogen_dioxide ?? 0,
      european_aqi: c.european_aqi ?? 0,
    };
  } catch {
    return undefined;
  }
}

export function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<GeoLocation[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchWeather = useCallback(async (lat: number, lon: number, tz: string = 'auto') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'temperature_2m,weathercode,windspeed_10m,relativehumidity_2m,apparent_temperature,precipitation,uv_index',
        hourly: 'temperature_2m,weathercode,precipitation_probability',
        daily: 'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
        timezone: tz,
        forecast_days: '7',
      });

      const [weatherRes, airQuality] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?${params}`),
        fetchAirQuality(lat, lon),
      ]);

      if (!weatherRes.ok) throw new Error('Weather fetch failed');
      const data = await weatherRes.json();

      setWeather({
        current: data.current,
        hourly: data.hourly,
        daily: data.daily,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude,
        airQuality,
      });
    } catch {
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCities = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const selectLocation = useCallback(async (loc: GeoLocation) => {
    setLocation(loc);
    setSearchResults([]);
    await fetchWeather(loc.latitude, loc.longitude, loc.timezone);
  }, [fetchWeather]);

  return { weather, location, loading, error, searchResults, searchLoading, searchCities, selectLocation };
}
