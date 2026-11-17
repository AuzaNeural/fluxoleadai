import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCw,
  Download,
  MapPin,
  Info,
  Globe,
  MessageCircle,
  Star,
  Check
} from 'lucide-react';
import { Company } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useLeads } from '../../context/LeadContext';
import { PageId } from '../layout/Sidebar';

interface SearchResultsTableProps {
  companies: Company[];
  niche: string;
  onNavigate?: (page: PageId) => void;
}

export const SearchResultsTable: React.FC<SearchResultsTableProps> = ({
  companies,
  niche,
  onNavigate,
}) => {
  const { showToast } = useToast();
  const { addLead } = useLeads();

  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('position');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailsCompany, setDetailsCompany] = useState<Company | null>(null);

  const filterPills = [
    { id: 'todos', label: 'Todos' },
    { id: 'with_phone', label: 'Com telefone' },
    { id: 'with_whatsapp', label: 'Com link de WhatsApp' },
    { id: 'with_website', label: 'Com website informado' },
    { id: 'no_website', label: 'Sem website informado' },
    { id: 'website_failed', label: 'Website com erro confirmado' },
    { id: 'saved', label: 'Já cadastradas' },
    { id: 'not_saved', label: 'Ainda não cadastradas' },
    { id: 'not_contacted', label: 'Ainda não contatadas' },
  ];

  // Filtered & Sorted companies
  const filteredCompanies = useMemo(() => {
    let list = [...companies];

    // Filter pills
    if (activeFilter === 'with_phone') {
      list = list.filter((c) => !!c.phone);
    } else if (activeFilter === 'with_whatsapp') {
      list = list.filter((c) => !!c.whatsapp);
    } else if (activeFilter === 'with_website') {
      list = list.filter((c) => c.has_website);
    } else if (activeFilter === 'no_website') {
      list = list.filter((c) => !c.has_website);
    } else if (activeFilter === 'saved') {
      list = list.filter((c) => c.saved_as_lead);
    } else if (activeFilter === 'not_saved') {
      list = list.filter((c) => !c.saved_as_lead);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q))
      );
    }

    // Sort order
    if (sortOrder === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'website') {
      list.sort((a, b) => (b.has_website ? 1 : 0) - (a.has_website ? 1 : 0));
    }

    return list;
  }, [companies, activeFilter, searchQuery, sortOrder]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCompanies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCompanies.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateSite = (company: Company) => {
    addLead({
      company_name: company.name,
      niche: company.niche || niche,
      phone: company.phone,
      whatsapp: company.whatsapp,
      status: 'Novo lead',
      has_website: company.has_website,
      website: company.website,
      tags: company.has_website ? ['Com site'] : ['Sem site informado'],
      contacted: false,
    });
    showToast(`Lead "${company.name}" salvo! Abrindo gerador de site com IA...`, 'success');
    if (onNavigate) {
      onNavigate('templates');
    }
  };

  const handleExportCSV = () => {
    const rows = filteredCompanies.map((c) => ({
      Nome: c.name,
      Nicho: c.niche,
      Telefone: c.phone,
      WhatsApp: c.whatsapp,
      Website: c.has_website ? c.website : 'Sem site',
      Avaliacao: c.rating,
      Endereco: c.address,
      Cidade: c.city,
      Estado: c.state,
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        Object.keys(rows[0] || {}).join(','),
        ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(',')),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_${niche}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`${filteredCompanies.length} empresas exportadas em CSV!`, 'success');
  };

  return (
    <div className="space-y-4 animate-fade-in pt-2">
      {/* 1. Filter Pills Row (Exact replica of Image 3) */}
      <div className="flex flex-wrap gap-2">
        {filterPills.map((pill) => {
          const isActive = activeFilter === pill.id;
          return (
            <button
              type="button"
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer font-medium ${
                isActive
                  ? 'bg-[#fa2600]/15 border border-[#fa2600] text-[#fa2600] shadow-[0_0_12px_rgba(250,38,0,0.3)]'
                  : 'bg-[#101217] border border-[#222733] text-gray-400 hover:text-gray-200 hover:border-[#353c4f]'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* 2. Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {/* Input Filtrar por nome, bairro */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por nome, bairro..."
              className="w-full h-10 px-3.5 bg-[#101217] border border-[#222733] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
            />
          </div>

          {/* Select Ordem da fonte */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="h-10 px-3 bg-[#101217] border border-[#222733] rounded-xl text-xs text-gray-200 focus:border-[#fa2600] focus:outline-none cursor-pointer"
          >
            <option value="position">Ordem da fonte</option>
            <option value="name">Nome (A–Z)</option>
            <option value="neighborhood">Bairro</option>
            <option value="website">Situação do site</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>

        {/* Action Buttons: Refresh & Export */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => showToast('Lista atualizada!', 'info')}
            className="w-10 h-10 rounded-xl border border-[#222733] bg-[#101217] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Recarregar"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-xl border border-[#222733] bg-[#101217] text-xs font-semibold text-gray-300 hover:text-white hover:border-[#383f52] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* 3. Main Data Table Card */}
      <div className="bg-[#0e1014] border border-[#1e222b] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1c1f28] text-gray-400 uppercase tracking-wider text-[10px] bg-[#0b0c10]">
                <th className="py-3 px-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredCompanies.length > 0 &&
                      selectedIds.length === filteredCompanies.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-[#2c3140] bg-[#161922] text-[#fa2600] focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 font-semibold">EMPRESA</th>
                <th className="py-3 px-3 font-semibold">TELEFONE</th>
                <th className="py-3 px-3 font-semibold">WEBSITE</th>
                <th className="py-3 px-3 font-semibold">AVALIAÇÃO</th>
                <th className="py-3 px-3 font-semibold">STATUS</th>
                <th className="py-3 px-3 text-right font-semibold">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161820]">
              {filteredCompanies.map((comp) => {
                const isSelected = selectedIds.includes(comp.id);
                return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-[#12141c]/70 transition-colors ${
                      isSelected ? 'bg-[#fa2600]/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(comp.id)}
                        className="rounded border-[#2c3140] bg-[#161922] text-[#fa2600] focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* Empresa */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white text-[13px] leading-snug">
                        {comp.name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        Google Maps
                      </div>
                    </td>

                    {/* Telefone / WhatsApp */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {comp.phone ? (
                        <a
                          href={`https://wa.me/${(comp.whatsapp || comp.phone).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#14532d] bg-[#062c17] px-2.5 py-1 text-xs text-[#34d399] transition-all hover:bg-[#0a3f22] cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="tabular-nums">{comp.phone}</span>
                          <b className="font-semibold text-[11px]">WhatsApp</b>
                        </a>
                      ) : (
                        <span className="text-gray-500 text-xs">Não informado</span>
                      )}
                    </td>

                    {/* Website */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {comp.has_website && comp.website ? (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-white inline-flex items-center gap-1 text-xs truncate max-w-[140px]"
                        >
                          <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{comp.website.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#2a1210] border border-[#4a1815] text-[#fa2600]">
                          Site não informado
                        </span>
                      )}
                    </td>

                    {/* Avaliação */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{comp.rating.toFixed(1).replace('.', ',')}</span>
                        <span className="text-gray-500 font-normal text-[11px]">
                          ({comp.reviews})
                        </span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300">
                        Novo
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Map Pin button */}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${comp.name} ${comp.address}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Abrir no Google Maps"
                        >
                          <MapPin className="w-4 h-4" />
                        </a>

                        {/* Info button */}
                        <button
                          type="button"
                          onClick={() => setDetailsCompany(comp)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Ver detalhes"
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        {/* Criar site button (Vibrant red-orange pill) */}
                        <button
                          type="button"
                          onClick={() => handleCreateSite(comp)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#fa2600] to-[#ff5000] hover:from-[#e02200] hover:to-[#ea4500] text-white text-xs font-bold tracking-tight shadow-[0_2px_14px_rgba(250,38,0,0.45)] hover:shadow-[0_4px_20px_rgba(250,38,0,0.6)] transition-all cursor-pointer"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Criar site</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 text-xs">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Results count & Pagination */}
        <div className="border-t border-[#1c1f28] px-4 py-3 flex items-center justify-between text-xs text-gray-400 bg-[#0b0c10]">
          <div>
            {filteredCompanies.length} resultado(s) · página 1 de 1
            {selectedIds.length > 0 && ` · ${selectedIds.length} selecionado(s)`}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={true}
              className="px-3 py-1 rounded-lg border border-[#222733] bg-[#14161f] text-gray-500 text-xs disabled:opacity-40 cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={true}
              className="px-3 py-1 rounded-lg border border-[#222733] bg-[#14161f] text-gray-500 text-xs disabled:opacity-40 cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

      {/* 4. Page Bottom Disclaimer */}
      <div className="pt-1 space-y-1 text-[11px] text-gray-500">
        <p>Dados de estabelecimentos: Google Maps.</p>
        <p>
          “Tentar abrir no WhatsApp” só abre a conversa com o número informado; não confirma que ele usa WhatsApp.
        </p>
      </div>

      {/* Details Modal */}
      {detailsCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#111319] border border-[#232833] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {detailsCompany.name}
              </h3>
              <button
                type="button"
                onClick={() => setDetailsCompany(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-300">
              <p>
                <strong className="text-gray-400">Nicho:</strong> {detailsCompany.niche}
              </p>
              <p>
                <strong className="text-gray-400">Endereço:</strong> {detailsCompany.address}
              </p>
              <p>
                <strong className="text-gray-400">Telefone:</strong> {detailsCompany.phone || 'Não informado'}
              </p>
              <p>
                <strong className="text-gray-400">Website:</strong>{' '}
                {detailsCompany.has_website ? detailsCompany.website : 'Sem site informado'}
              </p>
              <p>
                <strong className="text-gray-400">Avaliação:</strong> {detailsCompany.rating} ({detailsCompany.reviews} avaliações)
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDetailsCompany(null)}
                className="px-4 py-2 rounded-xl border border-[#262c3b] text-xs font-semibold text-gray-300 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

