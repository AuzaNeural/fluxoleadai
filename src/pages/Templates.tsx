import React, { useState } from 'react';
import { Template } from '../types';
import { NewProjectModal } from '../components/modals/NewProjectModal';
import { Modal } from '../components/common/Modal';
import { PageId } from '../components/layout/Sidebar';
import rawTemplates from '../data/templates.json';

interface TemplatesProps {
  onNavigate: (page: PageId) => void;
}

interface RawTemplate {
  id: string;
  thumbnail: string;
  alt: string;
  category: string;
  name: string;
  description: string;
  demoUrl: string;
}

const templatesData: RawTemplate[] = rawTemplates as RawTemplate[];

const getCategoryFallback = (cat: string) => {
  const map: Record<string, string> = {
    'Advocacia': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    'Barbearias': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    'Restaurantes': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    'Tecnologia': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    'Educação': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop&q=80',
    'Academias e esportes': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    'Saúde & Bem-estar': 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    'Finanças e criptomoedas': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    'Marketing & Consultoria': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    'Indústria & Energia': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    'Imobiliário & Reforma': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
    'Pet shops': 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
    'Salões de beleza': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    'Transportadoras': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    'Lojas': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
    'Serviços profissionais': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&auto=format&fit=crop&q=80',
    'Estúdios de tatuagem': 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=600&auto=format&fit=crop&q=80'
  };
  return map[cat] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
};

const categories = [
  'Todos',
  'Tecnologia',
  'Educação',
  'Academias e esportes',
  'Saúde & Bem-estar',
  'Finanças e criptomoedas',
  'Marketing & Consultoria',
  'Indústria & Energia',
  'Imobiliário & Reforma',
  'Advocacia',
  'Restaurantes',
  'Pet shops',
  'Barbearias',
  'Salões de beleza',
  'Transportadoras',
  'Lojas',
  'Serviços profissionais',
  'Estúdios de tatuagem'
];

export const Templates: React.FC<TemplatesProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeTemplateForModal, setActiveTemplateForModal] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<RawTemplate | null>(null);

  const filteredTemplates = templatesData.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'Todos') return true;

    return tmpl.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
  });

  const handleUseTemplate = (tmpl: RawTemplate) => {
    setActiveTemplateForModal({
      id: tmpl.id,
      name: tmpl.name,
      category: tmpl.category,
      image_url: tmpl.thumbnail || getCategoryFallback(tmpl.category),
      description: tmpl.description
    });
  };

  return (
    <div className="animate-fade-in select-none">
      <header className="mb-7">
        <p className="fx-eyebrow mb-3 inline-block rounded-full border border-accent/30 px-3 py-1 !text-[10.5px]">
          ESCOLHA UM MODELO
        </p>
        <h1 className="font-display text-[30px] leading-tight text-fg sm:text-[40px] font-bold">
          Escolha um modelo e crie em minutos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-3">
          Personalize os textos com os dados da empresa e prepare uma página profissional, sem precisar desenhar ou programar.
        </p>
      </header>

      {/* Busca */}
      <form
        role="search"
        className="mb-5 flex max-w-xl gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          aria-label="Buscar templates"
          placeholder="Buscar modelos"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-fg placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-full border border-line bg-surface-2 px-4 text-xs font-semibold text-fg hover:border-line-strong cursor-pointer"
        >
          Buscar
        </button>
      </form>

      {/* Categorias (exatamente idênticas à imagem 1) */}
      <nav className="mb-7 flex flex-wrap gap-2" aria-label="Categorias">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex h-8 items-center rounded-full border px-3.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                isActive
                  ? 'border-transparent bg-white text-black'
                  : 'border-line bg-surface-2 text-fg-3 hover:border-line-strong hover:text-fg-2'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Grid de Templates (exatamente idêntico às imagens 2 a 10) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((tmpl) => (
          <article
            key={tmpl.id}
            data-catalogue-card="true"
            className="group relative flex flex-col rounded-[20px] border border-[#262830] bg-[#0c0d10] p-3 transition-colors hover:border-[#383d4a]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#14161c]">
              <img
                src={tmpl.thumbnail}
                onError={(e) => {
                  e.currentTarget.src = getCategoryFallback(tmpl.category);
                }}
                alt={tmpl.alt || `Prévia do modelo ${tmpl.name}`}
                loading="lazy"
                className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#fa2600]">
                [ {tmpl.category} ]
              </p>
              <h3 className="mt-1.5 font-display text-[20px] leading-tight text-white font-medium">
                {tmpl.name}
              </h3>
              <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-[#929292]">
                {tmpl.description}
              </p>
              <div className="mt-auto flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(tmpl)}
                  className="fx-btn-primary inline-flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white cursor-pointer"
                >
                  USAR MODELO
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(tmpl)}
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-[#dbe0e8] hover:bg-white text-black text-[11px] font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer"
                >
                  VISUALIZAR
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de Criação de Projeto */}
      {activeTemplateForModal && (
        <NewProjectModal
          isOpen={!!activeTemplateForModal}
          onClose={() => setActiveTemplateForModal(null)}
          selectedTemplate={activeTemplateForModal}
          onSuccess={() => {
            setActiveTemplateForModal(null);
            onNavigate('meus-projetos');
          }}
        />
      )}

      {/* Modal de Preview do Template */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={previewTemplate.name}
        >
          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] border border-line bg-surface-3">
              <img
                src={previewTemplate.thumbnail}
                onError={(e) => {
                  e.currentTarget.src = getCategoryFallback(previewTemplate.category);
                }}
                alt={previewTemplate.name}
                className="size-full object-cover object-top"
              />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#fa2600]">
                [ {previewTemplate.category} ]
              </span>
              <p className="mt-2 text-sm text-[#929292] leading-relaxed">
                {previewTemplate.description}
              </p>
            </div>
            <div className="flex gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  const tmpl = previewTemplate;
                  setPreviewTemplate(null);
                  handleUseTemplate(tmpl);
                }}
                className="fx-btn-primary flex-1 h-10 rounded-full text-xs font-semibold uppercase tracking-wider text-white cursor-pointer"
              >
                USAR ESTE MODELO AGORA
              </button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-5 h-10 rounded-full border border-line bg-surface-2 text-xs font-medium text-fg hover:border-line-strong cursor-pointer"
              >
                FECHAR
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
