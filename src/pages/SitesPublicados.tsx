import React from 'react';
import { Globe, ExternalLink, ArrowRight } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { PageId } from '../components/layout/Sidebar';

interface SitesPublicadosProps {
  onNavigate?: (page: PageId) => void;
}

export const SitesPublicados: React.FC<SitesPublicadosProps> = ({ onNavigate }) => {
  const { projects } = useLeads();
  const publishedProjects = projects.filter((p) => p.status === 'Published');

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          1. CABEÇALHO (100% Idêntico ao Original)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="fx-eyebrow mb-1">Entregas</p>
          <h1 className="font-display text-[26px] leading-tight text-white sm:text-[30px] font-bold">
            Sites publicados
          </h1>
          <p className="text-xs sm:text-sm text-[#929292] mt-1">
            Os projetos que já estão no ar, com o endereço de cada um.
          </p>
        </div>
      </div>

      {/* =========================================================================
          2. LISTA OU EMPTY STATE (100% Idêntico ao Original)
          ========================================================================= */}
      {publishedProjects.length === 0 ? (
        <div className="fx-card p-12 text-center">
          <Globe className="w-12 h-12 text-[#929292] mx-auto mb-3" />
          <h3 className="font-display text-base font-bold text-white mb-1">
            Nenhum site publicado ainda
          </h3>
          <p className="text-xs text-[#929292] max-w-md mx-auto mb-5 leading-relaxed">
            Quando você marcar um projeto como publicado e informar o endereço, ele aparece aqui com o link.
          </p>
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('meus-projetos')}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#282e3b] bg-[#141720] text-xs font-semibold text-gray-200 hover:text-white hover:border-[#fa2600] transition-all cursor-pointer shadow-sm"
            >
              <span>Ir para Meus projetos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {publishedProjects.map((p) => (
            <div key={p.id} className="fx-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <p className="text-xs text-[#929292]">{p.category}</p>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#4ade80] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="truncate">{p.url}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
