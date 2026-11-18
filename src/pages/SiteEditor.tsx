import React, { useState, useRef, useEffect } from 'react';
import {
  Monitor,
  Smartphone,
  Sparkles,
  Upload,
  Globe,
  Save,
  Rocket,
  CheckCircle2,
  ExternalLink,
  LayoutTemplate,
  Folder,
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Shield,
  Award,
  Users,
  Check,
  ChevronDown
} from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { Project } from '../types';
import rawTemplates from '../data/templates.json';

interface SiteEditorProps {
  templateData?: any;
  projectData?: Project | null;
  onNavigate: (page: PageId, data?: any) => void;
}

export const SiteEditor: React.FC<SiteEditorProps> = ({
  templateData,
  projectData,
  onNavigate
}) => {
  const { createProject, publishProject } = useLeads();
  const { showToast } = useToast();

  // Find template or fallback to Advocacia Premium
  const defaultTemplate = rawTemplates[0]; // Advocacia Premium — Direito Bancário
  const template = templateData || (projectData?.template_id
    ? rawTemplates.find((t) => t.id === projectData.template_id) || defaultTemplate
    : defaultTemplate);

  const [activeTab, setActiveTab] = useState<'conteudo' | 'textos' | 'imagens' | 'extras'>('conteudo');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [showPublishSuccessModal, setShowPublishSuccessModal] = useState(false);
  const [publishedLiveUrl, setPublishedLiveUrl] = useState('');

  // Project state
  const [projectName, setProjectName] = useState(
    projectData?.name || `Site — ${template.name}`
  );

  // Form Fields state with realistic prefilled content
  const [formData, setFormData] = useState({
    // IDENTIDADE
    escritorioNome: 'Advocacia João Carlos & Associados',
    logoUrl: '',
    corPrincipal: '#D4AF37', // Dourado

    // TOPO DA PÁGINA (HERO)
    heroTitulo: 'Chega de abusos bancários! Defenda seu dinheiro e seu nome',
    heroDescricao: 'Negativação indevida, juros abusivos, empréstimos não autorizados e fraudes bancárias. Nossa equipe de advogados especialistas recupera seu crédito e seus direitos.',
    heroFotoFundo: template.thumbnail || '/templates/template-1.jpg',
    heroBotaoTexto: 'Falar com advogado no WhatsApp',

    // SOBRE
    sobreEtiqueta: 'SOBRE O ESCRITÓRIO',
    sobreTitulo: 'Mais de 15 anos de excelência na defesa do cidadão e das empresas',
    sobreTexto: 'Somos especializados em Direito Bancário e do Consumidor. Atuamos com agilidade e rigor técnico para combater práticas abusivas de instituições financeiras, sempre com transparência total.',
    sobreFoto: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',

    // CONTATO E LOCALIZAÇÃO
    telefone: '(21) 3456-7890',
    whatsapp: '21998765432',
    email: 'contato@advocaciabancaria.com.br',
    endereco: 'Av. Rio Branco, 156 - Centro, Rio de Janeiro - RJ',
    horario: 'Segunda a Sexta, das 09:00 às 18:00',

    // FOTOS E VÍDEO
    problema1Foto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    problema2Foto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    problema3Foto: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    problema4Foto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    problema5Foto: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    advogado1Foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    advogado2Foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    advogado3Foto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    advogado4Foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    videoTopo: '',
    fotoFundo2: '',
    fotoFundo3: '',

    // TEXTOS E SEÇÕES
    abaNavegador: 'Advocacia Especializada | Direito Bancário',
    faixaServico1: 'Revisão de Juros Abusivos',
    faixaServico2: 'Fraudes e Golpes do PIX',
    faixaServico3: 'Negativação Indevida no SPC/Serasa',
    faixaServico4: 'Empréstimos RMC não contratados',
    chamadaCentralTitulo: 'Você está pagando juros abusivos ao banco sem perceber?',
    chamadaCentralBotao: 'Solicitar análise gratuita do contrato',

    // PILARES
    pilar1Titulo: 'Atendimento Rápido e Humanizado',
    pilar1Texto: 'Analisamos seus extratos e contratos bancários em até 24 horas.',
    pilar2Titulo: 'Sem Custos Ocultos',
    pilar2Texto: 'Honorários combinados de forma transparente, com facilidade de pagamento.',
    pilar3Titulo: 'Mais de 94% de Êxito',
    pilar3Texto: 'Centenas de clientes que recuperaram valores cobrados indevidamente.',

    // ÁREAS DE ATUAÇÃO
    areasEtiqueta: 'ESPECIALIDADES JURÍDICAS',
    areasTitulo: 'Como podemos te ajudar hoje?',
    areasTexto: 'Atuamos de forma estratégica contra abusos de grandes instituições financeiras.',
    area1Titulo: 'Juros Abusivos em Financiamentos',
    area1Texto: 'Redução expressiva de parcelas de veículos e imóveis com cobrança ilegal.',
    area2Titulo: 'Golpe do PIX e Fraudes Bancárias',
    area2Texto: 'Recuperação judicial de valores transferidos sob fraude ou falha do banco.',
    area3Titulo: 'Negativação Indevida',
    area3Texto: 'Retirada imediata do seu nome do Serasa/SPC e indenização por danos morais.',
    area4Titulo: 'Cartão de Crédito RMC / Consignado',
    area4Texto: 'Cancelamento de descontos automáticos abusivos em aposentadorias do INSS.',
    area5Titulo: 'Execuções de Dívidas e Penhoras',
    area5Texto: 'Defesa patrimonial para impedir bloqueios indevidos de contas e bens.',
    area6Titulo: 'Cobranças Coativas e Constrangedoras',
    area6Texto: 'Cessação imediata de ligações excessivas e ameaças de assessorias de cobrança.',

    // PROBLEMAS
    problemasEtiqueta: 'PROBLEMAS QUE RESOLVEMOS',
    problemasTitulo: 'Identificou alguma dessas situações?',
    problemasApoio: 'Se você passou por qualquer um desses abusos, tem direito legal de ser ressarcido com juros e correção monetária.',
    problema1Titulo: 'Parcela do carro que não para de subir',
    problema1Texto: 'Taxas embutidas indevidamente pelo banco sem seu consentimento.',
    problema2Titulo: 'Conta bloqueada ou dinheiro sumido',
    problema2Texto: 'Falhas de segurança em aplicativos bancários que causaram prejuízo.',
    problema3Titulo: 'Nome negativado por conta já paga',
    problema3Texto: 'Manutenção indevida nos órgãos de proteção ao crédito.',
    problema4Titulo: 'Desconto não autorizado na aposentadoria',
    problema4Texto: 'Empréstimos consignados fraudulentos descontados direto na folha.',
    problema5Titulo: 'Venda casada de seguros em empréstimos',
    problema5Texto: 'Seguros e tarifas adicionais cobrados de forma compulsória.',

    // DEPOIMENTOS
    depoimentosEtiqueta: 'CASOS REAIS',
    depoimentosTitulo: 'O que dizem os clientes que defendemos',
    depoimentosApoio: 'A confiança de quem recuperou a tranquilidade financeira com o nosso apoio.',
    depoimento1Nome: 'Carlos Eduardo Mendes — Empresário',
    depoimento1Texto: 'Consegui reduzir a parcela do meu caminhão em mais de R$ 1.200 por mês. Atendimento impecável e muito rápido!',
    depoimento2Nome: 'Mariana Silveira — Servidora Pública',
    depoimento2Texto: 'Sofri um golpe do PIX e o banco se recusava a estornar. O escritório entrou com ação e recuperou cada centavo.',
    depoimento3Nome: 'Roberto Alencar — Aposentado',
    depoimento3Texto: 'Havia um consignado descontando da minha aposentadoria que eu nunca pedi. Cancelaram e ainda recebi indenização.',
    depoimento4Nome: 'Ana Paula Rocha — Dentista',
    depoimento4Texto: 'Meu nome foi para o Serasa por uma conta quitada há 2 anos. Resolveram em menos de 10 dias com liminar!',
    depoimento5Nome: 'Fernando Dias — Comerciante',
    depoimento5Texto: 'Excelente trabalho na renegociação da dívida da minha empresa com o banco. Recomendo de olhos fechados.',
    depoimento6Nome: 'Juliana Costa — Arquiteta',
    depoimento6Texto: 'Muito profissionais, me mantiveram informada de cada andamento pelo WhatsApp. Gratidão!',
    depoimento7Nome: 'Marcos Vinícius — Engenheiro',
    depoimento7Texto: 'Eliminaram taxas abusivas no financiamento do meu apartamento. Trabalho sério e transparente.',

    // FAIXA DE CONTATO
    faixaContatoTitulo: 'Não perca mais dinheiro para o banco. Fale agora com nossa equipe!',
    faixaContatoBotao: 'Chamar no WhatsApp agora',

    // TIME
    timeEtiqueta: 'NOSSA EQUIPE',
    timeTitulo: 'Advogados especialistas em Direito Bancário',
    timeSubtitulo: 'Profissionais dedicados exclusivamente a proteger o seu patrimônio.',
    advogado1Nome: 'Dr. João Carlos',
    advogado1Cargo: 'Sócio-Fundador · OAB/RJ 142.500',
    advogado2Nome: 'Dra. Beatriz Fontana',
    advogado2Cargo: 'Especialista em Direito do Consumidor',
    advogado3Nome: 'Dr. Leonardo Mattos',
    advogado3Cargo: 'Especialista em Contratos Bancários',
    advogado4Nome: 'Dra. Camila Nogueira',
    advogado4Cargo: 'Responsável pelo Núcleo de Fraudes Digitais',
    socioAssinaturaNome: 'Dr. João Carlos',
    socioAssinaturaCargo: 'Advogado Titular'
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProject = () => {
    createProject(projectName, template.id);
    showToast(`Projeto "${projectName}" salvo com sucesso!`, 'success');
  };

  const handlePublishSite = () => {
    const slug = projectName
      .toLowerCase()
      .replace(/^site\s*—\s*/i, '')
      .replace(/[^a-z0-9]/g, '-');
    const liveUrl = `https://${slug}.fluxosite.com.br`;
    setPublishedLiveUrl(liveUrl);

    const proj = createProject(projectName, template.id);
    publishProject(proj.id, liveUrl);
    setShowPublishSuccessModal(true);
    showToast(`Site publicado com sucesso em: ${liveUrl}`, 'success');
  };

  // Focus and scroll to field when clicked in preview
  const scrollToField = (fieldId: string) => {
    setHighlightField(fieldId);
    setTimeout(() => setHighlightField(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          CABEÇALHO DA PÁGINA (Idêntico ao da imagem)
          ========================================================================= */}
      <div>
        <p className="text-[11px] font-bold text-[#fa2600] tracking-[0.25em] uppercase mb-1">
          SITE DO CLIENTE
        </p>
        <h1 className="font-display text-[26px] sm:text-[34px] leading-tight text-white font-bold">
          {projectName}
        </h1>
        <p className="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-[#929292]">
          Edite qualquer texto ou imagem clicando na prévia. Os dados da empresa já entram preenchidos; o design e as animações do modelo ficam preservados.
        </p>
      </div>

      {/* =========================================================================
          LAYOUT DIVIDIDO: EDITOR (Esquerda) E PRÉVIA INTERATIVA (Direita)
          ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            PAINEL DO FORMULÁRIO DE EDIÇÃO (Esquerda)
            ===================================================================== */}
        <div className="xl:col-span-5 2xl:col-span-4 bg-[#0c0d10] border border-[#232732] rounded-[20px] p-4 sm:p-5 shadow-2xl space-y-4">
          {/* Topo do Card com Nome do Modelo e Links de Navegação */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#1f222b]">
            <div className="text-xs text-gray-400">
              Modelo <strong className="text-white font-semibold">{template.name}</strong>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Trocar modelo"
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Trocar modelo</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('meus-projetos')}
                className="text-[11px] font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Ver meus projetos"
              >
                Projetos
              </button>
            </div>
          </div>

          {/* Nome do projeto */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nome do projeto (só para você)
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#14161d] border border-[#262a36] rounded-xl text-sm text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none transition-colors"
            />
          </div>

          {/* Seletor de Abas (Pills: Conteúdo, Textos, Imagens, Extras) */}
          <div className="flex items-center gap-1.5 p-1 bg-[#14161d] border border-[#232732] rounded-xl overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('conteudo')}
              className={`flex-1 min-w-[75px] py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'conteudo'
                  ? 'bg-gradient-to-r from-[#fa2600]/25 to-[#ff5500]/20 border border-[#fa2600] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Conteúdo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('textos')}
              className={`flex-1 min-w-[65px] py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'textos'
                  ? 'bg-gradient-to-r from-[#fa2600]/25 to-[#ff5500]/20 border border-[#fa2600] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Textos
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('imagens')}
              className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'imagens'
                  ? 'bg-gradient-to-r from-[#fa2600]/25 to-[#ff5500]/20 border border-[#fa2600] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Imagens
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('extras')}
              className={`flex-1 min-w-[65px] py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'extras'
                  ? 'bg-gradient-to-r from-[#fa2600]/25 to-[#ff5500]/20 border border-[#fa2600] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Extras
            </button>
          </div>

          {/* ===================================================================
              CONTEÚDO DAS ABAS (Scroll vertical amplo)
              =================================================================== */}
          <div className="space-y-5 max-h-[calc(100vh-360px)] overflow-y-auto pr-1">
            {/* ABA 1: CONTEÚDO */}
            {activeTab === 'conteudo' && (
              <>
                {/* IDENTIDADE */}
                <div className="space-y-3 pt-1">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    IDENTIDADE
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Nome do escritório
                    </label>
                    <input
                      type="text"
                      value={formData.escritorioNome}
                      onChange={(e) => updateField('escritorioNome', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Logo do escritório
                    </label>
                    <div className="flex gap-2 mb-1.5">
                      <label className="h-9 px-3 rounded-xl border border-[#282e3c] bg-[#1a1d26] text-xs font-medium text-gray-200 hover:text-white hover:border-[#fa2600] inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Enviar foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              updateField('logoUrl', url);
                              showToast('Logo atualizada com sucesso!', 'info');
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.logoUrl}
                        onChange={(e) => updateField('logoUrl', e.target.value)}
                        placeholder="ou cole um link https://"
                        className="w-full h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Envie do computador ou cole um link.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Cor principal (dourado)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.corPrincipal}
                        onChange={(e) => updateField('corPrincipal', e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={formData.corPrincipal}
                        onChange={(e) => updateField('corPrincipal', e.target.value)}
                        className="w-28 h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white font-mono focus:border-[#fa2600] focus:outline-none"
                      />
                      <div className="flex gap-1.5">
                        {['#D4AF37', '#fa2600', '#2563EB', '#10B981', '#9333EA'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => updateField('corPrincipal', c)}
                            className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-110 cursor-pointer"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOPO DA PÁGINA */}
                <div className="space-y-3 pt-3 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    TOPO DA PÁGINA
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Título principal (hero)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.heroTitulo}
                      onChange={(e) => updateField('heroTitulo', e.target.value)}
                      className="w-full p-2.5 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Descrição (hero)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.heroDescricao}
                      onChange={(e) => updateField('heroDescricao', e.target.value)}
                      className="w-full p-2.5 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Foto de fundo do topo (horizontal)
                    </label>
                    <div className="flex gap-2 mb-1">
                      <label className="h-9 px-3 rounded-xl border border-[#282e3c] bg-[#1a1d26] text-xs font-medium text-gray-200 hover:text-white hover:border-[#fa2600] inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Enviar foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              updateField('heroFotoFundo', URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.heroFotoFundo}
                        onChange={(e) => updateField('heroFotoFundo', e.target.value)}
                        placeholder="ou cole um link https://"
                        className="w-full h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Envie do computador ou cole um link.
                    </p>
                  </div>
                </div>

                {/* SOBRE */}
                <div className="space-y-3 pt-3 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    SOBRE
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Sobre: etiqueta
                    </label>
                    <input
                      type="text"
                      value={formData.sobreEtiqueta}
                      onChange={(e) => updateField('sobreEtiqueta', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Sobre: título
                    </label>
                    <input
                      type="text"
                      value={formData.sobreTitulo}
                      onChange={(e) => updateField('sobreTitulo', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Sobre: texto
                    </label>
                    <textarea
                      rows={3}
                      value={formData.sobreTexto}
                      onChange={(e) => updateField('sobreTexto', e.target.value)}
                      className="w-full p-2.5 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Sobre: foto
                    </label>
                    <div className="flex gap-2 mb-1">
                      <label className="h-9 px-3 rounded-xl border border-[#282e3c] bg-[#1a1d26] text-xs font-medium text-gray-200 hover:text-white hover:border-[#fa2600] inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Enviar foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              updateField('sobreFoto', URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                      </label>
                      <input
                        type="text"
                        value={formData.sobreFoto}
                        onChange={(e) => updateField('sobreFoto', e.target.value)}
                        placeholder="ou cole um link https://"
                        className="w-full h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white placeholder-gray-500 focus:border-[#fa2600] focus:outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Envie do computador ou cole um link.
                    </p>
                  </div>
                </div>

                {/* CONTATO E LOCALIZAÇÃO */}
                <div className="space-y-3 pt-3 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    CONTATO E LOCALIZAÇÃO
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={formData.telefone}
                        onChange={(e) => updateField('telefone', e.target.value)}
                        className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        WhatsApp (com DDD)
                      </label>
                      <input
                        type="text"
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                        className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={formData.endereco}
                      onChange={(e) => updateField('endereco', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Horário de atendimento
                    </label>
                    <input
                      type="text"
                      value={formData.horario}
                      onChange={(e) => updateField('horario', e.target.value)}
                      className="w-full h-10 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ABA 2: TEXTOS */}
            {activeTab === 'textos' && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Título da aba do navegador
                  </label>
                  <input
                    type="text"
                    value={formData.abaNavegador}
                    onChange={(e) => updateField('abaNavegador', e.target.value)}
                    className="w-full h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Texto do botão (hero)
                  </label>
                  <input
                    type="text"
                    value={formData.heroBotaoTexto}
                    onChange={(e) => updateField('heroBotaoTexto', e.target.value)}
                    className="w-full h-9 px-3 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                  />
                </div>

                {/* FAIXA DE SERVIÇOS */}
                <div className="space-y-2 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    FAIXA DE SERVIÇOS
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.faixaServico1}
                      onChange={(e) => updateField('faixaServico1', e.target.value)}
                      placeholder="Faixa 1"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={formData.faixaServico2}
                      onChange={(e) => updateField('faixaServico2', e.target.value)}
                      placeholder="Faixa 2"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={formData.faixaServico3}
                      onChange={(e) => updateField('faixaServico3', e.target.value)}
                      placeholder="Faixa 3"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={formData.faixaServico4}
                      onChange={(e) => updateField('faixaServico4', e.target.value)}
                      placeholder="Faixa 4"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* CHAMADA CENTRAL */}
                <div className="space-y-2 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    CHAMADA CENTRAL
                  </p>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.chamadaCentralTitulo}
                      onChange={(e) => updateField('chamadaCentralTitulo', e.target.value)}
                      className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Texto do botão</label>
                    <input
                      type="text"
                      value={formData.chamadaCentralBotao}
                      onChange={(e) => updateField('chamadaCentralBotao', e.target.value)}
                      className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* PILARES */}
                <div className="space-y-3 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    PILARES
                  </p>
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="p-2.5 bg-[#14161d]/60 rounded-xl border border-[#262a36]/60 space-y-1.5">
                      <label className="block text-[11px] font-semibold text-gray-300">Pilar {num}</label>
                      <input
                        type="text"
                        value={(formData as any)[`pilar${num}Titulo`]}
                        onChange={(e) => updateField(`pilar${num}Titulo` as any, e.target.value)}
                        placeholder={`Pilar ${num}: título`}
                        className="w-full h-8 px-2.5 bg-[#101217] border border-[#242833] rounded-lg text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        value={(formData as any)[`pilar${num}Texto`]}
                        onChange={(e) => updateField(`pilar${num}Texto` as any, e.target.value)}
                        placeholder={`Pilar ${num}: texto`}
                        className="w-full p-2 bg-[#101217] border border-[#242833] rounded-lg text-xs text-white"
                      />
                    </div>
                  ))}
                </div>

                {/* ÁREAS DE ATUAÇÃO */}
                <div className="space-y-3 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    ÁREAS DE ATUAÇÃO
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.areasEtiqueta}
                      onChange={(e) => updateField('areasEtiqueta', e.target.value)}
                      placeholder="Áreas: etiqueta"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={formData.areasTitulo}
                      onChange={(e) => updateField('areasTitulo', e.target.value)}
                      placeholder="Áreas: título"
                      className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                    />
                  </div>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} className="p-2 bg-[#14161d]/60 rounded-lg border border-[#262a36]/60 space-y-1">
                      <input
                        type="text"
                        value={(formData as any)[`area${num}Titulo`]}
                        onChange={(e) => updateField(`area${num}Titulo` as any, e.target.value)}
                        placeholder={`Área ${num}: título`}
                        className="w-full h-7 px-2 bg-[#101217] border border-[#242833] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={(formData as any)[`area${num}Texto`]}
                        onChange={(e) => updateField(`area${num}Texto` as any, e.target.value)}
                        placeholder={`Área ${num}: texto`}
                        className="w-full h-7 px-2 bg-[#101217] border border-[#242833] rounded text-xs text-gray-300"
                      />
                    </div>
                  ))}
                </div>

                {/* PROBLEMAS */}
                <div className="space-y-3 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    PROBLEMAS QUE RESOLVEMOS
                  </p>
                  <input
                    type="text"
                    value={formData.problemasTitulo}
                    onChange={(e) => updateField('problemasTitulo', e.target.value)}
                    placeholder="Problemas: título"
                    className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                  />
                  <textarea
                    rows={2}
                    value={formData.problemasApoio}
                    onChange={(e) => updateField('problemasApoio', e.target.value)}
                    placeholder="Problemas: texto de apoio"
                    className="w-full p-2 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                  />
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="p-2 bg-[#14161d]/60 rounded-lg border border-[#262a36]/60 space-y-1">
                      <input
                        type="text"
                        value={(formData as any)[`problema${num}Titulo`]}
                        onChange={(e) => updateField(`problema${num}Titulo` as any, e.target.value)}
                        placeholder={`Problema ${num}: título`}
                        className="w-full h-7 px-2 bg-[#101217] border border-[#242833] rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        value={(formData as any)[`problema${num}Texto`]}
                        onChange={(e) => updateField(`problema${num}Texto` as any, e.target.value)}
                        placeholder={`Problema ${num}: texto`}
                        className="w-full h-7 px-2 bg-[#101217] border border-[#242833] rounded text-xs text-gray-300"
                      />
                    </div>
                  ))}
                </div>

                {/* TIME E ADVOGADOS */}
                <div className="space-y-3 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    EQUIPE / PROFISSIONAIS
                  </p>
                  <input
                    type="text"
                    value={formData.timeTitulo}
                    onChange={(e) => updateField('timeTitulo', e.target.value)}
                    placeholder="Time: título"
                    className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                  />
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={(formData as any)[`advogado${num}Nome`]}
                        onChange={(e) => updateField(`advogado${num}Nome` as any, e.target.value)}
                        placeholder={`Advogado ${num}: nome`}
                        className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                      />
                      <input
                        type="text"
                        value={(formData as any)[`advogado${num}Cargo`]}
                        onChange={(e) => updateField(`advogado${num}Cargo` as any, e.target.value)}
                        placeholder={`Advogado ${num}: cargo`}
                        className="h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 3: IMAGENS */}
            {activeTab === 'imagens' && (
              <div className="space-y-4 pt-1">
                {/* VÍDEO DO TOPO */}
                <div className="p-3 bg-[#14161d] border border-[#262a36] rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-gray-300">
                    Vídeo do topo (opcional, no lugar das fotos)
                  </label>
                  <label className="h-9 px-3 rounded-xl border border-[#282e3c] bg-[#1a1d26] text-xs font-medium text-gray-200 hover:text-white hover:border-[#fa2600] inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Enviar vídeo</span>
                    <input type="file" accept="video/mp4,video/webm" className="hidden" />
                  </label>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    MP4 ou WebM de até 60 MB (o ideal é 10 a 30 segundos, sem som). Vazio = vídeo do modelo.
                  </p>
                </div>

                {/* FOTOS DE FUNDO ADICIONAIS */}
                <div className="space-y-2 pt-2 border-t border-[#1f222b]">
                  <label className="block text-xs font-semibold text-gray-300">
                    Foto de fundo do topo 2 (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.fotoFundo2}
                    onChange={(e) => updateField('fotoFundo2', e.target.value)}
                    placeholder="Cole um link https://"
                    className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                  />
                  <label className="block text-xs font-semibold text-gray-300 pt-1">
                    Foto de fundo do topo 3 (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.fotoFundo3}
                    onChange={(e) => updateField('fotoFundo3', e.target.value)}
                    placeholder="Cole um link https://"
                    className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                  />
                </div>

                {/* FOTOS DOS ADVOGADOS */}
                <div className="space-y-2.5 pt-2 border-t border-[#1f222b]">
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                    FOTOS DOS ADVOGADOS (1 A 4)
                  </p>
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="space-y-1">
                      <label className="block text-[11px] text-gray-400">Advogado {num}: foto</label>
                      <input
                        type="text"
                        value={(formData as any)[`advogado${num}Foto`]}
                        onChange={(e) => updateField(`advogado${num}Foto` as any, e.target.value)}
                        className="w-full h-8 px-2.5 bg-[#14161d] border border-[#262a36] rounded-lg text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 4: EXTRAS */}
            {activeTab === 'extras' && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Script no cabeçalho (&lt;head&gt;)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="<!-- Cole aqui scripts como Google Tag Manager ou Pixel do Meta -->"
                    className="w-full p-2.5 bg-[#14161d] border border-[#262a36] rounded-xl text-xs font-mono text-gray-300 focus:border-[#fa2600] focus:outline-none"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">
                    Carregado diretamente na página publicada do site.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Meta Descrição SEO (Google)
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="Escritório de advocacia especialista em Direito Bancário e Defesa do Consumidor. Fale com um advogado pelo WhatsApp."
                    className="w-full p-2.5 bg-[#14161d] border border-[#262a36] rounded-xl text-xs text-white focus:border-[#fa2600] focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dica da Prévia */}
          <div className="pt-2 border-t border-[#1f222b] text-[11px] text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#fa2600] shrink-0" />
            <span>Qualquer outro texto ou imagem da página: clique direto na prévia ao lado para editar.</span>
          </div>

          {/* Botões de Ação no Rodapé do Editor */}
          <div className="pt-3 border-t border-[#1f222b] flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveProject}
              className="flex-1 h-11 rounded-full border border-[#2b303c] bg-[#161820] hover:bg-[#202430] text-gray-200 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>

            <button
              type="button"
              onClick={handlePublishSite}
              className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#fa2600] to-[#ff5500] hover:from-[#e02200] hover:to-[#ea4e00] text-white font-bold text-xs uppercase tracking-wider shadow-[0_4px_24px_rgba(250,38,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Publicar site</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            PRÉVIA INTERATIVA AO VIVO DO SITE (Direita)
            ===================================================================== */}
        <div className="xl:col-span-7 2xl:col-span-8 space-y-3 sticky top-4">
          {/* Barra Superior da Prévia */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0c0d10] border border-[#232732] rounded-xl">
            {/* Atalho ligado */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#fa2600]/40 bg-[#fa2600]/10 text-[11px] font-semibold text-[#ff7f5f]">
              <Sparkles className="w-3 h-3 text-[#fa2600]" />
              <span>Atalho ligado: clique na página para editar ou ocultar</span>
            </div>

            {/* Alternador Desktop / Mobile */}
            <div className="flex items-center gap-1 bg-[#14161d] p-1 rounded-lg border border-[#262a36]">
              <button
                type="button"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceView === 'desktop'
                    ? 'bg-[#252936] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Visualização Computador"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  deviceView === 'mobile'
                    ? 'bg-[#252936] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Visualização Celular"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Canvas da Prévia (Container com Scroll e Mockup) */}
          <div
            className={`transition-all duration-300 mx-auto ${
              deviceView === 'mobile'
                ? 'max-w-[390px] h-[740px] rounded-[36px] border-[8px] border-[#1e222b] shadow-2xl overflow-hidden bg-black'
                : 'w-full h-[calc(100vh-180px)] rounded-[20px] border border-[#232732] shadow-2xl overflow-hidden bg-black'
            }`}
          >
            {/* Barra de endereço simulada no Desktop */}
            {deviceView === 'desktop' && (
              <div className="h-8 px-4 bg-[#12141a] border-b border-[#202430] flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block"></span>
                </div>
                <span className="font-mono text-[11px] text-gray-400 truncate max-w-xs">
                  https://{projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.fluxosite.com.br
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">SSL Seguro</span>
              </div>
            )}

            {/* Conteúdo Renderizado da Landing Page com Edição ao Vivo */}
            <div className="w-full h-full overflow-y-auto scrollbar-thin bg-[#090a0f] text-gray-100 font-sans">
              {/* Barra de Navegação do Site */}
              <header className="sticky top-0 z-30 px-6 py-4 bg-[#090a0f]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
                <div
                  onClick={() => scrollToField('escritorioNome')}
                  className="flex items-center gap-2 cursor-pointer group"
                  title="Clique para editar o nome"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-black"
                    style={{ backgroundColor: formData.corPrincipal }}
                  >
                    ⚖️
                  </div>
                  <span className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                    {formData.escritorioNome}
                  </span>
                </div>

                <div className="hidden md:flex items-center gap-5 text-xs text-gray-300">
                  <a href="#sobre" className="hover:text-white">Sobre</a>
                  <a href="#areas" className="hover:text-white">Áreas de Atuação</a>
                  <a href="#problemas" className="hover:text-white">Problemas</a>
                  <a href="#depoimentos" className="hover:text-white">Depoimentos</a>
                  <a href="#contato" className="hover:text-white">Contato</a>
                </div>

                <a
                  href={`https://wa.me/55${formData.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full font-bold text-xs text-black shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: formData.corPrincipal }}
                >
                  Falar no WhatsApp
                </a>
              </header>

              {/* SEÇÃO HERO DO SITE */}
              <section className="relative px-6 py-20 text-center overflow-hidden">
                {/* Background Image / Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25"
                  style={{ backgroundImage: `url(${formData.heroFotoFundo})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090a0f]/80 to-[#090a0f]" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-5">
                  <div
                    className="inline-block px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md"
                    style={{ borderColor: formData.corPrincipal, color: formData.corPrincipal }}
                  >
                    EQUAL JUSTICE UNDER LAW
                  </div>

                  <h1
                    onClick={() => scrollToField('heroTitulo')}
                    className="text-3xl sm:text-5xl font-extrabold text-white leading-tight cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded p-1 transition-all"
                    title="Clique para editar o título principal"
                  >
                    {formData.heroTitulo}
                  </h1>

                  <p
                    onClick={() => scrollToField('heroDescricao')}
                    className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-amber-400/80 rounded p-1"
                    title="Clique para editar a descrição"
                  >
                    {formData.heroDescricao}
                  </p>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/55${formData.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
                      style={{ backgroundColor: formData.corPrincipal }}
                    >
                      {formData.heroBotaoTexto}
                    </a>
                    <a
                      href="#contato"
                      className="px-6 py-3.5 rounded-full font-semibold text-xs border border-white/20 text-white hover:bg-white/10 transition-colors"
                    >
                      Conhecer o Escritório
                    </a>
                  </div>
                </div>
              </section>

              {/* FAIXA DE SERVIÇOS EM DESTAQUE */}
              <section className="border-y border-white/10 bg-[#10121a] py-4 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold text-gray-300">
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.faixaServico1}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.faixaServico2}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.faixaServico3}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{formData.faixaServico4}</span>
                  </div>
                </div>
              </section>

              {/* SEÇÃO SOBRE NÓS */}
              <section id="sobre" className="px-6 py-16 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: formData.corPrincipal }}
                    >
                      {formData.sobreEtiqueta}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {formData.sobreTitulo}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {formData.sobreTexto}
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="block text-xl font-bold text-white">15+</span>
                        <span className="text-[10px] text-gray-400">Anos de atuação</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="block text-xl font-bold text-white">3.400+</span>
                        <span className="text-[10px] text-gray-400">Casos defendidos</span>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <span className="block text-xl font-bold text-white">94%</span>
                        <span className="text-[10px] text-gray-400">Taxa de êxito</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl aspect-[4/3]">
                    <img
                      src={formData.sobreFoto}
                      alt="Sobre"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* SEÇÃO ÁREAS DE ATUAÇÃO */}
              <section id="areas" className="px-6 py-16 bg-[#0f1118] border-t border-white/10">
                <div className="max-w-5xl mx-auto text-center space-y-3 mb-10">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: formData.corPrincipal }}
                  >
                    {formData.areasEtiqueta}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formData.areasTitulo}
                  </h2>
                  <p className="text-xs text-gray-400 max-w-xl mx-auto">
                    {formData.areasTexto}
                  </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className="p-5 bg-black/40 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-2 text-left"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: `${formData.corPrincipal}25`, color: formData.corPrincipal }}
                      >
                        0{num}
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {(formData as any)[`area${num}Titulo`]}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {(formData as any)[`area${num}Texto`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEÇÃO PROBLEMAS QUE RESOLVEMOS */}
              <section id="problemas" className="px-6 py-16 max-w-5xl mx-auto">
                <div className="text-center space-y-3 mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formData.problemasTitulo}
                  </h2>
                  <p className="text-xs text-gray-400 max-w-xl mx-auto">
                    {formData.problemasApoio}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div
                      key={num}
                      className="p-4 bg-white/[0.03] rounded-xl border border-white/10 space-y-2 text-left"
                    >
                      <h4 className="text-xs font-bold text-amber-300">
                        ⚠️ {(formData as any)[`problema${num}Titulo`]}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {(formData as any)[`problema${num}Texto`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEÇÃO DEPOIMENTOS */}
              <section id="depoimentos" className="px-6 py-16 bg-[#0f1118] border-t border-white/10">
                <div className="max-w-5xl mx-auto text-center space-y-3 mb-10">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: formData.corPrincipal }}
                  >
                    {formData.depoimentosEtiqueta}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    {formData.depoimentosTitulo}
                  </h2>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div
                      key={num}
                      className="p-5 bg-black/50 rounded-2xl border border-white/10 space-y-2.5 text-left"
                    >
                      <div className="text-amber-400 text-xs">★★★★★</div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{(formData as any)[`depoimento${num}Texto`]}"
                      </p>
                      <p className="text-[11px] font-bold text-white pt-1">
                        {(formData as any)[`depoimento${num}Nome`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SEÇÃO EQUIPE */}
              <section className="px-6 py-16 max-w-5xl mx-auto text-center space-y-8">
                <div>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: formData.corPrincipal }}
                  >
                    {formData.timeEtiqueta}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {formData.timeTitulo}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">{formData.timeSubtitulo}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="space-y-2">
                      <div className="aspect-square rounded-2xl overflow-hidden border border-white/15 bg-white/5">
                        <img
                          src={(formData as any)[`advogado${num}Foto`]}
                          alt="Advogado"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-xs font-bold text-white">
                        {(formData as any)[`advogado${num}Nome`]}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {(formData as any)[`advogado${num}Cargo`]}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* RODAPÉ DO SITE COM CONTATOS */}
              <footer id="contato" className="px-6 py-12 bg-black border-t border-white/15 text-xs text-gray-400">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                  <div className="space-y-2">
                    <h3 className="font-bold text-white text-sm">{formData.escritorioNome}</h3>
                    <p className="text-gray-400 text-xs">{formData.endereco}</p>
                    <p className="text-gray-500 text-[11px]">{formData.horario}</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-semibold text-white">Canais de Atendimento</p>
                    <p>Telefone: {formData.telefone}</p>
                    <p>WhatsApp: +55 {formData.whatsapp}</p>
                    <p>E-mail: {formData.email}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-white">Atendimento Imediato</p>
                    <a
                      href={`https://wa.me/55${formData.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block px-4 py-2 rounded-xl text-black font-bold text-xs"
                      style={{ backgroundColor: formData.corPrincipal }}
                    >
                      Conversar no WhatsApp
                    </a>
                  </div>
                </div>

                <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-white/10 text-center text-[10px] text-gray-500">
                  © {new Date().getFullYear()} {formData.escritorioNome} · Todos os direitos reservados.
                </div>
              </footer>

              {/* Botão de WhatsApp Flutuante com Pulso Animado */}
              <a
                href={`https://wa.me/55${formData.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs shadow-2xl hover:scale-110 transition-transform"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL DE SUCESSO: SITE PUBLICADO COM SUCESSO!
          ========================================================================= */}
      {showPublishSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e1014] border border-[#232733] rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Parabéns! Site Publicado!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Seu site profissional está no ar com todas as animações, textos e imagens personalizadas.
              </p>
            </div>

            <div className="p-3 bg-[#14161d] rounded-xl border border-[#232733] text-xs font-mono text-emerald-400 break-all select-all">
              {publishedLiveUrl}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={publishedLiveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-11 rounded-full bg-gradient-to-r from-[#fa2600] to-[#ff5500] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Site</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowPublishSuccessModal(false);
                  onNavigate('sites-publicados');
                }}
                className="flex-1 h-11 rounded-full border border-[#2b303c] bg-[#161820] text-gray-200 hover:text-white font-medium text-xs cursor-pointer"
              >
                Ver Sites Publicados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
