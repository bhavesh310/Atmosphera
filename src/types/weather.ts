export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog';

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  timezone: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  weathercode: number;
  windspeed_10m: number;
  relativehumidity_2m: number;
  precipitation: number;
  uv_index: number;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  weathercode: number[];
  precipitation_probability: number[];
}

export interface DailyWeather {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface AirQualityData {
  pm2_5: number;
  pm10: number;
  carbon_monoxide: number;
  nitrogen_dioxide: number;
  european_aqi: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
  latitude: number;
  longitude: number;
  airQuality?: AirQualityData;
}

export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'cloudy';
}

export function getAccentColor(condition: WeatherCondition): string {
  const map: Record<WeatherCondition, string> = {
    clear: '#b8860b',
    cloudy: '#8a7560',
    rain: '#5a8a9a',
    snow: '#8a8a8a',
    thunderstorm: '#7a6080',
    fog: '#8a8070',
  };
  return map[condition];
}

export function getConditionLabel(code: number): string {
  if (code === 0) return 'CLEAR SKY';
  if (code === 1) return 'MAINLY CLEAR';
  if (code === 2) return 'PARTLY CLOUDY';
  if (code === 3) return 'OVERCAST SKIES';
  if (code >= 45 && code <= 48) return 'FOGGY';
  if (code >= 51 && code <= 55) return 'DRIZZLE';
  if (code >= 56 && code <= 57) return 'FREEZING DRIZZLE';
  if (code >= 61 && code <= 63) return 'RAIN';
  if (code === 65) return 'HEAVY RAIN';
  if (code >= 66 && code <= 67) return 'FREEZING RAIN';
  if (code >= 71 && code <= 73) return 'SNOW';
  if (code === 75) return 'HEAVY SNOW';
  if (code === 77) return 'SNOW GRAINS';
  if (code >= 80 && code <= 82) return 'RAIN SHOWERS';
  if (code >= 85 && code <= 86) return 'SNOW SHOWERS';
  if (code === 95) return 'THUNDERSTORM';
  if (code >= 96 && code <= 99) return 'THUNDERSTORM W/ HAIL';
  return 'UNKNOWN';
}

export function getWeatherEmoji(code: number): string {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 85 && code <= 86) return '🌨️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '🌡️';
}

export function getAqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 20) return { label: 'GOOD', color: '#4d9a5e' };
  if (aqi <= 40) return { label: 'FAIR', color: '#7a9a40' };
  if (aqi <= 60) return { label: 'MODERATE', color: '#b8860b' };
  if (aqi <= 80) return { label: 'POOR', color: '#c47030' };
  if (aqi <= 100) return { label: 'VERY POOR', color: '#c04040' };
  return { label: 'HAZARDOUS', color: '#8030a0' };
}
