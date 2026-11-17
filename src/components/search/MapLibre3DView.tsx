import React, { useEffect, useRef } from 'react';
import { Map as MapLibreMap, Marker, setWorkerUrl, GeoJSONSource, StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface AreaLocation {
  bbox: [number, number, number, number]; // [minLat, minLon, maxLat, maxLon]
  center: { lat: number; lon: number };
}

export interface MapPonto {
  id: string;
  nome: string;
  lat: number;
  lon: number;
}

interface MapLibre3DViewProps {
  area: AreaLocation;
  pontos: MapPonto[];
  ativo: boolean;
  reduzido?: boolean;
  onFalha?: () => void;
}

// Point worker to public vendor copy
try {
  setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
} catch (e) {
  // Ignored if already set
}

const ofmStyle: StyleSpecification = {
  version: 8,
  sources: {
    ofm: {
      type: 'vector',
      tiles: ['https://tiles.openfreemap.org/planet/latest/{z}/{x}/{y}.pbf'],
      minzoom: 0,
      maxzoom: 14,
    },
  },
  layers: [
    {
      id: 'fundo',
      type: 'background',
      paint: { 'background-color': '#070708' },
    },
    {
      id: 'residencial',
      type: 'fill',
      source: 'ofm',
      'source-layer': 'landuse',
      filter: ['in', ['get', 'class'], ['literal', ['residential', 'commercial', 'industrial']]],
      paint: { 'fill-color': '#0c0c0e' },
    },
    {
      id: 'verde',
      type: 'fill',
      source: 'ofm',
      'source-layer': 'park',
      paint: { 'fill-color': '#0b120e', 'fill-opacity': 0.8 },
    },
    {
      id: 'mata',
      type: 'fill',
      source: 'ofm',
      'source-layer': 'landcover',
      filter: ['in', ['get', 'class'], ['literal', ['wood', 'grass']]],
      paint: { 'fill-color': '#0a110c', 'fill-opacity': 0.6 },
    },
    {
      id: 'agua',
      type: 'fill',
      source: 'ofm',
      'source-layer': 'water',
      paint: { 'fill-color': '#0a0f15' },
    },
    {
      id: 'ruas-menores',
      type: 'line',
      source: 'ofm',
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'track']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': '#232429',
        'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 12, 0.4, 16, 5],
      },
    },
    {
      id: 'ruas-principais',
      type: 'line',
      source: 'ofm',
      'source-layer': 'transportation',
      filter: ['in', ['get', 'class'], ['literal', ['primary', 'secondary', 'tertiary', 'trunk', 'motorway']]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': '#35363d',
        'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 10, 0.8, 16, 9],
      },
    },
    {
      id: 'predios',
      type: 'fill-extrusion',
      source: 'ofm',
      'source-layer': 'building',
      minzoom: 12,
      paint: {
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['coalesce', ['get', 'render_height'], 6],
          0, '#1e1f23',
          30, '#28292f',
          90, '#35373e',
        ],
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          12, 0,
          14.2, ['coalesce', ['get', 'render_height'], 6],
        ],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 0.95,
        'fill-extrusion-vertical-gradient': true,
      },
    },
    {
      id: 'rastro',
      type: 'line',
      source: 'rastro',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-width': 3.5,
        'line-color': '#ff4d01',
        'line-opacity': 0.85,
        'line-blur': 1.5,
      },
    },
  ],
};

const emptyGeoJSON = {
  type: 'FeatureCollection' as const,
  features: [],
};

