import React, { useEffect, useState, useMemo } from 'react';
import { MapPin, List, Info } from 'lucide-react';
import { Company } from '../../types';
import { MapLibre3DView, MapPonto } from './MapLibre3DView';
import { getCityArea } from '../../utils/geo';

interface RadarScanningViewProps {
  niche: string;
  city: string;
  state: string;
  targetQuantity: number;
  foundCompanies: Company[];
  onViewListNow: () => void;
}

export const RadarScanningView: React.FC<RadarScanningViewProps> = ({
  niche,
  city,
  state,
  targetQuantity,
  foundCompanies,
  onViewListNow,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [stage, setStage] = useState<'iniciando' | 'localizando' | 'consultando' | 'organizando' | 'preparando'>('localizando');
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Check reduced motion & WebGL
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', handler);

    try {
      const canvas = document.createElement('canvas');
      const hasWebGL = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
      setMapMode(hasWebGL ? '3d' : '2d');
    } catch {
      setMapMode('2d');
    }

    return () => mq.removeEventListener('change', handler);
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stage progression matching live system
  useEffect(() => {
    if (seconds < 2) {
      setStage('localizando');
    } else if (seconds < 5) {
      setStage('consultando');
    } else if (seconds < 10) {
      setStage('organizando');
    } else {
      setStage('preparando');
    }
  }, [seconds]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const stageText = {
    iniciando: 'Iniciando busca...',
    localizando: 'Localizando a região...',
    consultando: 'Consultando estabelecimentos...',
    organizando: 'Organizando resultados...',
    preparando: 'Preparando sua lista de empresas...',
  }[stage];

  // Geocoded area for the selected city
  const area = useMemo(() => getCityArea(city || 'Alexandria', state || 'RN'), [city, state]);

  // Generate coordinates for found companies centered around the city
  const mapPontos: MapPonto[] = useMemo(() => {
    return foundCompanies.map((c, idx) => {
      const angle = (idx * 137.5 * Math.PI) / 180; // Golden ratio spiral
      const radius = 0.004 + (idx * 0.0015);
      const lat = area.center.lat + Math.sin(angle) * radius;
      const lon = area.center.lon + Math.cos(angle) * radius * 1.2;
      return {
        id: c.id,
        nome: c.name,
        lat,
        lon,
      };
    });
  }, [foundCompanies, area]);

  // Last 3 found businesses to display live under status (matching video at 00:23)
  const recentDiscovered = useMemo(() => {
    return [...foundCompanies].slice(-3).reverse();
  }, [foundCompanies]);

  return (
    <section
      aria-label="Buscando empresas no mapa"
      aria-live="polite"
      className="relative mb-6 h-[440px] sm:h-[520px] overflow-hidden rounded-[20px] border border-[#232833] bg-[#060607] shadow-2xl animate-fade-in select-none"
    >
      {/* 1. MAP BACKGROUND: Real 3D Vector MapLibre with fallback to 2D Grid */}
      {mapMode === '3d' ? (
        <MapLibre3DView
          area={area}
          pontos={mapPontos}
          ativo={true}
          reduzido={prefersReduced}
          onFalha={() => setMapMode('2d')}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="fl-malha-wrap">
            <div className={`fl-malha ${prefersReduced ? '' : 'fl-malha-anda'}`}>
              {mapPontos.map((p, idx) => {
                const seed = (idx + 1) * 37;
                const left = 20 + ((seed * 13) % 60);
                const top = 25 + ((seed * 19) % 50);
                return (
                  <span
                    key={p.id}
                    className="fl-marcador-2d"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <span
                      className="fl-marcador"
                      style={{ animationDelay: `${70 * Math.min(idx, 12)}ms` }}
                    >
                      <span className="fl-marcador-halo" />
                      <span className="fl-marcador-ponto" />
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Central Scanning Radar Orb */}
          <div className="absolute top-[56%] left-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className={`fl-orbe ${prefersReduced ? 'fl-orbe-parado' : ''}`}>
              <div className="fl-orbe-pulso" />
              <div className="fl-orbe-pulso fl-orbe-pulso2" />
              <div className="fl-orbe-anel" />
              <div className="fl-orbe-anel fl-orbe-anel2" />
              <div className="fl-orbe-nucleo" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Radial and gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_55%,transparent_50%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />

      {/* 3. Top Header Bar */}
      <div className="absolute left-4 top-4 right-4 flex items-start justify-between gap-3 sm:left-5 sm:right-5 sm:top-5 z-20">
        <div className="min-w-0">
          {/* Location breadcrumb */}
          <p className="flex items-center gap-1.5 text-xs text-[#929292]">
            <MapPin className="w-3.5 h-3.5 text-[#ff7f5f]" />
            <span className="truncate">{city} · {state}</span>
          </p>

          {/* Blinking live status */}
          <p className="mt-1.5 flex items-center gap-2 font-display text-base sm:text-xl text-white tracking-tight">
            <span className="fl-ponto-vivo" aria-hidden="true" />
            <span className="fx-in">{stageText}</span>
          </p>

          {/* Elapsed Time */}
          <p className="mt-1 text-xs tabular-nums text-[#929292]">
            Tempo decorrido {formatTimer(seconds)}
          </p>
        </div>

        {/* Top-right Counter Card */}
        <div className="rounded-xl border border-[#232833] bg-black/60 px-5 py-2.5 text-right backdrop-blur shadow-xl">
          <div className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums tracking-tight">
            {foundCompanies.length}
          </div>
          <div className="text-[11px] text-[#929292] font-medium">
            {foundCompanies.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
          </div>
        </div>
      </div>

      {/* 4. Bottom-Left Stacked Discovered Badges (Exact replica of video at 00:15-00:30) */}
      {recentDiscovered.length > 0 && (
        <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-20 flex flex-col gap-2 max-w-[280px] sm:max-w-xs pointer-events-none">
          {recentDiscovered.map((item, idx) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[#0b0c10]/90 border border-white/10 backdrop-blur shadow-2xl animate-fade-in"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#ff4d01] shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{item.address || `${city} - ${state}`}</p>
                </div>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff4d01] animate-ping shrink-0" />
            </div>
          ))}
        </div>
      )}

      {/* 5. Bottom Action Bar */}
      <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={onViewListNow}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#282e3b] bg-black/70 px-4 text-xs font-semibold text-gray-200 backdrop-blur transition-all hover:border-[#fa2600] hover:text-white cursor-pointer shadow-lg"
        >
          <List className="w-3.5 h-3.5 text-gray-400" />
          <span>Ver lista enquanto busca</span>
        </button>

        <div className="w-8 h-8 rounded-full border border-[#232833] bg-black/60 flex items-center justify-center text-gray-500">
          <Info className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
};
