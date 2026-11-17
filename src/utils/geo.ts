// Geocoding helper for Brazilian cities and states to feed 3D MapLibre view
import { AreaLocation } from '../components/search/MapLibre3DView';

// State center coordinates
export const STATE_COORDINATES: Record<string, { lat: number; lon: number; bbox: [number, number, number, number] }> = {
  AC: { lat: -9.9753, lon: -67.8249, bbox: [-10.15, -68.10, -9.80, -67.60] },
  AL: { lat: -9.6658, lon: -35.7350, bbox: [-9.80, -35.90, -9.50, -35.60] },
  AP: { lat: 0.0356, lon: -51.0705, bbox: [-0.10, -51.20, 0.20, -50.90] },
  AM: { lat: -3.1190, lon: -60.0217, bbox: [-3.25, -60.20, -3.00, -59.85] },
  BA: { lat: -12.9714, lon: -38.5014, bbox: [-13.10, -38.65, -12.85, -38.35] },
  CE: { lat: -3.7319, lon: -38.5267, bbox: [-3.85, -38.65, -3.60, -38.40] },
  DF: { lat: -15.7975, lon: -47.8919, bbox: [-15.95, -48.10, -15.65, -47.70] },
  ES: { lat: -20.3155, lon: -40.3128, bbox: [-20.45, -40.45, -20.15, -40.15] },
  GO: { lat: -16.6869, lon: -49.2648, bbox: [-16.85, -49.40, -16.50, -49.10] },
  MA: { lat: -2.5307, lon: -44.3068, bbox: [-2.65, -44.45, -2.40, -44.15] },
  MT: { lat: -15.6010, lon: -56.0974, bbox: [-15.75, -56.25, -15.45, -55.95] },
  MS: { lat: -20.4697, lon: -54.6201, bbox: [-20.60, -54.75, -20.30, -54.45] },
  MG: { lat: -19.9167, lon: -43.9345, bbox: [-20.05, -44.10, -19.75, -43.80] },
  PA: { lat: -1.4558, lon: -48.4902, bbox: [-1.60, -48.65, -1.30, -48.35] },
  PB: { lat: -7.1195, lon: -34.8450, bbox: [-7.25, -35.00, -7.00, -34.70] },
  PR: { lat: -25.4284, lon: -49.2733, bbox: [-25.55, -49.40, -25.30, -49.15] },
  PE: { lat: -8.0476, lon: -34.8770, bbox: [-8.18, -35.02, -7.92, -34.75] },
  PI: { lat: -5.0920, lon: -42.8038, bbox: [-5.20, -42.95, -4.95, -42.65] },
  RJ: { lat: -22.9068, lon: -43.1729, bbox: [-23.05, -43.40, -22.75, -43.00] },
  RN: { lat: -5.7945, lon: -35.2110, bbox: [-5.92, -35.35, -5.68, -35.10] },
  RS: { lat: -30.0346, lon: -51.2177, bbox: [-30.15, -51.35, -29.90, -51.05] },
  RO: { lat: -8.7619, lon: -63.9039, bbox: [-8.90, -64.05, -8.60, -63.75] },
  RR: { lat: 2.8235, lon: -60.6758, bbox: [2.70, -60.80, 2.95, -60.55] },
  SC: { lat: -27.5954, lon: -48.5480, bbox: [-27.75, -48.70, -27.45, -48.40] },
  SP: { lat: -23.5505, lon: -46.6333, bbox: [-23.70, -46.80, -23.40, -46.45] },
  SE: { lat: -10.9472, lon: -37.0731, bbox: [-11.05, -37.20, -10.85, -36.95] },
  TO: { lat: -10.1844, lon: -48.3336, bbox: [-10.35, -48.50, -10.05, -48.20] },
};

// Known city coordinates cache
const KNOWN_CITIES: Record<string, { lat: number; lon: number; bbox: [number, number, number, number] }> = {
  acrelandia: { lat: -9.8258, lon: -66.8833, bbox: [-9.86, -66.95, -9.78, -66.82] },
  alexandria: { lat: -6.4172, lon: -38.0161, bbox: [-6.45, -38.05, -6.38, -37.98] },
  'rio de janeiro': { lat: -22.9068, lon: -43.1729, bbox: [-23.05, -43.40, -22.75, -43.00] },
  'sao paulo': { lat: -23.5505, lon: -46.6333, bbox: [-23.70, -46.80, -23.40, -46.45] },
  recife: { lat: -8.0476, lon: -34.8770, bbox: [-8.18, -35.02, -7.92, -34.75] },
  curitiba: { lat: -25.4284, lon: -49.2733, bbox: [-25.55, -49.40, -25.30, -49.15] },
  'belo horizonte': { lat: -19.9167, lon: -43.9345, bbox: [-20.05, -44.10, -19.75, -43.80] },
  salvador: { lat: -12.9714, lon: -38.5014, bbox: [-13.10, -38.65, -12.85, -38.35] },
  fortaleza: { lat: -3.7319, lon: -38.5267, bbox: [-3.85, -38.65, -3.60, -38.40] },
  brasilia: { lat: -15.7975, lon: -47.8919, bbox: [-15.95, -48.10, -15.65, -47.70] },
};

const normalize = (str: string) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export function getCityArea(city: string, state: string): AreaLocation {
  const normCity = normalize(city);
  if (KNOWN_CITIES[normCity]) {
    return {
      bbox: KNOWN_CITIES[normCity].bbox,
      center: { lat: KNOWN_CITIES[normCity].lat, lon: KNOWN_CITIES[normCity].lon },
    };
  }

  const st = STATE_COORDINATES[state.toUpperCase()] || STATE_COORDINATES['RJ'];

  // Generate a deterministic pseudo-random offset based on city name characters
  let hash = 0;
  for (let i = 0; i < normCity.length; i++) {
    hash = (hash << 5) - hash + normCity.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.4;
  const lonOffset = (((Math.abs(hash) >> 4) % 100) / 100 - 0.5) * 0.4;

  const lat = st.lat + latOffset;
  const lon = st.lon + lonOffset;

  return {
    bbox: [lat - 0.05, lon - 0.06, lat + 0.05, lon + 0.06],
    center: { lat, lon },
  };
}