export const MapLibre3DView: React.FC<MapLibre3DViewProps> = ({
  area,
  pontos,
  ativo,
  reduzido = false,
  onFalha,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const isLoadedRef = useRef(false);
  const ativoRef = useRef(ativo);
  const reduzidoRef = useRef(reduzido);
  const pontosRef = useRef(pontos);

  ativoRef.current = ativo;
  reduzidoRef.current = reduzido;
  pontosRef.current = pontos;

  // Add markers dynamically as companies arrive
  const updateMarkers = () => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    pontosRef.current
      .filter((p) => p.lat != null && p.lon != null && !markersRef.current.has(p.id))
      .forEach((p, idx) => {
        const el = document.createElement('div');
        el.title = p.nome;
        const delay = 70 * Math.min(idx, 12);
        el.innerHTML = `<div class="fl-marcador" style="animation-delay:${delay}ms"><span class="fl-marcador-halo"></span><span class="fl-marcador-ponto"></span></div>`;
        const marker = new Marker({ element: el, anchor: 'center' })
          .setLngLat([p.lon, p.lat])
          .addTo(map);
        markersRef.current.set(p.id, marker);
      });
  };

  useEffect(updateMarkers, [pontos]);

  useEffect(() => {
    if (!area || !containerRef.current) return;

    let destroyed = false;
    let animFrame = 0;
    let orbMarker: Marker | null = null;

    const [minLat, minLon, maxLat, maxLon] = area.bbox;
    const centerLngLat: [number, number] = [area.center.lon, area.center.lat];

    let map: MapLibreMap;
    try {
      setWorkerUrl('/vendor/maplibre/maplibre-gl-worker.mjs');
      map = new MapLibreMap({
        container: containerRef.current,
        style: {
          ...ofmStyle,
          sources: {
            ...ofmStyle.sources,
            rastro: {
              type: 'geojson',
              data: emptyGeoJSON,
              lineMetrics: true,
            },
          },
        },
        center: centerLngLat,
        zoom: 14.0,
        pitch: 58,
        bearing: -18,
        interactive: false,
        attributionControl: { compact: true },
        fadeDuration: 0,
        pixelRatio: Math.min(window.devicePixelRatio || 1, 1.75),
        maxTileCacheSize: 120,
        canvasContextAttributes: { antialias: true, powerPreference: 'high-performance' },
      });
    } catch (err) {
      console.warn('MapLibre init error:', err);
      if (onFalha) onFalha();
      return;
    }

    mapRef.current = map;

    let hasStarted = false;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;

    const startScanning = () => {
      if (hasStarted || destroyed) return;
      hasStarted = true;
      isLoadedRef.current = true;

      // Calculate camera for bounds
      try {
        const camera = map.cameraForBounds(
          [
            [minLon, minLat],
            [maxLon, maxLat],
          ],
          { padding: 40 }
        );
        const targetZoom = Math.min(15.2, Math.max(13.6, (camera?.zoom ?? 13.8) + 1.0));

        if (reduzidoRef.current) {
          map.jumpTo({ center: centerLngLat, zoom: targetZoom, pitch: 58, bearing: -18 });
        } else {
          map.easeTo({
            center: centerLngLat,
            zoom: targetZoom,
            pitch: 58,
            bearing: -18,
            duration: 1200,
            easing: (t: number) => 1 - Math.pow(1 - t, 3),
          });
        }
      } catch (e) {
        // Fallback jump if bounds calculation throws
        map.jumpTo({ center: centerLngLat, zoom: 14.2, pitch: 58, bearing: -18 });
      }

      // Initial markers
      updateMarkers();

      // Scanning Orb Marker
      try {
        const orbEl = document.createElement('div');
        orbEl.className = 'fl-orbe';
        orbEl.innerHTML =
          '<span class="fl-orbe-pulso"></span><span class="fl-orbe-pulso fl-orbe-pulso2"></span><span class="fl-orbe-anel"></span><span class="fl-orbe-anel fl-orbe-anel2"></span><span class="fl-orbe-nucleo"></span>';

        orbMarker = new Marker({
          element: orbEl,
          anchor: 'center',
          pitchAlignment: 'viewport',
        })
          .setLngLat(centerLngLat)
          .addTo(map);

        if (reduzidoRef.current) {
          orbEl.classList.add('fl-orbe-parado');
        }
      } catch (e) {
        console.warn('Orb marker create warning:', e);
      }

      // Smooth continuous 3D rotation and scanning orbital loop
      const trailCoords: [number, number][] = [];
      let cycle = 0;
      let prevTime = performance.now();
      let accumulator = 0;

      const animate = (time: number) => {
        if (destroyed) return;
        animFrame = requestAnimationFrame(animate);
        const dt = Math.min(0.1, (time - prevTime) / 1000);
        prevTime = time;

        accumulator += dt;
        if (accumulator < 1 / 30 || document.hidden) return;

        const delta = accumulator;
        accumulator = 0;

        if (reduzidoRef.current) return;

        cycle += 1.05 * delta;

        // Rotate the 3D city continuously around its vertical axis!
        try {
          const currentBearing = map.getBearing();
          map.setBearing(currentBearing + 6.5 * delta);
        } catch (e) {
          // Ignore
        }

        // Orbital scanning trajectory of the glowing orb
        const canvas = map.getCanvas();
        if (canvas) {
          const width = canvas.clientWidth;
          const height = canvas.clientHeight;
          if (width > 0 && height > 0) {
            const radius = 0.28 + 0.08 * Math.sin(0.38 * cycle);
            const screenX = width / 2 + Math.cos(cycle) * width * radius * 0.9;
            const screenY = 0.55 * height + Math.sin(cycle) * height * radius * 0.55;

            try {
              const lngLat = map.unproject([screenX, screenY]);
              if (lngLat && !isNaN(lngLat.lng) && !isNaN(lngLat.lat)) {
                if (orbMarker) {
                  orbMarker.setLngLat(lngLat);
                }

                trailCoords.push([lngLat.lng, lngLat.lat]);
                if (trailCoords.length > 26) trailCoords.shift();
                if (trailCoords.length > 2) {
                  const src = map.getSource('rastro') as GeoJSONSource | undefined;
                  src?.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: trailCoords,
                    },
                  });
                }
              }
            } catch (e) {
              // Ignore edge unproject errors
            }
          }
        }
      };

      animFrame = requestAnimationFrame(animate);
    };

    map.on('error', (e) => {
      console.warn('MapLibre event:', e);
    });

    map.once('load', startScanning);
    map.once('styledata', startScanning);
    if (map.isStyleLoaded()) {
      startScanning();
    }
    safetyTimer = setTimeout(startScanning, 250);

    return () => {
      destroyed = true;
      if (safetyTimer) clearTimeout(safetyTimer);
      cancelAnimationFrame(animFrame);
      orbMarker?.remove();
      markersRef.current.forEach((m: Marker) => m.remove());
      markersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
      isLoadedRef.current = false;
    };
  }, [area.bbox.join(',')]);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};
