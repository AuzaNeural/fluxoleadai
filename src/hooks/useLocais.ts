import { useState, useEffect } from 'react';
import countriesData from '../data/countries.json';
import statesData from '../data/states.json';
import brazilCitiesDataRaw from '../data/brazilCities.json';
import bairrosCacheRaw from '../data/bairrosCache.json';

const brazilCitiesData = brazilCitiesDataRaw as Record<string, { code: string; name: string }[]>;
const bairrosCache = bairrosCacheRaw as Record<string, { code: string; name: string }[]>;

export interface LocalItem {
  code: string;
  name: string;
}

interface UseLocaisParams {
  nivel: 'paises' | 'estados' | 'cidades' | 'bairros';
  pais?: string;
  estado?: string;
  cidade?: string;
}

// Global in-memory cache to prevent redundant fetches and make navigation 0ms instant
const memoryCache = new Map<string, LocalItem[]>();

export function useLocais(params: UseLocaisParams | null) {
  const query = params
    ? new URLSearchParams(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '') as [string, string][]
      ).toString()
    : '';

  // Check pre-loaded instant caches
  let instantData: LocalItem[] | null = null;
  if (params) {
    if (params.nivel === 'paises') {
      instantData = countriesData.map((c) => ({ code: c.code, name: c.name }));
    } else if (params.nivel === 'estados' && params.pais === 'BR') {
      instantData = statesData.map((st) => ({ code: st.uf, name: st.nome }));
    } else if (params.nivel === 'cidades' && params.pais === 'BR' && params.estado) {
      if (brazilCitiesData[params.estado]) {
        instantData = brazilCitiesData[params.estado];
      }
    } else if (params.nivel === 'bairros' && params.cidade) {
      const cacheKey = `${params.pais || 'BR'}:${params.estado || ''}:${params.cidade}`;
      if (bairrosCache[cacheKey]) {
        instantData = bairrosCache[cacheKey];
      }
    }
  }

  const cachedResult = memoryCache.get(query);
  const initialItens = cachedResult || instantData || [];

  const [state, setState] = useState<{ chave: string; itens: LocalItem[] }>({
    chave: query,
    itens: initialItens,
  });
  const [carregando, setCarregando] = useState(!initialItens.length && !!query);

  useEffect(() => {
    if (!query || !params) {
      setState({ chave: '', itens: [] });
      setCarregando(false);
      return;
    }

    // If already in instant data or memory cache, use immediately with 0ms delay
    const foundCache = memoryCache.get(query) || instantData;
    if (foundCache && foundCache.length > 0) {
      setState({ chave: query, itens: foundCache });
      setCarregando(false);
      return;
    }

    setCarregando(true);
    const controller = new AbortController();

    fetch(`/api/locais?${query}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        const items: LocalItem[] = data.items || [];
        memoryCache.set(query, items);
        setState({ chave: query, itens: items });
        setCarregando(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        
        // Fallback local se a API remota demorar ou estiver offline
        let fallbackItems: LocalItem[] = [];
        if (params.nivel === 'paises') {
          fallbackItems = countriesData.map((c) => ({ code: c.code, name: c.name }));
        } else if (params.nivel === 'estados' && params.pais === 'BR') {
          fallbackItems = statesData.map((st) => ({ code: st.uf, name: st.nome }));
        } else if (params.nivel === 'cidades' && params.pais === 'BR' && params.estado) {
          fallbackItems = brazilCitiesData[params.estado] || [];
        } else if (params.nivel === 'bairros') {
          const cacheKey = `${params.pais || 'BR'}:${params.estado || ''}:${params.cidade || ''}`;
          fallbackItems = bairrosCache[cacheKey] || [
            { code: 'Centro', name: 'Centro' },
            { code: 'Bairro Principal', name: 'Bairro Principal' },
            { code: 'Zona Sul', name: 'Zona Sul' },
            { code: 'Zona Norte', name: 'Zona Norte' },
          ];
        }

        memoryCache.set(query, fallbackItems);
        setState({ chave: query, itens: fallbackItems });
        setCarregando(false);
      });

    return () => controller.abort();
  }, [query, params?.cidade, params?.estado, params?.pais]);

  return {
    itens: state.chave === query ? state.itens : initialItens,
    carregando: !!query && (carregando && !(initialItens.length > 0)),
  };
}
