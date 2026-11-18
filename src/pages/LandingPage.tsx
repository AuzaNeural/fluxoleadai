import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Star,
  Layers,
  Bot,
  Users,
  Globe
} from 'lucide-react';
import templatesData from '../data/templates.json';

interface LandingPageProps {
  onLogin: () => void;
  onExploreTemplates?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onExploreTemplates }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Preciso saber programar ou entender de design?',
      a: 'Não. Você escolhe um modelo pronto, a IA adapta o texto e as cores pro negócio do seu cliente, e você ajusta o que quiser no editor visual — clicando, sem escrever uma linha de código.'
    },
    {
      q: 'Como a IA adapta o site pro meu cliente?',
      a: 'Você preenche algumas informações sobre a empresa (nome, o que ela faz, tom de voz) e a IA reescreve todos os textos do modelo pra combinar com esse negócio — título, descrição, botões, tudo. As cores também se ajustam à marca do cliente.'
    },
    {
      q: 'Posso publicar com o domínio do meu cliente, ou só com um link da Fluxo Lead?',
      a: 'As duas opções. Dá pra publicar com um link próprio da Fluxo Lead (rápido, pra mostrar pro cliente na hora) ou baixar o site completo e subir na hospedagem/domínio do próprio cliente — aí o site nem depende mais da Fluxo Lead.'
    },
    {
      q: 'Como funciona o "Achar Clientes"?',
      a: 'Você digita uma região e um nicho (ex.: "dentista em Florianópolis"), e o app busca empresas reais que ainda não têm site, já com telefone, endereço e um botão que abre o WhatsApp com uma mensagem de abordagem pronta pra mandar.'
    },
    {
      q: 'Preciso pagar alguma mensalidade além do plano?',
      a: 'Não. Você paga só o plano escolhido (mensal ou anual), com valor fixo e sem taxa extra por site publicado.'
    },
    {
      q: 'Funciona pra qualquer tipo de negócio ou nicho?',
      a: 'Sim. Tem modelos pra tecnologia, saúde, advocacia, educação, imobiliária, fitness e outros — e a IA adapta qualquer um deles pro nicho específico do seu cliente.'
    }
  ];

  const featuredTemplates = (templatesData || []).slice(0, 8);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#fa2600] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Glow Superior */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(250,38,0,0.18),transparent_75%)] z-0"></div>

      {/* Arco de luz no topo */}
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(1400px,160vw)] -translate-x-1/2 opacity-90 z-0">
        <img
          src="/brand/arc.png"
          alt="Fluxo Lead Glow"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/75 border-b border-white/[0.08] transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className="h-7 w-auto object-contain cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>

          <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-neutral-300">
            <button
              onClick={() => scrollToSection('como-funciona')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection('modelos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Modelos
            </button>
            <button
              onClick={() => scrollToSection('depoimentos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Depoimentos
            </button>
            <button
              onClick={() => scrollToSection('valor')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Planos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Perguntas Frequentes
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="h-9 px-4 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <button
              onClick={() => scrollToSection('valor')}
              className="fx-btn-primary h-9 px-5 rounded-full text-xs font-bold uppercase tracking-wider text-white cursor-pointer shadow-[0_0_20px_rgba(250,38,0,0.35)]"
            >
              Quero vender sites
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#fa2600]/40 bg-[#fa2600]/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#fa2600] mb-6 animate-pulse">
          <Sparkles className="size-3.5" />
          <span>FLUXO LEAD</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
          A única ferramenta que você precisa para <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#ff7c5c] to-[#fa2600]">vender sites com IA</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Encontre empresas por nicho e cidade, veja quem não informa site, organize os contatos num CRM e entregue sites a partir de modelos profissionais em minutos.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('valor')}
            className="fx-btn-primary w-full sm:w-auto h-12 px-8 rounded-full text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(250,38,0,0.45)] hover:scale-105 transition-transform flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Quero vender sites agora</span>
            <ArrowRight className="size-4" />
          </button>

          <button
            onClick={() => {
              if (onExploreTemplates) {
                onExploreTemplates();
              } else {
                scrollToSection('modelos');
              }
            }}
            className="w-full sm:w-auto h-12 px-8 rounded-full text-sm font-semibold border border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Conhecer 66+ Modelos</span>
          </button>
        </div>

        {/* Badges de Confiança */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#fa2600]" />
            <span>Sem precisar programar</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#fa2600]" />
            <span>Prospecção real de clientes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#fa2600]" />
            <span>Editor visual com IA</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-[#fa2600]" />
            <span>Publicação instantânea</span>
          </div>
        </div>

        {/* Prévia Visual do Sistema */}
        <div className="mt-14 relative rounded-2xl border border-white/10 bg-[#0e0e11]/80 p-2 sm:p-3 shadow-[0_20px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(250,38,0,0.12)]">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/[0.06] bg-[#0c0d10] flex items-center justify-center">
            <img
              src="/templates/template-1.jpg"
              alt="Fluxo Lead Plataforma"
              className="size-full object-cover object-top opacity-95 hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-6">
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#fa2600] bg-[#fa2600]/15 px-3 py-1 rounded-full border border-[#fa2600]/30">
                  Pronto para Vender
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-2">
                  Advocacia Premium — Direito Bancário
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  Hero slideshow, áreas de atuação, calculadora e WhatsApp integrado
                </p>
              </div>
              <button
                onClick={onLogin}
                className="hidden sm:inline-flex h-9 px-4 rounded-full bg-white text-black font-semibold text-xs items-center gap-1.5 hover:bg-neutral-200 transition-colors"
              >
                <span>Usar Modelo</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO MODELOS ("FEITAS A MÃO, REALMENTE PREMIUM") */}
      <section id="modelos" className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            FEITAS A MÃO, REALMENTE PREMIUM
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Uma estrutura que realmente converte pode mudar seu jogo
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Mais de 66 templates ultra profissionais nos nichos mais lucrativos do Brasil.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group relative flex flex-col rounded-2xl border border-white/10 bg-[#0d0e12] p-3 transition-all hover:border-[#fa2600]/50 hover:shadow-[0_0_30px_rgba(250,38,0,0.15)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#14151a]">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.name}
                  className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col pt-3.5 pb-1 px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fa2600]">
                  [ {tmpl.category} ]
                </span>
                <h4 className="mt-1 text-base font-bold text-white leading-tight">
                  {tmpl.name}
                </h4>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-400 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-medium">100% Editável</span>
                  <button
                    onClick={onLogin}
                    className="text-xs font-semibold text-[#fa2600] hover:text-[#ff6a3d] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Editar com IA</span>
                    <ArrowRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (onExploreTemplates) onExploreTemplates();
              else onLogin();
            }}
            className="inline-flex h-11 px-7 rounded-full border border-white/20 bg-white/[0.04] text-xs font-bold uppercase tracking-wider text-white hover:bg-white/[0.08] hover:border-white/40 transition-all cursor-pointer items-center gap-2"
          >
            <span>Ver Todos os 66 Modelos</span>
            <ArrowRight className="size-4 text-[#fa2600]" />
          </button>
        </div>
      </section>

      {/* COMO FUNCIONA / RECURSOS ("Um app, o negócio inteiro") */}
      <section id="como-funciona" className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            PROCESSO COMPLETO
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Um app, o negócio inteiro
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Da prospecção do cliente à entrega do site pronto, tudo sem sair da Fluxo Lead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-[#fa2600]/15 border border-[#fa2600]/30 flex items-center justify-center text-[#fa2600] mb-5">
                <Search className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Ache o cliente rápido</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Encontre estabelecimentos comerciais por nicho e cidade. O sistema mostra quem ainda não tem site, telefone verificado e link direto para abrir o WhatsApp.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Google Maps e bases reais</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Filtro de empresas sem site</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Abordagem pronta para WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-[#fa2600]/15 border border-[#fa2600]/30 flex items-center justify-center text-[#fa2600] mb-5">
                <Bot className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Adapte com IA em minutos</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                A IA reescreve textos, títulos, áreas de atuação e ajusta a paleta de cores para a identidade da empresa do cliente. O visual fica impecável sem desenhar.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Editor visual com live preview</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Visualização desktop e mobile</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Upload de logo e imagens locais</span>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-7 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="size-12 rounded-xl bg-[#fa2600]/15 border border-[#fa2600]/30 flex items-center justify-center text-[#fa2600] mb-5">
                <Globe className="size-6" />
              </div>
              <h3 className="text-xl font-bold text-white">3. Publique ou Exporte</h3>
              <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
                Publique na hora com um link seguro da Fluxo Lead para fechar a venda, ou conecte o domínio próprio do cliente. Liberdade total sem amarras.
              </p>
            </div>
            <ul className="mt-6 space-y-2 text-xs text-neutral-300 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Publicação com 1 clique</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Carregamento ultrarrápido (&lt; 3s)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-[#fa2600]" />
                <span>Domínio personalizado incluso</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS E NOTIFICAÇÕES ("O que os clientes falaram") */}
      <section id="depoimentos" className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            RESULTADOS REAIS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            O que os clientes falaram quando receberam o site
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Depoimentos espontâneos de quem vendeu sites no mesmo dia usando a Fluxo Lead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-6 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#fa2600] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed italic">
                "Fechei meu primeiro cliente de odontologia por R$ 1.800 em menos de 2 horas. Usei o modelo da Decare, a IA gerou os textos e o cliente aceitou na primeira prévia."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#fa2600]/20 text-[#fa2600] font-bold flex items-center justify-center text-xs">
                RM
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rodrigo Mendes</p>
                <p className="text-[11px] text-neutral-400">São Paulo, SP</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-6 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#fa2600] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed italic">
                "A ferramenta de buscar empresas é surreal. Achei 40 barbearias na minha região sem site. Mandei a mensagem no WhatsApp e 3 fecharam na mesma semana."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#fa2600]/20 text-[#fa2600] font-bold flex items-center justify-center text-xs">
                LS
              </div>
              <div>
                <p className="text-xs font-bold text-white">Lucas Silva</p>
                <p className="text-[11px] text-neutral-400">Curitiba, PR</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] p-6 flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#fa2600] mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed italic">
                "Não entendia nada de programação nem Elementor. Com a Fluxo Lead eu só preenchi os campos e cliquei em publicar. Site responsivo, rápido e lindo."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#fa2600]/20 text-[#fa2600] font-bold flex items-center justify-center text-xs">
                CP
              </div>
              <div>
                <p className="text-xs font-bold text-white">Camila Pinheiro</p>
                <p className="text-[11px] text-neutral-400">Belo Horizonte, MG</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS E PREÇOS (#valor) */}
      <section id="valor" className="relative z-10 py-24 px-4 max-w-5xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            ACESSO IMEDIATO
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Escolha seu plano e comece a faturar hoje
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Acesso completo a todas as ferramentas, busca de empresas, 66+ templates e editor com IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Plano Mensal */}
          <div className="relative rounded-3xl border border-white/10 bg-[#0d0e12] p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Fluxo Lead Mensal</h3>
                  <p className="text-xs text-neutral-400 mt-1">Acesso Completo Mensal</p>
                </div>
                <span className="rounded-full bg-white/[0.08] px-3 py-1 text-[11px] font-semibold text-neutral-300">
                  Sem Fidelidade
                </span>
              </div>

              <div className="mt-6 mb-8">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block">Assinatura de</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-bold text-neutral-400">R$</span>
                  <span className="text-5xl font-extrabold text-white tracking-tight">197</span>
                  <span className="text-sm text-neutral-400">/ mês</span>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Busca de empresas sem site</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Todos os 66+ modelos profissionais</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Editor visual com IA integrada</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>CRM de gestão de leads</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Vendedor IA para abordagens</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Publicação de sites ilimitada</span>
                </li>
              </ul>
            </div>

            <div className="mt-9">
              <button
                onClick={onLogin}
                className="w-full h-12 rounded-full border border-white/20 bg-white/[0.06] text-xs font-bold uppercase tracking-wider text-white hover:bg-white/[0.12] transition-colors cursor-pointer"
              >
                Assinar mensal
              </button>
            </div>
          </div>

          {/* Plano Anual (Destaque) */}
          <div className="relative rounded-3xl border-2 border-[#fa2600] bg-[#111218] p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(250,38,0,0.25)]">
            <div className="absolute -top-3.5 right-8 rounded-full bg-[#fa2600] px-4 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
              MELHOR VALOR (ECONOMIA DE 87%)
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Fluxo Lead Anual</h3>
                  <p className="text-xs text-[#fa2600] font-medium mt-1">Acesso Imediato + Todos os Bônus</p>
                </div>
              </div>

              <div className="mt-6 mb-8">
                <span className="text-xs text-neutral-400 line-through block">De R$ 2.364 por ano</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-sm font-semibold text-neutral-400">12x de</span>
                  <span className="text-2xl font-bold text-white">R$</span>
                  <span className="text-5xl font-extrabold text-white tracking-tight">30,68</span>
                </div>
                <span className="text-xs text-[#fa2600] font-bold mt-1 block">ou apenas R$ 297 à vista</span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-neutral-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span className="font-semibold text-white">Tudo do plano mensal incluso</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Acesso garantido por 12 meses</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Novos templates semanais adicionados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Scripts de fechamento de alta conversão</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#fa2600] shrink-0" />
                  <span>Garantia incondicional de 7 dias</span>
                </li>
              </ul>
            </div>

            <div className="mt-9">
              <button
                onClick={onLogin}
                className="fx-btn-primary w-full h-12 rounded-full text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(250,38,0,0.5)] hover:scale-102 transition-transform cursor-pointer"
              >
                Garantir plano anual agora
              </button>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <ShieldCheck className="size-10 text-[#fa2600] shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">Garantia Incondicional de 7 Dias</h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Teste a plataforma, busque empresas e monte sites. Se não ficar 100% satisfeito, devolvemos seu dinheiro integralmente, sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="relative z-10 py-20 px-4 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            TIRE SUAS DÚVIDAS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base">
            Tudo o que você precisa saber sobre a plataforma e modelo de negócio.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#fa2600]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.06] pt-3.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 py-20 px-4 text-center border-t border-white/[0.08] bg-gradient-to-b from-transparent to-[#fa2600]/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Comece a prospectar e vender hoje mesmo
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Junte-se a centenas de agências e empreendedores que vendem sites profissionais com a maior margem do mercado.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('valor')}
              className="fx-btn-primary w-full sm:w-auto h-12 px-8 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(250,38,0,0.5)] cursor-pointer"
            >
              Começar agora
            </button>
            <button
              onClick={onLogin}
              className="w-full sm:w-auto h-12 px-8 rounded-full text-xs font-semibold border border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Já sou cliente (Entrar)
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#070709] py-12 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className="h-6 w-auto object-contain"
            />
            <span>© 2026 Fluxo Lead. Todos os direitos reservados.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-400 font-medium">
            <a href="#valor" className="hover:text-white transition-colors">Planos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button onClick={onLogin} className="hover:text-white transition-colors cursor-pointer">
              Área de Membros
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
