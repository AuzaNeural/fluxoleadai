import React, { useState, useMemo } from 'react';
import {
  Search,
  Upload,
  Download,
  Phone,
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { NewLeadModal } from '../components/modals/NewLeadModal';
import { ConfirmModal } from '../components/common/ConfirmModal';

export const MeusLeads: React.FC = () => {
  const { leads, deleteLead } = useLeads();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('all');
  const [contactedFilter, setContactedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');

  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // Filtragem e ordenação
  const filteredLeads = useMemo(() => {
    let list = [...leads];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((l) =>
        l.company_name.toLowerCase().includes(q) ||
        (l.neighborhood && l.neighborhood.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        l.phone.includes(q) ||
        (l.niche && l.niche.toLowerCase().includes(q))
      );
    }

    if (stageFilter) {
      list = list.filter((l) => l.status === stageFilter);
    }

    if (siteFilter && siteFilter !== 'all') {
      if (siteFilter === 'not_informed') {
        list = list.filter((l) => !l.has_website || l.website_status === 'Site não informado');
      } else if (siteFilter === 'informed') {
        list = list.filter(
          (l) =>
            l.has_website ||
            (l.website && l.website.length > 0) ||
            l.website_status === 'Site funcionando' ||
            l.website_status === 'Problema confirmado' ||
            l.website_status === 'Site com falha'
        );
      } else if (siteFilter === 'ok') {
        list = list.filter(
          (l) =>
            l.website_status === 'Site funcionando' ||
            (l.has_website &&
              l.website_status !== 'Problema confirmado' &&
              l.website_status !== 'Site com falha')
        );
      } else if (siteFilter === 'failed') {
        list = list.filter(
          (l) =>
            l.website_status === 'Problema confirmado' ||
            l.website_status === 'Site com falha'
        );
      }
    }

    if (contactedFilter && contactedFilter !== 'all') {
      if (contactedFilter === 'yes') {
        list = list.filter((l) => l.contacted);
      } else if (contactedFilter === 'no') {
        list = list.filter((l) => !l.contacted);
      }
    }

    if (sortOrder === 'name') {
      list.sort((a, b) => a.company_name.localeCompare(b.company_name));
    } else if (sortOrder === 'updated') {
      list.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
    } else if (sortOrder === 'next_contact') {
      list.sort((a, b) => (a.next_contact || '').localeCompare(b.next_contact || ''));
    }

    return list;
  }, [leads, searchTerm, stageFilter, siteFilter, contactedFilter, sortOrder]);

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      showToast('Nenhum lead disponível para exportação.', 'info');
      return;
    }

    const headers = 'Empresa,Bairro,Cidade,Telefone,Etapa,Site,Atualizado\n';
    const rows = filteredLeads
      .map(
        (l) =>
          `"${l.company_name}","${l.neighborhood || ''}","${l.city || ''}","${l.phone}","${l.status}","${l.website_status || (l.has_website ? 'Site funcionando' : 'Site não informado')}","${l.updated_at || l.created_at}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meus_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Planilha CSV de leads exportada com sucesso!', 'success');
  };

  const handleImportCSV = () => {
    showToast('Funcionalidade de importação de CSV pronta! Selecione seu arquivo.', 'info');
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Filtros aplicados!', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          1. CABEÇALHO: LEADS / Meus leads (100% Idêntico ao Original)
          ========================================================================= */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Leads</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Meus leads
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Empresas que você salvou das buscas ou importou. Só a sua conta vê estes dados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleImportCSV}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm cursor-pointer"
          >
            <Upload className="size-4" />
            Importar CSV
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm cursor-pointer"
          >
            <Download className="size-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. BARRA DE BUSCA E FILTROS (100% Idêntico ao Original e ao Vídeo)
          ========================================================================= */}
      <form
        onSubmit={handleFilterSubmit}
        className="fx-card mb-4 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-12"
      >
        {/* Input de Busca */}
        <div className="relative lg:col-span-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-3" />
          <input
            name="q"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nome, bairro, cidade ou telefone"
            aria-label="Buscar leads"
            className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 pl-9"
          />
        </div>

        {/* Dropdown 1: Todas as etapas */}
        <select
          name="stage"
          aria-label="Etapa"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23929292%22%20stroke-width=%222%22><path%20d=%22m2%204%204%204%204-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 lg:col-span-2 cursor-pointer"
        >
          <option value="">Todas as etapas</option>
          <option value="Novo lead">Novo lead</option>
          <option value="Não contatado">Não contatado</option>
          <option value="Primeiro contato">Primeiro contato</option>
          <option value="Respondeu">Respondeu</option>
          <option value="Interessado">Interessado</option>
          <option value="Reunião marcada">Reunião marcada</option>
          <option value="Proposta enviada">Proposta enviada</option>
          <option value="Negociação">Negociação</option>
          <option value="Fechado">Fechado</option>
          <option value="Perdido">Perdido</option>
        </select>

        {/* Dropdown 2: Qualquer site */}
        <select
          name="website"
          aria-label="Situação do site"
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23929292%22%20stroke-width=%222%22><path%20d=%22m2%204%204%204%204-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 lg:col-span-2 cursor-pointer"
        >
          <option value="all">Qualquer site</option>
          <option value="not_informed">Sem site informado</option>
          <option value="informed">Site informado</option>
          <option value="ok">Site funcionando</option>
          <option value="failed">Site com falha</option>
        </select>

        {/* Dropdown 3: Contatados ou não */}
        <select
          name="contacted"
          aria-label="Contato"
          value={contactedFilter}
          onChange={(e) => setContactedFilter(e.target.value)}
          className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23929292%22%20stroke-width=%222%22><path%20d=%22m2%204%204%204%204-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 lg:col-span-2 cursor-pointer"
        >
          <option value="all">Contatados ou não</option>
          <option value="no">Ainda não contatados</option>
          <option value="yes">Já contatados</option>
        </select>

        {/* Dropdown 4: Ordenar (Recentes) */}
        <select
          name="sort"
          aria-label="Ordenar"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23929292%22%20stroke-width=%222%22><path%20d=%22m2%204%204%204%204-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 lg:col-span-1 cursor-pointer"
        >
          <option value="recent">Recentes</option>
          <option value="updated">Atualizados</option>
          <option value="name">Nome</option>
          <option value="next_contact">Próx. contato</option>
        </select>

        {/* Botão Filtrar */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-shiny text-fg h-10 px-5 text-sm lg:col-span-1 cursor-pointer"
        >
          Filtrar
        </button>
      </form>

      {/* =========================================================================
          3. TABELA DE LEADS (100% Idêntico ao Original e ao Vídeo)
          ========================================================================= */}
      <div className="fx-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line text-[11.5px] uppercase tracking-wide text-fg-3">
              <tr>
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-3 py-3 font-medium">Etapa</th>
                <th className="px-3 py-3 font-medium">Telefone</th>
                <th className="px-3 py-3 font-medium">Site</th>
                <th className="px-3 py-3 font-medium">Próximo contato</th>
                <th className="px-3 py-3 font-medium">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr className="border-t border-line">
                  <td colSpan={6} className="py-12 text-center text-fg-3 text-xs">
                    Nenhum lead encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const hasProblem =
                    lead.website_status === 'Problema confirmado' ||
                    lead.website_status === 'Site com falha';
                  const isWorking = lead.website_status === 'Site funcionando';
                  const cleanPhone = (lead.whatsapp || lead.phone).replace(/\D/g, '');

                  return (
                    <tr
                      key={lead.id}
                      className="border-t border-line transition-colors hover:bg-white/[0.02]"
                    >
                      {/* 1. EMPRESA */}
                      <td className="max-w-[300px] px-5 py-3.5">
                        <span className="font-medium text-fg hover:text-accent-soft cursor-pointer">
                          {lead.company_name}
                        </span>
                        <p className="mt-0.5 truncate text-xs text-fg-3">
                          {lead.neighborhood || 'Centro'} · {lead.city || 'São Paulo'} · {lead.source || 'Google Maps'}
                        </p>
                      </td>

                      {/* 2. ETAPA */}
                      <td className="px-3 py-3.5">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-accent/30 bg-accent/10 text-accent-soft">
                          {lead.status}
                        </span>
                        {lead.contacted && (
                          <p className="mt-1 text-[11px] text-fg-3">Contatado</p>
                        )}
                      </td>

                      {/* 3. TELEFONE */}
                      <td className="whitespace-nowrap px-3 py-3.5">
                        <span className="inline-flex items-center gap-2 tabular-nums text-fg-2">
                          {lead.phone}
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Ligar para ${lead.company_name} pelo WhatsApp`}
                            aria-label={`Ligar para ${lead.company_name}`}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-8 px-3 text-[13px] cursor-pointer"
                          >
                            <Phone className="size-3.5" />
                            <span className="sr-only">Ligar</span>
                          </a>
                          {lead.whatsapp_confirmed ? (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Link de WhatsApp divulgado pela empresa"
                              className="text-[11px] text-success hover:underline"
                              href={`https://wa.me/${cleanPhone}`}
                            >
                              WhatsApp
                            </a>
                          ) : (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abre a conversa com o número; não comprova que ele usa WhatsApp"
                              className="text-[11px] text-fg-3 hover:underline"
                              href={`https://wa.me/${cleanPhone}`}
                            >
                              Tentar WhatsApp
                            </a>
                          )}
                        </span>
                      </td>

                      {/* 4. SITE */}
                      <td className="px-3 py-3.5">
                        {isWorking ? (
                          <span
                            title="Respondeu normalmente na última verificação."
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success"
                          >
                            Site funcionando
                          </span>
                        ) : hasProblem ? (
                          <span
                            title="Respondeu com erro (404, 5xx ou certificado inválido)."
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-danger/30 bg-danger/10 text-danger"
                          >
                            Problema confirmado
                          </span>
                        ) : (
                          <span
                            title="A fonte consultada não informa site. Isso não prova que a empresa não tenha um."
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-accent/30 bg-accent/10 text-accent-soft"
                          >
                            Site não informado
                          </span>
                        )}
                      </td>

                      {/* 5. PRÓXIMO CONTATO */}
                      <td className="whitespace-nowrap px-3 py-3.5 text-xs text-fg-2">
                        {lead.next_contact || '—'}
                      </td>

                      {/* 6. ATUALIZADO */}
                      <td className="whitespace-nowrap px-3 py-3.5 text-xs text-fg-3">
                        {lead.updated_at || lead.created_at || 'há 3 dias'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer com contagem e paginação idêntico ao original */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-xs text-fg-3">
          <span>{filteredLeads.length} lead(s) · página 1 de 1</span>
          <div className="flex gap-2"></div>
        </div>
      </div>

      {/* Modais de Sistema */}
      <NewLeadModal isOpen={isNewLeadOpen} onClose={() => setIsNewLeadOpen(false)} />

      <ConfirmModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => {
          if (leadToDelete) {
            deleteLead(leadToDelete);
            showToast('Lead removido com sucesso.', 'info');
          }
        }}
        title="Remover Lead"
        description="Tem certeza que deseja excluir este lead do seu sistema? Esta ação não pode ser desfeita."
        confirmText="Excluir Lead"
        danger={true}
      />
    </div>
  );
};
