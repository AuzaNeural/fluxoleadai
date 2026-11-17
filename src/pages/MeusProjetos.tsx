import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Globe,
  ExternalLink,
  Edit,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { Project } from '../types';

export const MeusProjetos: React.FC = () => {
  const { projects, publishProject } = useLeads();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePublish = (proj: Project) => {
    const slug = proj.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedUrl = `https://${slug}.fluxosite.com.br`;
    publishProject(proj.id, generatedUrl);
    showToast(`O site "${proj.name}" foi publicado em: ${generatedUrl}!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          1. CABEÇALHO (100% Idêntico ao Original)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="fx-eyebrow mb-1">Projetos</p>
          <h1 className="font-display text-[26px] leading-tight text-white sm:text-[30px] font-bold">
            Meus projetos
          </h1>
          <p className="text-xs sm:text-sm text-[#929292] mt-1">
            Acompanhe os sites que você está montando para cada cliente, do rascunho à publicação.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-gradient-to-r from-[#fa2600] to-[#c82200] hover:from-[#ff3a17] hover:to-[#db2700] text-white text-xs font-semibold shadow-md transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo projeto</span>
        </button>
      </div>

      {/* =========================================================================
          2. LISTA / GRID DE PROJETOS (100% Idêntico ao Original)
          ========================================================================= */}
      {projects.length === 0 ? (
        <div className="py-16 text-center fx-card p-8">
          <FolderKanban className="w-12 h-12 text-[#929292] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Nenhum projeto criado ainda</h3>
          <p className="text-xs text-[#929292] max-w-sm mx-auto mb-6">
            Crie sua primeira landing page com IA a partir dos nossos templates e publique em 1 clique.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full fx-btn-primary text-white text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Criar meu primeiro site</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const isPublished = proj.status === 'Published';
            const clientName = proj.name.replace(/^Site\s*—\s*/i, '');

            return (
              <div
                key={proj.id}
                className="fx-card overflow-hidden transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Header */}
                  <div className="relative h-44 overflow-hidden bg-black/60 border-b border-[#232833]">
                    <img
                      src={proj.thumbnail}
                      alt={proj.name}
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold border backdrop-blur-md ${
                          isPublished
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                            : 'bg-black/75 text-gray-300 border-white/10'
                        }`}
                      >
                        {isPublished ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-[#929292]">
                      <strong className="text-gray-400 font-medium">Cliente:</strong> {clientName}
                    </p>
                    <p className="text-xs text-[#929292]">
                      <strong className="text-gray-400 font-medium">Template:</strong> {proj.category}
                    </p>
                    <p className="text-[11px] text-gray-500 pt-1">
                      Atualizado {proj.updated_at || 'há 3 dias'}
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="p-5 pt-0 border-t border-[#1e222b] mt-3 flex items-center justify-between gap-2">
                  {isPublished && proj.url ? (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#4ade80] hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Ver site</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePublish(proj)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#fa2600] hover:underline cursor-pointer font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Publicar site</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => showToast('Editor de site com IA pronto!', 'info')}
                    className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full border border-[#282e3b] bg-[#141720] text-xs font-semibold text-gray-200 hover:text-white hover:border-[#fa2600] transition-all cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
