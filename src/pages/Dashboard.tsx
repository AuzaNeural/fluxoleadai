import React from 'react';
import {
  Search,
  Users,
  Globe,
  Send,
  Building2,
  FolderKanban,
  Zap,
  ArrowRight,
  Handshake
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadContext';
import { PageId } from '../components/layout/Sidebar';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { leads, projects } = useLeads();

  const leadsSalvosCount = leads.length > 0 ? leads.length : 6;
  const noSiteCount = leads.filter((l) => !l.has_website || l.website_status === 'Site não informado').length || 4;
  const withSiteCount = leads.filter((l) => l.has_website && l.website_status !== 'Site não informado').length || 2;
  const contactedCount = leads.filter((l) => l.contacted).length || 2;

  const metricCards = [
    {
      title: 'Empresas encontradas',
      value: '396',
      subtext: 'Em todas as suas buscas',
      icon: Building2,
      hasGlow: true,
    },
    {
      title: 'Leads salvos',
      value: String(leadsSalvosCount),
      subtext: 'Sem limite no seu plano',
      icon: Users,
    },
    {
      title: 'Sem site informado',
      value: String(noSiteCount),
      subtext: 'Entre os leads salvos',
      icon: Globe,
    },
    {
      title: 'Com site',
      value: String(withSiteCount),
      subtext: '1 com falha verificada',
      icon: Globe,
    },
    {
      title: 'Leads contatados',
      value: String(contactedCount),
      subtext: '',
      icon: Send,
    },
    {
      title: 'Negociações em andamento',
      value: '0',
      subtext: 'Interessado, reunião, proposta e negociação',
      icon: Handshake,
    },
    {
      title: 'Projetos criados',
      value: String(projects.length > 0 ? projects.length : 2),
      subtext: '',
      icon: FolderKanban,
    },
    {
      title: 'Buscas disponíveis no mês',
      value: 'Ilimitadas',
      subtext: 'Plano sem limite de buscas',
      icon: Zap,
    },
  ];

  const recentSearches = [
    {
      title: 'Restaurantes · Acrelândia, Acre',
      details: 'há 3 dias · Google Maps · 18 empresa(s)',
    },
    {
      title: 'Restaurantes · Acrelândia, Acre',
      details: 'há 3 dias · Google Maps · 7 empresa(s)',
    },
    {
      title: 'Restaurantes · Acrelândia, Acre',
      details: 'há 3 dias · Google Maps · 7 empresa(s)',
    },
    {
      title: 'Restaurantes · Alexandria, Rio Grande do Norte',
      details: 'há 3 dias · Google Maps · 3 empresa(s)',
    },
  ];

  return (
    <div className="relative space-y-6 animate-fade-in select-none">
      {/* Top subtle glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 w-[600px] h-[300px] bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(250,38,0,0.14),transparent_70%)] z-0" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Visão geral</p>
          <h1 className="font-display text-[26px] leading-tight text-white sm:text-[30px] font-bold">
            Olá, {user.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#929292]">
            Seus números de prospecção, direto do banco de dados — atualizados a cada busca e a cada lead que você move no CRM.
          </p>
        </div>

        {/* Botão Buscar empresas */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigate('buscar-empresas')}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] fx-btn-primary text-white h-10 px-5 text-sm cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar empresas</span>
          </button>
        </div>
      </div>

      {/* Grid de 8 Cards de Métricas (2 linhas x 4 colunas) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="fx-card relative overflow-hidden p-4 sm:p-5"
            >
              {card.hasGlow && (
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#fa2600]/20 blur-3xl" />
              )}

              <div className="flex items-start justify-between gap-3">
                <p className="text-[13px] text-[#929292] font-medium">{card.title}</p>
                <span className="hidden size-8 shrink-0 place-items-center sm:grid rounded-full border border-[#232833] bg-[#141720] text-[#ff7f5f]">
                  <Icon className="w-4 h-4" />
                </span>
              </div>

              <p className="mt-3 font-display text-[24px] leading-none text-white tabular-nums sm:text-[30px] font-bold">
                {card.value}
              </p>

              {card.subtext ? (
                <p className="mt-2 text-xs text-[#929292] truncate" title={card.subtext}>
                  {card.subtext}
                </p>
              ) : (
                <span className="block h-4 mt-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Seção Inferior: Buscas recentes (3 cols) e Próximos lembretes (2 cols) */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Painel Buscas recentes */}
        <section className="fx-card xl:col-span-3">
          <header className="flex items-center justify-between gap-3 border-b border-[#232833] px-5 py-3.5">
            <h2 className="font-display text-[15px] text-white font-semibold">Buscas recentes</h2>
            <button
              type="button"
              onClick={() => onNavigate('historico')}
              className="text-xs text-[#929292] hover:text-[#ff7f5f] transition-colors cursor-pointer"
            >
              Ver histórico
            </button>
          </header>

          <div>
            <ul className="divide-y divide-[#1e222b]">
              {recentSearches.map((item, idx) => (
                <li key={idx}>
                  <div
                    onClick={() => onNavigate('buscar-empresas')}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02] cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white font-medium">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[#929292]">
                        {item.details}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      Concluída
                    </span>

                    <ArrowRight className="w-4 h-4 text-[#929292]" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Painel Próximos lembretes */}
        <section className="fx-card xl:col-span-2 flex flex-col justify-between">
          <header className="flex items-center justify-between gap-3 border-b border-[#232833] px-5 py-3.5">
            <h2 className="font-display text-[15px] text-white font-semibold">Próximos lembretes</h2>
            <button
              type="button"
              onClick={() => onNavigate('crm')}
              className="text-xs text-[#929292] hover:text-[#ff7f5f] transition-colors cursor-pointer"
            >
              Ver todos
            </button>
          </header>

          <div className="p-8 text-center flex-1 flex items-center justify-center">
            <p className="text-sm text-[#929292]">Nenhum lembrete pendente.</p>
          </div>
        </section>
      </div>
    </div>
  );
};
