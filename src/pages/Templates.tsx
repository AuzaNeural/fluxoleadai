import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, Eye, Sparkles, Play, Pause, Smartphone, Monitor } from 'lucide-react';
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

const isAnimatedTemplate = (tmpl: RawTemplate) => {
  const text = (tmpl.description + ' ' + tmpl.name).toLowerCase();
  return (
    text.includes('vídeo') ||
    text.includes('video') ||
    text.includes('animad') ||
    text.includes('slideshow') ||
    text.includes('carrossel') ||
    text.includes('slides') ||
    text.includes('dinâmic') ||
    text.includes('dinamic') ||
    text.includes('interativ') ||
    text.includes('flutuante') ||
    text.includes('lupa') ||
    text.includes('transiç')
  );
};

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
  '✨ Animados',
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
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll simulation for interactive preview
  useEffect(() => {
    if (!previewTemplate || !isAutoScrolling) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const el = scrollContainerRef.current;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
          el.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ top: 1.5, behavior: 'auto' });
        }
      }
    }, 40);

    return () => clearInterval(interval);
  }, [previewTemplate, isAutoScrolling]);

  const filteredTemplates = templatesData.filter((tmpl) => {
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'Todos') return true;
    if (selectedCategory === '✨ Animados') return isAnimatedTemplate(tmpl);

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
          Escolha um modelo
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
          placeholder="Buscar modelos ou animações (ex.: vídeo, carrossel, slider...)"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface-2 px-4 py-2 text-sm text-fg placeholder:text-fg-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-full border border-line bg-surface-2 px-4 text-xs font-semibold text-fg hover:border-line-strong"
        >
          Buscar
        </button>
      </form>

      {/* Categorias com destaque para ✨ Animados */}
      <nav className="mb-7 flex flex-wrap gap-2" aria-label="Categorias">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          const isSpecialAnim = cat === '✨ Animados';
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`inline-flex h-8 items-center rounded-full border px-3.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] transition-all cursor-pointer ${
                isActive
                  ? isSpecialAnim
                    ? 'border-transparent bg-gradient-to-r from-[#fa2600] to-[#ff5500] text-white shadow-[0_2px_12px_rgba(250,38,0,0.5)]'
                    : 'border-transparent bg-fg-2 text-black'
                  : isSpecialAnim
                  ? 'border-[#fa2600]/40 bg-[#fa2600]/10 text-[#ff7f5f] hover:bg-[#fa2600]/20'
                  : 'border-line bg-surface-2 text-fg-3 hover:border-line-strong hover:text-fg-2'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>

      {/* Grid de Templates Responsivo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((tmpl) => {
          const isAnim = isAnimatedTemplate(tmpl);
          return (
            <article
              key={tmpl.id}
              data-catalogue-card="true"
              className="group relative flex flex-col rounded-[18px] border bg-surface p-3 transition-all duration-300 border-line hover:border-line-strong hover:shadow-xl hover:shadow-black/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-surface-3">
                {/* Selo Animado para Modelos com Efeitos */}
                {isAnim && (
                  <span className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#fa2600]/60 px-2.5 py-0.5 text-[10px] font-semibold text-[#ff7f5f] shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fa2600] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#fa2600]"></span>
                    </span>
                    <span>Animado</span>
                  </span>
                )}

                <img
                  src={tmpl.thumbnail || getCategoryFallback(tmpl.category)}
                  onError={(e) => {
                    e.currentTarget.src = getCategoryFallback(tmpl.category);
                  }}
                  alt={`Prévia do modelo ${tmpl.name}`}
                  loading="lazy"
                  className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              </div>

              <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-accent">
                    [ {tmpl.category} ]
                  </p>
                  {isAnim && (
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      Interativo
                    </span>
                  )}
                </div>

                <h3 className="mt-1.5 font-display text-[22px] leading-tight text-fg font-semibold">
                  {tmpl.name}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-fg-3">
                  {tmpl.description}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(tmpl)}
                    className="fx-btn-primary inline-flex h-8 flex-1 items-center justify-center whitespace-nowrap rounded-full px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white cursor-pointer"
                  >
                    Usar modelo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTemplate(tmpl);
                      setIsAutoScrolling(true);
                      setPreviewDevice('desktop');
                    }}
                    className="inline-flex h-8 flex-1 items-center justify-center rounded-full bg-fg-2 px-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-fg cursor-pointer"
                  >
                    Visualizar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
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

      {/* Modal Interativo com Simulação de Scroll e Efeitos Animados */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={previewTemplate.name}
        >
          <div className="space-y-4">
            {/* Controles de Visualização: Dispositivo e Scroll Animado */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-1 bg-[#14161d] border border-[#232733] rounded-xl text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'desktop'
                      ? 'bg-[#252936] text-white font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    previewDevice === 'mobile'
                      ? 'bg-[#252936] text-white font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  isAutoScrolling
                    ? 'border-[#fa2600]/50 bg-[#fa2600]/15 text-[#ff7f5f]'
                    : 'border-[#2d3240] text-gray-400 hover:text-white'
                }`}
              >
                {isAutoScrolling ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar scroll</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Animar navegação</span>
                  </>
                )}
              </button>
            </div>

            {/* Frame de Simulação de Preview */}
            <div
              className={`relative mx-auto overflow-hidden rounded-xl border border-line bg-surface-3 transition-all ${
                previewDevice === 'mobile'
                  ? 'max-w-[280px] h-[380px] border-4 border-[#2b303c] rounded-[24px]'
                  : 'w-full aspect-[16/10] max-h-[360px]'
              }`}
            >
              <div
                ref={scrollContainerRef}
                className="w-full h-full overflow-y-auto scrollbar-none"
              >
                <img
                  src={previewTemplate.thumbnail || getCategoryFallback(previewTemplate.category)}
                  onError={(e) => {
                    e.currentTarget.src = getCategoryFallback(previewTemplate.category);
                  }}
                  alt={previewTemplate.name}
                  className="w-full h-auto object-cover object-top"
                />
              </div>

              {/* Botão de WhatsApp Flutuante com Pulso Animado (demonstrativo) */}
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
                </span>
                <span className="px-2 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-bold shadow-lg">
                  WhatsApp
                </span>
              </div>
            </div>

            {/* Informações e Recursos Animados Inclusos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  [ {previewTemplate.category} ]
                </span>
                {isAnimatedTemplate(previewTemplate) && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                    ✨ Template com Animações Ativas
                  </span>
                )}
              </div>
              <p className="text-xs text-fg-3 leading-relaxed">
                {previewTemplate.description}
              </p>

              {/* Badges de recursos animados */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-[#161820] border border-[#262a36] text-[10px] text-gray-400">
                  🎬 Hero dinâmico
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#161820] border border-[#262a36] text-[10px] text-gray-400">
                  ⚡ Carrossel & Transições
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#161820] border border-[#262a36] text-[10px] text-gray-400">
                  📱 Mobile First & Fluido
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#161820] border border-[#262a36] text-[10px] text-gray-400">
                  💬 WhatsApp Integrado com pulso
                </span>
              </div>
            </div>

            {/* Ações */}
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
                Usar este modelo agora
              </button>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-5 h-10 rounded-full border border-line bg-surface-2 text-xs font-medium text-fg hover:border-line-strong cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
