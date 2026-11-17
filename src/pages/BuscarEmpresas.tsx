import React, { useState, useMemo, useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import { mockApi } from '../services/mockApi';
import { Company } from '../types';
import { useToast } from '../context/ToastContext';
import { PageId } from '../components/layout/Sidebar';
import { Combobox } from '../components/common/Combobox';
import { useLocais } from '../hooks/useLocais';
import { RadarScanningView } from '../components/search/RadarScanningView';
import { SearchSummaryCard } from '../components/search/SearchSummaryCard';
import { SearchResultsTable } from '../components/search/SearchResultsTable';

import nichesData from '../data/niches.json';

interface BuscarEmpresasProps {
  onNavigate?: (page: PageId) => void;
}

export const BuscarEmpresas: React.FC<BuscarEmpresasProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [niche, setNiche] = useState('');
  const [keywords, setKeywords] = useState('');
  const [quantity, setQuantity] = useState(50);

  // Search flow mode: 'form' | 'searching' | 'completed'
  const [searchMode, setSearchMode] = useState<'form' | 'searching' | 'completed'>('form');
  const [searchStartTime, setSearchStartTime] = useState<Date>(new Date());

  // Dynamic location cascading
  const [localizacao, setLocalizacao] = useState({
    country: 'BR',
    state: 'RJ',
    stateName: 'Rio de Janeiro',
    city: '',
    neighborhood: '',
  });

  const updateLocalizacao = (partial: Partial<typeof localizacao>) => {
    setLocalizacao((prev) => ({ ...prev, ...partial }));
  };

  // Live /api/locais cascading hook with 0ms instant cache
  const paises = useLocais({ nivel: 'paises' });
  const estados = useLocais(
    localizacao.country ? { nivel: 'estados', pais: localizacao.country } : null
  );

  const semEstados = !!localizacao.country && !estados.carregando && !estados.itens.length;

  const cidades = useLocais(
    localizacao.country && (localizacao.state || semEstados)
      ? { nivel: 'cidades', pais: localizacao.country, estado: localizacao.state }
      : null
  );

  const bairros = useLocais(
    localizacao.city
      ? {
          nivel: 'bairros',
          pais: localizacao.country,
          estado: localizacao.state,
          cidade: localizacao.city,
        }
      : null
  );

  const bairrosOptions = useMemo(() => {
    return [
      {
        itens: [
          { code: '', name: 'Cidade inteira (todos os bairros)' },
          ...bairros.itens,
        ],
      },
    ];
  }, [bairros.itens]);

  // Form filter pills with mutually exclusive logic
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [results, setResults] = useState<Company[]>([]);
  const [displayedResults, setDisplayedResults] = useState<Company[]>([]);

  // Niches formatted into 16 groups
  const nicheGroups = useMemo(() => {
    return nichesData.map((g) => ({
      grupo: g.grupo,
      itens: g.itens.map((n) => ({ code: n, name: n })),
    }));
  }, []);

  const filterPills = [
    { v: 'with_phone', l: 'Com telefone' },
    { v: 'with_whatsapp', l: 'Com link de WhatsApp' },
    { v: 'with_website', l: 'Com website informado' },
    { v: 'no_website', l: 'Sem website informado' },
    { v: 'saved', l: 'Já cadastradas' },
    { v: 'not_contacted', l: 'Ainda não contatadas' },
  ];

  const exclusivePairs: Record<string, string> = {
    with_website: 'no_website',
    no_website: 'with_website',
  };

  const toggleFilter = (filterKey: string) => {
    setActiveFilters((prev) => {
      if (prev.includes(filterKey)) {
        return prev.filter((k) => k !== filterKey);
      }
      const opposite = exclusivePairs[filterKey];
      const cleaned = opposite ? prev.filter((k) => k !== opposite) : prev;
      return [...cleaned, filterKey];
    });
  };

  // Trigger search: switches to 'searching' radar animation first
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!niche.trim()) {
      showToast('Escolha o nicho ou digite a palavra-chave.', 'error');
      return;
    }
    if (!localizacao.city) {
      showToast('Escolha a cidade.', 'error');
      return;
    }

    setSearchStartTime(new Date());
    setSearchMode('searching');
    setDisplayedResults([]);

    try {
      // Initiate search in mock API
      const companiesPromise = mockApi.searchCompanies(
        niche,
        localizacao.stateName || localizacao.state,
        localizacao.city,
        localizacao.neighborhood || '',
        quantity,
        {
          hasPhone: activeFilters.includes('with_phone'),
          hasWhatsapp: activeFilters.includes('with_whatsapp'),
          hasWebsite: activeFilters.includes('with_website'),
          noWebsite: activeFilters.includes('no_website'),
          alreadyRegistered: activeFilters.includes('saved'),
          notContactedYet: activeFilters.includes('not_contacted'),
        }
      );

      const allCompanies = await companiesPromise;
      setResults(allCompanies);

      // Animate companies arriving one by one on the radar map
      const chunkSize = Math.max(1, Math.floor(allCompanies.length / 4));
      let currentIdx = 0;

      const interval = setInterval(() => {
        currentIdx += chunkSize;
        if (currentIdx >= allCompanies.length) {
          setDisplayedResults(allCompanies);
          clearInterval(interval);
          // Transition to completed summary view after animation
          setTimeout(() => {
            setSearchMode('completed');
            showToast(`${allCompanies.length} empresas encontradas no Google Maps!`, 'success');
          }, 1200);
        } else {
          setDisplayedResults(allCompanies.slice(0, currentIdx));
        }
      }, 700);

    } catch (err) {
      showToast('Erro ao realizar a busca de empresas.', 'error');
      setSearchMode('form');
    }
  };

  const ultimasBuscas = [
    { title: 'Lanchonetes · São Paulo, São Paulo', details: 'há 18 horas · Google Maps · 5 de 5 pedidas', n: 'Lanchonetes', s: 'SP', sn: 'São Paulo', c: 'São Paulo' },
    { title: 'Pizzarias · São Paulo, São Paulo', details: 'há 3 dias · Google Maps · 49 de 50 pedidas', n: 'Pizzarias', s: 'SP', sn: 'São Paulo', c: 'São Paulo' },
    { title: 'desentupidora · Recife, Pernambuco', details: 'há 3 dias · Google Maps · 44 de 50 pedidas', n: 'desentupidora', s: 'PE', sn: 'Pernambuco', c: 'Recife' },
    { title: 'Clínicas odontológicas · Montes Claros, Minas Gerais', details: 'há 7 dias · Google Maps · 5 de 5 pedidas', n: 'Clínicas odontológicas', s: 'MG', sn: 'Minas Gerais', c: 'Montes Claros' },
    { title: 'Clínicas odontológicas · Uberlândia, Minas Gerais', details: 'há 7 dias · Google Maps · 50 de 50 pedidas', n: 'Clínicas odontológicas', s: 'MG', sn: 'Minas Gerais', c: 'Uberlândia' },
    { title: 'Clínicas odontológicas · São Paulo, São Paulo', details: 'há 8 dias · Google Maps · 50 de 50 pedidas', n: 'Clínicas odontológicas', s: 'SP', sn: 'São Paulo', c: 'São Paulo' },
    { title: 'caça vazamento · São Paulo, São Paulo', details: 'há 24 dias · Google Maps · 48 de 50 pedidas', n: 'caça vazamento', s: 'SP', sn: 'São Paulo', c: 'São Paulo' },
    { title: 'Comida árabe · Arraial do Cabo, Rio de Janeiro', details: 'há 24 dias · Google Maps · 20 de 50 pedidas', n: 'Comida árabe', s: 'RJ', sn: 'Rio de Janeiro', c: 'Arraial do Cabo' },
  ];

  const cidadePlaceholder = !localizacao.state && !semEstados
    ? 'Escolha o estado primeiro'
    : 'Escolha a cidade';

  return (
    <div className="relative space-y-6 animate-fade-in">
      {/* Top subtle red glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(250,38,0,0.14),transparent_70%)] z-0"></div>

      {/* =========================================================================
          MODE 1 & 2: SEARCHING & RESULTS (100% Matching Live Original Video)
          Summary Card is always at the top; 3D Map while searching; Table when complete
          ========================================================================= */}
      {(searchMode === 'searching' || searchMode === 'completed') && (
        <div className="space-y-6">
          {/* Summary Card (Always at the top) */}
          <SearchSummaryCard
            niche={niche}
            city={localizacao.city}
            state={localizacao.stateName || localizacao.state}
            targetQuantity={quantity}
            companies={searchMode === 'completed' ? results : displayedResults}
            startedAt={searchStartTime}
            status={searchMode === 'completed' ? 'completed' : 'running'}
            onBackToSearch={() => setSearchMode('form')}
            onCancelSearch={() => {
              setSearchMode('completed');
              showToast('Busca cancelada. Resultados já coletados disponíveis.', 'info');
            }}
          />

          {/* While Searching: 3D Vector Rotating Map View */}
          {searchMode === 'searching' && (
            <RadarScanningView
              niche={niche}
              city={localizacao.city}
              state={localizacao.stateName || localizacao.state}
              targetQuantity={quantity}
              foundCompanies={displayedResults}
              onViewListNow={() => {
                setDisplayedResults(results);
                setSearchMode('completed');
              }}
            />
          )}

          {/* When Completed: Full Leads Table */}
          {searchMode === 'completed' && (
            <SearchResultsTable
              companies={results}
              niche={niche}
              onNavigate={onNavigate}
            />
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 3: SEARCH FORM (Initial Screen)
          ========================================================================= */}
      {searchMode === 'form' && (
        <>
          {/* Cabeçalho */}
          <div className="relative z-10 pt-2">
            <p className="text-[11px] font-bold text-[#fa2600] tracking-[0.25em] uppercase">
              PROSPECÇÃO
            </p>
            <h1 className="text-3xl sm:text-[34px] font-bold text-white tracking-tight leading-tight mt-1">
              Buscar empresas
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 max-w-3xl leading-relaxed">
              Encontre estabelecimentos reais por nicho e localização. Cada resultado mostra a fonte e a data da
              coleta — nada é inventado: o que a fonte não informa aparece como "não informado".
            </p>
          </div>

          {/* Card Principal do Formulário */}
          <form
            onSubmit={handleSearch}
            className="relative z-30 bg-[#0e1014] border border-[#1e222b] rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5"
          >
            {/* Linha 1: Nicho, País, Estado, Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nicho ou palavra-chave (Combobox Livre) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Nicho ou palavra-chave
                </label>
                <Combobox
                  id="niche"
                  livre={true}
                  value={niche}
                  onChange={(code) => setNiche(code)}
                  grupos={nicheGroups}
                  placeholder="Clique para escolher o nicho"
                  vazio="Não está na lista: digite e use como palavra-chave."
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Escolha na lista ou digite (ex.: loja de paletó)
                </p>
              </div>

              {/* País */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  País
                </label>
                <Combobox
                  id="country"
                  value={localizacao.country}
                  onChange={(code) =>
                    updateLocalizacao({
                      country: code,
                      state: '',
                      stateName: '',
                      city: '',
                      neighborhood: '',
                    })
                  }
                  grupos={[{ itens: paises.itens }]}
                  carregando={paises.carregando}
                  placeholder="País"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Estado
                </label>
                <Combobox
                  id="state"
                  value={localizacao.state}
                  rotulo={localizacao.stateName}
                  onChange={(code, name) =>
                    updateLocalizacao({
                      state: code,
                      stateName: name,
                      city: '',
                      neighborhood: '',
                    })
                  }
                  grupos={[{ itens: estados.itens }]}
                  carregando={estados.carregando}
                  disabled={semEstados}
                  placeholder={semEstados ? 'Sem estados' : 'Escolha o estado'}
                />
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Cidade
                </label>
                <Combobox
                  id="city"
                  livre={true}
                  value={localizacao.city}
                  onChange={(code) =>
                    updateLocalizacao({
                      city: code,
                      neighborhood: '',
                    })
                  }
                  grupos={[{ itens: cidades.itens }]}
                  carregando={cidades.carregando}
                  disabled={!localizacao.state && !semEstados}
                  placeholder={cidadePlaceholder}
                  vazio="Cidade não encontrada na lista: pressione Enter para usar o que digitou."
                />
              </div>
            </div>

            {/* Linha 2: Bairro, Palavras-chave, Quantidade e Fonte */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              {/* Bairro */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Bairro
                </label>
                <Combobox
                  id="neighborhood"
                  livre={true}
                  value={localizacao.neighborhood}
                  onChange={(code) => updateLocalizacao({ neighborhood: code })}
                  grupos={bairrosOptions}
                  carregando={bairros.carregando}
                  disabled={!localizacao.city}
                  placeholder="Cidade inteira (todos os bairros)"
                  vazio="Bairro não encontrado na lista: pressione Enter para usar o que digitou."
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  {!localizacao.city
                    ? 'Escolha a cidade primeiro'
                    : bairros.carregando
                    ? 'Carregando os bairros da cidade…'
                    : bairros.itens.length
                    ? `${bairros.itens.length} bairros na lista`
                    : 'Sem lista de bairros para esta cidade: a busca cobre a cidade inteira'}
                </p>
              </div>

              {/* Palavras-chave (opcional) */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Palavras-chave (opcional)
                </label>
                <input
                  type="text"
                  id="keywords"
                  maxLength={120}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Ex.: banho e tosa"
                  className="w-full h-11 px-3.5 bg-[#161922] border border-[#282e3b] rounded-xl text-sm text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Refinam o nicho. Ex.: 24 horas, banho e tosa
                </p>
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantity"
                  min={1}
                  max={700}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-11 px-3.5 bg-[#161922] border border-[#282e3b] rounded-xl text-sm text-white focus:border-[#fa2600] focus:outline-none font-medium"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Limite desejado; máximo do plano: 700
                </p>
              </div>

              {/* Fonte: Google Maps */}
              <div className="pt-7 text-xs text-gray-400">
                Fonte: <span className="font-semibold text-white">Google Maps</span>
              </div>
            </div>

            {/* Linha 3: Filtros em Pills e Botão Buscar Empresas */}
            <div className="pt-2 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-5">
              <div className="space-y-2.5">
                <span className="block text-xs text-gray-400 font-medium">
                  Mostrar nos resultados só empresas...
                </span>

                <div className="flex flex-wrap gap-2">
                  {filterPills.map((pill) => {
                    const active = activeFilters.includes(pill.v);
                    return (
                      <button
                        type="button"
                        key={pill.v}
                        onClick={() => toggleFilter(pill.v)}
                        className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer font-medium ${
                          active
                            ? 'bg-[#fa2600]/15 border border-[#fa2600] text-[#fa2600]'
                            : 'bg-[#13151b] border border-[#232733] text-gray-400 hover:text-gray-200 hover:border-[#383e50]'
                        }`}
                      >
                        {pill.l}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão Buscar Empresas */}
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#fa2600] to-[#ff5500] hover:from-[#e02200] hover:to-[#ea4e00] text-white font-bold text-xs tracking-wider uppercase shadow-[0_4px_24px_rgba(250,38,0,0.5)] transition-all flex items-center justify-center gap-2 shrink-0 self-end lg:self-auto cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>BUSCAR EMPRESAS</span>
              </button>
            </div>
          </form>

          {/* Banner Informativo Oficial */}
          <div className="relative z-10 bg-[#0e1014] border border-[#1e222b] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              As empresas vêm do <strong className="font-bold text-white">Google Maps</strong>, coletadas área
              por área da cidade ou do bairro. A quantidade é um limite desejado, não uma garantia: vem o que existe
              na região. Quando o perfil não informa um site, isso <em className="italic text-gray-300">não</em>{' '}
              prova que a empresa não tenha um. Para listas próprias, use{' '}
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('meus-leads')}
                className="text-[#fa2600] hover:underline font-medium cursor-pointer"
              >
                importar CSV
              </button>
              .
            </p>
          </div>

          {/* Painel Últimas Buscas */}
          <div className="relative z-10 bg-[#0e1014] border border-[#1e222b] rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#181a20]">
              <h3 className="text-sm font-bold text-white">Últimas buscas</h3>
              <button
                onClick={() => onNavigate && onNavigate('historico')}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                Histórico completo
              </button>
            </div>

            <div className="divide-y divide-[#181a20]">
              {ultimasBuscas.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setNiche(item.n);
                    updateLocalizacao({
                      country: 'BR',
                      state: item.s,
                      stateName: item.sn,
                      city: item.c,
                      neighborhood: '',
                    });
                    showToast(`Carregando parâmetros de: ${item.title}`, 'info');
                  }}
                  className="py-3.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-[#12141a]/60 px-2 rounded-lg -mx-2 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.details}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#062c17] border border-[#14532d] text-[#34d399] text-[10px] font-semibold">
                      Concluída
                    </span>
                    <span className="text-gray-600 group-hover:text-gray-300 transition-colors text-xs">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
