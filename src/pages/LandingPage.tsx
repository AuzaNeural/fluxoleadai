import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Star,
  Bot,
  Users,
  Globe,
  Monitor,
  Smartphone,
  CreditCard,
  MessageSquare,
  Check,
  Play
} from 'lucide-react';
import templatesData from '../data/templates.json';

interface LandingPageProps {
  onLogin: () => void;
  onExploreTemplates?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onExploreTemplates }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number>(2); // Default no depoimento 3

  const testimonials = [
    {
      id: 0,
      quote: "Ficou top, irmão, atingiu as nossas expectativas!",
      tag: "Cliente · site institucional",
      chat: {
        author: "Cliente",
        messages: [
          { from: "user", text: "Fala meu amigo, te mandei a prévia do site da clínica!" },
          { from: "client", text: "Ficou top, irmão, atingiu as nossas expectativas!" },
          { from: "client", text: "O layout ficou muito limpo e moderno. Vamos fechar a publicação!" },
          { from: "user", text: "Show! Publicando agora com seu domínio próprio." }
        ]
      }
    },
    {
      id: 1,
      quote: "Parabéns pelo trabalho, ficou muito top. Dentro da expectativa que eu esperava mesmo.",
      tag: "Cliente · página de vendas",
      chat: {
        author: "Cliente",
        messages: [
          { from: "user", text: "Dá uma olhada nessa estrutura de página que montei para sua consultoria:" },
          { from: "client", text: "Parabéns pelo trabalho, ficou muito top. Dentro da expectativa que eu esperava mesmo." },
          { from: "client", text: "Pode subir hoje ainda? Já quero soltar tráfego!" }
        ]
      }
    },
    {
      id: 2,
      quote: "Eu amei, achei fantástico, bem profissional, estiloso. A logo ficou incrível, até melhor do que eu imaginava.",
      tag: "Cliente · site pessoal",
      chat: {
        author: "Cliente",
        messages: [
          { from: "user", text: "Segue vídeo de apresentação do seu novo site:\n[Vídeo 2026-02-12 19-02-46.mov]" },
          { from: "client", text: "Bom dia Iago, tudo joia? Eu amei, achei fantástico, bem profissional, estiloso. A logo ficou incrível, até melhor do que eu imaginava, até melhor inclusive." },
          { from: "client", text: "Eu estou fazendo umas fotos profissionais e assim que eu conseguir concluir eu te envio pra colocar, pelo menos na primeira dobra." },
          { from: "client", text: "Como é o meu nome que está lá, é de suma importância ter minha cara na página rs" }
        ]
      }
    },
    {
      id: 3,
      quote: "Top, mano. Ficou muito bom.",
      tag: "Cliente · landing page",
      chat: {
        author: "Cliente",
        messages: [
          { from: "user", text: "Fala irmão! Vou gravar e te mandar agora aqui!" },
          { from: "client", text: "fechou" },
          { from: "user", text: "Segue:\n[Vídeo 2026-02-06 18-08-08.mov]" },
          { from: "client", text: "top mano\nficou muito bom" },
          { from: "client", text: "consegue me enviar essa logo aí? ótima ideia" },
          { from: "client", text: "aí me passa quanto fica o plano anual" }
        ]
      }
    },
    {
      id: 4,
      quote: "Nossa, ficou MUITO bom!! Amei. Eu queria algo mais interativo, assim mesmo, e ficou.",
      tag: "Cliente · página de apresentação",
      chat: {
        author: "Cliente",
        messages: [
          { from: "user", text: "Opa, finalizei a personalização com o cardápio e botão de WhatsApp!" },
          { from: "client", text: "Nossa, ficou MUITO bom!! Amei. Eu queria algo mais interativo, assim mesmo, e ficou." },
          { from: "client", text: "Já enviei o link pra equipe testar e todo mundo elogiou." }
        ]
      }
    }
  ];

  const faqsCol1 = [
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
    }
  ];

  const faqsCol2 = [
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

  const featuredTemplates = (templatesData || []).slice(0, 10);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentChat = testimonials[activeTestimonialIndex] || testimonials[2];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#fa2600] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Glow Superior */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(250,38,0,0.22),transparent_75%)] z-0"></div>

      {/* Arco de luz no topo */}
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(1400px,160vw)] -translate-x-1/2 opacity-95 z-0">
        <img
          src="/brand/arc.png"
          alt="Fluxo Lead Glow"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/[0.08] transition-all">
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
              Funcionalidades
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
              Quero Vender Sites
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION (Exato do Vídeo: Título, Subtítulo, Mockup de Laptop com Badges Flutuantes) */}
      <section className="relative z-10 pt-14 pb-20 md:pt-20 md:pb-28 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight leading-[1.08] text-white">
          A única ferramenta que você precisa para <span className="text-[#fa2600]">vender sites com IA</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Escolha um modelo, deixe a IA reescrever a copy e as cores pro seu cliente, e publique uma página pronta pra vender. Sem código, sem contratar designer.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={onLogin}
            className="h-11 px-6 rounded-full text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            Entrar
          </button>
          <button
            onClick={() => scrollToSection('valor')}
            className="fx-btn-primary h-11 px-8 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(250,38,0,0.5)] hover:scale-105 transition-transform cursor-pointer"
          >
            Quero Vender Sites
          </button>
        </div>

        {/* Mockup do Laptop com Badges Flutuantes "+729 Clientes ativos" e "+100 Modelos Disponíveis" */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          {/* Badge Flutuante Esquerdo */}
          <div className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md p-3.5 sm:p-4 text-left shadow-2xl shadow-black/80 animate-bounce duration-1000">
            <span className="text-xl sm:text-2xl font-extrabold text-white block">+729</span>
            <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">Clientes ativos</span>
          </div>

          {/* Badge Flutuante Direito */}
          <div className="absolute -right-2 sm:right-4 top-1/3 -translate-y-1/2 z-20 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md p-3.5 sm:p-4 text-left shadow-2xl shadow-black/80">
            <div className="size-8 rounded-lg bg-[#fa2600]/20 border border-[#fa2600]/40 flex items-center justify-center text-[#fa2600] mb-2">
              <Monitor className="size-4" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-white block">+100</span>
            <span className="text-[11px] sm:text-xs text-neutral-400 font-medium">Modelos Disponíveis</span>
          </div>

          {/* Corpo do Laptop Mockup */}
          <div className="relative rounded-[28px] border border-white/15 bg-[#121318] p-3 sm:p-4 shadow-[0_20px_100px_rgba(250,38,0,0.2)]">
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-white/10 relative">
              <img
                src="/templates/template-1.jpg"
                alt="Fluxo Lead Preview"
                className="size-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-6">
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fa2600] bg-[#fa2600]/20 px-2.5 py-0.5 rounded-full border border-[#fa2600]/30">
                    ADVOCACIA PREMIUM
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1.5">
                    Chega de abusos bancários! Defenda seu dinheiro e seu nome
                  </h3>
                </div>
              </div>
            </div>
            {/* Base do Laptop */}
            <div className="h-3 sm:h-4 w-44 sm:w-64 mx-auto bg-neutral-800 rounded-b-xl border-t border-neutral-700 mt-2"></div>
          </div>
        </div>
      </section>

      {/* 2. CARROSSEL DE MODELOS ("+ de 4 anos de mercado") */}
      <section id="modelos" className="relative z-10 py-16 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#fa2600] flex items-center justify-center shadow-lg shadow-[#fa2600]/30 font-bold text-white">
              FL
            </div>
            <div className="size-10 rounded-xl bg-[#21759b] flex items-center justify-center shadow-lg text-white font-bold text-lg">
              W
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-400">
            <Monitor className="size-3.5 text-[#fa2600]" />
            <span className="text-white">+ de 4</span>
            <span>anos de mercado</span>
          </div>
        </div>

        {/* Faixa deslizante de templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {featuredTemplates.slice(0, 5).map((tmpl) => (
            <div
              key={tmpl.id}
              className="group rounded-2xl border border-white/10 bg-[#0d0e12] p-2.5 transition-all hover:border-[#fa2600]/50 hover:scale-102"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-[#14151a]">
                <img
                  src={tmpl.thumbnail}
                  alt={tmpl.name}
                  className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="pt-2 px-1">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#fa2600]">
                  {tmpl.category}
                </span>
                <p className="text-xs font-bold text-white truncate mt-0.5">
                  {tmpl.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. UMA ESTRUTURA QUE REALMENTE CONVERTE PODE MUDAR SEU JOGO (3 Cards Neon Laranja) */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Uma estrutura <span className="text-[#fa2600]">que realmente converte</span> pode mudar seu jogo
          </h2>

          {/* Barra de Notificações em Tempo Real */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-black/60 backdrop-blur-md px-5 py-2 text-xs">
            <span className="text-neutral-400">Com a ferramenta certa, você lucra todo dia com previsibilidade</span>
            <div className="flex items-center gap-1.5 rounded-full bg-[#fa2600]/15 border border-[#fa2600]/40 px-3 py-0.5 text-[11px] font-bold text-[#fa2600]">
              <span>+1 Lead Gerado!</span>
              <span className="text-[9px] text-neutral-400 font-normal">agora</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3 py-0.5 text-[11px] font-bold text-emerald-400">
              <span>+1 Venda Aprovada!</span>
              <span className="text-[9px] text-neutral-400 font-normal">agora</span>
            </div>
          </div>
        </div>

        {/* 3 Cards com Glow Neon Laranja */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Venda Realizada + Form */}
          <div className="rounded-3xl border border-[#fa2600]/40 bg-gradient-to-b from-[#1a0a05] to-[#0a0a0d] p-6 shadow-[0_0_40px_rgba(250,38,0,0.15)] flex flex-col justify-between">
            <div>
              <div className="rounded-2xl border border-[#fa2600]/50 bg-black/50 p-4 mb-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#fa2600]/10 blur-xl"></div>
                <span className="text-xs uppercase tracking-wider text-neutral-300 block">Venda realizada</span>
                <span className="text-sm font-bold text-white mt-1 block">
                  Sua comissão é de <span className="text-[#fa2600]">R$ 277,87</span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-neutral-400">
                  Digite seu nome completo
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-neutral-400">
                  Digite seu telefone
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-neutral-400">
                  Digite seu e-mail
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollToSection('valor')}
              className="mt-6 w-full h-10 rounded-xl fx-btn-primary text-xs font-bold uppercase text-white tracking-wider cursor-pointer"
            >
              Enviar
            </button>
          </div>

          {/* Card 2: Faturamento / Totalizador */}
          <div className="rounded-3xl border border-[#fa2600]/40 bg-gradient-to-b from-[#1a0a05] to-[#0a0a0d] p-6 shadow-[0_0_40px_rgba(250,38,0,0.15)] flex flex-col justify-between text-center">
            <div>
              <span className="text-xs uppercase tracking-wider text-neutral-400 block mb-6">
                Faturamento dos Parceiros
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="text-xs font-bold bg-[#fa2600]/20 border border-[#fa2600]/40 px-3 py-1 rounded-full text-white">
                  +R$ 20.999,22
                </span>
                <span className="text-xs font-bold bg-[#fa2600]/20 border border-[#fa2600]/40 px-3 py-1 rounded-full text-white">
                  +R$ 398.288,00
                </span>
                <span className="text-xs font-bold bg-[#fa2600]/20 border border-[#fa2600]/40 px-3 py-1 rounded-full text-white">
                  +R$ 43.283,18
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <span className="text-xs text-neutral-400 block">Total Transacionado</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#fa2600] tracking-tight mt-1 block">
                12.545.983,11
              </span>
            </div>
          </div>

          {/* Card 3: Cliente Verificado + Comissão */}
          <div className="rounded-3xl border border-[#fa2600]/40 bg-gradient-to-b from-[#1a0a05] to-[#0a0a0d] p-6 shadow-[0_0_40px_rgba(250,38,0,0.15)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/10 bg-black/40 mb-6">
                <div className="size-10 rounded-full bg-[#fa2600]/30 border border-[#fa2600] flex items-center justify-center text-white font-bold text-sm">
                  GV
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>Gabriela Vieira</span>
                    <CheckCircle2 className="size-3.5 text-blue-400" />
                  </h4>
                  <p className="text-[11px] text-neutral-400">CPF: 123.456.789-00</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center mb-4">
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="size-4" />
                  <span>Cliente verificado</span>
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 text-center">
              <span className="text-xs text-neutral-400 block">Comissão Direta</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">10,2%</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SITES DE VERDADE, ENTREGUES PARA CLIENTES DE VERDADE (Showcase 3D de Telas) */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Sites de verdade, <span className="text-[#fa2600]">entregues para clientes de verdade</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Advocacia, telecom, eventos, esporte, infoprodutos. Cada página adaptada para o negócio de quem comprou.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden group hover:border-[#fa2600]/40 transition-all">
            <div className="h-6 bg-[#16171d] border-b border-white/10 px-3 flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-red-500/80"></div>
              <div className="size-2 rounded-full bg-yellow-500/80"></div>
              <div className="size-2 rounded-full bg-green-500/80"></div>
            </div>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/templates/template-2.jpg"
                alt="Case Barbearia"
                className="size-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-white">Barbearia VIP — Premium</h4>
              <p className="text-xs text-neutral-400 mt-1">Site com agendamento via WhatsApp e tabela de serviços</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden group hover:border-[#fa2600]/40 transition-all">
            <div className="h-6 bg-[#16171d] border-b border-white/10 px-3 flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-red-500/80"></div>
              <div className="size-2 rounded-full bg-yellow-500/80"></div>
              <div className="size-2 rounded-full bg-green-500/80"></div>
            </div>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/templates/template-9.jpg"
                alt="Case Odontologia"
                className="size-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-white">Clínica Odontológica — Vital Odonto</h4>
              <p className="text-xs text-neutral-400 mt-1">Tratamentos, corpo clínico e captura rápida de pacientes</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden group hover:border-[#fa2600]/40 transition-all">
            <div className="h-6 bg-[#16171d] border-b border-white/10 px-3 flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-red-500/80"></div>
              <div className="size-2 rounded-full bg-yellow-500/80"></div>
              <div className="size-2 rounded-full bg-green-500/80"></div>
            </div>
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/templates/template-10.jpg"
                alt="Case Estética Automotiva"
                className="size-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-white">Estética Automotiva — Bravos Spa</h4>
              <p className="text-xs text-neutral-400 mt-1">Simulador de películas, galeria de veículos e contato direto</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEPOIMENTOS INTERATIVOS COM CHAT WHATSAPP AO VIVO (Exato do Vídeo frame 300s) */}
      <section id="depoimentos" className="relative z-10 py-20 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            DEPOIMENTOS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            O que os clientes falaram quando receberam o site
          </h2>
          <p className="mt-2 text-xs text-neutral-500">
            Prints reais de conversas no WhatsApp. Números e fotos ocultados para preservar a privacidade dos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Smartphone Mockup com a Conversa do WhatsApp do depoimento selecionado */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] rounded-[38px] border-2 border-[#fa2600] bg-[#0c0d10] p-3 shadow-[0_0_50px_rgba(250,38,0,0.4)] relative">
              {/* Notch */}
              <div className="w-28 h-4 bg-black rounded-b-xl mx-auto mb-2 border-b border-white/10"></div>

              {/* Cabeçalho do WhatsApp */}
              <div className="bg-[#181920] rounded-t-2xl p-3 border-b border-white/10 flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[#fa2600]/30 text-white font-bold text-xs flex items-center justify-center">
                  C
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{currentChat.tag}</span>
                  <span className="text-[10px] text-emerald-400">online</span>
                </div>
              </div>

              {/* Mensagens do Chat */}
              <div className="bg-[#0b141a] p-3.5 space-y-3 min-h-[360px] flex flex-col justify-end rounded-b-2xl">
                {currentChat.chat.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed ${
                      m.from === 'user'
                        ? 'ml-auto bg-[#005c4b] text-white rounded-br-none'
                        : 'mr-auto bg-[#202c33] text-neutral-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Depoimentos Clicáveis (Ao clicar, altera o WhatsApp na esquerda) */}
          <div className="lg:col-span-7 space-y-3">
            {testimonials.map((t, idx) => {
              const isActive = activeTestimonialIndex === idx;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTestimonialIndex(idx)}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#fa2600] bg-[#1a0a07] shadow-[0_0_25px_rgba(250,38,0,0.25)]'
                      : 'border-white/10 bg-[#0d0e12] hover:border-white/20'
                  }`}
                >
                  <p className={`text-sm sm:text-base font-medium leading-relaxed ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                    "{t.quote}"
                  </p>
                  <span className="text-[11px] text-[#fa2600] font-semibold mt-2 block">
                    {t.tag}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. PLANOS E PREÇOS OFICIAIS (#valor - Exato do Vídeo frame 320s) */}
      <section id="valor" className="relative z-10 py-24 px-4 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Coluna 1 (Esquerda): Logo + Texto */}
          <div className="lg:col-span-3 text-left">
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className="h-9 w-auto object-contain mb-4"
            />
            <p className="text-sm text-neutral-400 leading-relaxed">
              A única ferramenta que você precisa pra começar a faturar no digital vendendo sites.
            </p>
          </div>

          {/* Coluna 2 (Centro): 2 Cards estilo telefone com entalhe */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card Mensal */}
            <div className="rounded-[32px] border border-white/10 bg-[#0e0f14] p-6 text-center flex flex-col justify-between relative overflow-hidden">
              <div className="w-16 h-2 bg-neutral-800 rounded-b-md mx-auto mb-4"></div>
              <div>
                <h3 className="text-xl font-bold text-white">Fluxo Lead</h3>
                <span className="text-sm font-semibold text-[#fa2600] block mt-0.5">Mensal</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 bg-white/[0.06] px-2.5 py-0.5 rounded-full mt-2 inline-block">
                  ACESSO COMPLETO
                </span>

                <div className="mt-6 mb-6">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">ASSINATURA DE</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-lg font-bold text-neutral-400">R$</span>
                    <span className="text-4xl font-extrabold text-white">197</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">POR MÊS</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onLogin}
                  className="w-full h-11 rounded-full fx-btn-primary text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(250,38,0,0.4)] cursor-pointer"
                >
                  Assinar Mensal
                </button>
                <p className="text-[10px] text-neutral-500 mt-2">Pagamento 100% seguro</p>
              </div>
            </div>

            {/* Card Anual */}
            <div className="rounded-[32px] border-2 border-[#fa2600] bg-[#140a08] p-6 text-center flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_rgba(250,38,0,0.3)]">
              <div className="w-16 h-2 bg-[#fa2600] rounded-b-md mx-auto mb-4"></div>
              <div>
                <h3 className="text-xl font-bold text-white">Fluxo Lead</h3>
                <span className="text-sm font-semibold text-[#fa2600] block mt-0.5">Anual</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#fa2600] bg-[#fa2600]/20 px-2.5 py-0.5 rounded-full mt-2 inline-block border border-[#fa2600]/30">
                  MELHOR VALOR
                </span>

                <div className="mt-6 mb-6">
                  <span className="text-[10px] text-neutral-400 line-through block">DE R$2.364 POR 12X DE</span>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-lg font-bold text-white">R$</span>
                    <span className="text-4xl font-extrabold text-white">30,68</span>
                  </div>
                  <span className="text-[11px] text-[#fa2600] font-bold">OU R$297 À VISTA</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onLogin}
                  className="w-full h-11 rounded-full fx-btn-primary text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(250,38,0,0.6)] cursor-pointer hover:scale-102 transition-transform"
                >
                  Garantir Anual
                </button>
                <p className="text-[10px] text-neutral-500 mt-2">Economia de 87% • Acesso imediato</p>
              </div>
            </div>
          </div>

          {/* Coluna 3 (Direita): Lista de Benefícios com Double Checks Vermelhos */}
          <div className="lg:col-span-3 space-y-4 text-xs text-neutral-300">
            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Check className="size-3.5 text-[#fa2600]" />
                <span>Entrega rápida:</span>
              </p>
              <p className="text-neutral-400 pl-5 mt-0.5">sua página fica pronta em minutos, não em dias, você mesmo adapta e publica na hora.</p>
            </div>

            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Check className="size-3.5 text-[#fa2600]" />
                <span>Liberdade total:</span>
              </p>
              <p className="text-neutral-400 pl-5 mt-0.5">edite, adapte e republique quantas vezes quiser, sem custo extra.</p>
            </div>

            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Check className="size-3.5 text-[#fa2600]" />
                <span>Personalização de verdade:</span>
              </p>
              <p className="text-neutral-400 pl-5 mt-0.5">a IA adapta texto e cor pra cada cliente, a mesma base, nunca a mesma cara.</p>
            </div>

            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Check className="size-3.5 text-[#fa2600]" />
                <span>Performance:</span>
              </p>
              <p className="text-neutral-400 pl-5 mt-0.5">seu site carregando em menos de 3s, pronto para converter.</p>
            </div>

            <div>
              <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                <Check className="size-3.5 text-[#fa2600]" />
                <span>Responsividade:</span>
              </p>
              <p className="text-neutral-400 pl-5 mt-0.5">experiência perfeita em qualquer dispositivo que seus clientes usarem.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-400">
          Já é cliente?{' '}
          <button
            onClick={onLogin}
            className="text-[#fa2600] font-bold hover:underline cursor-pointer"
          >
            Entrar
          </button>
        </div>
      </section>

      {/* 7. PERGUNTAS FREQUENTES (FAQ em 2 Colunas de Cards Exato do Vídeo frame 340s) */}
      <section id="faq" className="relative z-10 py-20 px-4 max-w-6xl mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#fa2600] mb-2">
            TIRE SUAS DÚVIDAS
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna 1 */}
          <div className="space-y-3">
            {faqsCol1.map((faq, i) => {
              const idx = i;
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-4 text-[#fa2600] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.06] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Coluna 2 */}
          <div className="space-y-3">
            {faqsCol2.map((faq, i) => {
              const idx = i + 10;
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-[#0d0e12] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-4 text-[#fa2600] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-white/[0.06] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizonte de Luz Laranja com Círculo do Logo Fluxo Lead */}
        <div className="mt-20 relative text-center">
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#fa2600] to-transparent"></div>
          <div className="size-8 rounded-full bg-black border border-[#fa2600] mx-auto -mt-4 flex items-center justify-center shadow-[0_0_20px_#fa2600]">
            <div className="size-3 rounded-full bg-[#fa2600]"></div>
          </div>
        </div>
      </section>

      {/* 8. RODAPÉ OFICIAL (Exato do Vídeo frame 340s) */}
      <footer className="relative z-10 bg-black pt-8 pb-12 px-4 border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Fluxo Lead – o app que acha o cliente, monta o site com IA e publica em minutos. Tudo pra você vender páginas profissionais sem precisar programar, desenhar ou perder tempo.
          </p>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Fluxo Lead</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-neutral-400">
            <a href="#como-funciona" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#valor" className="hover:text-white transition-colors">Planos</a>
            <a href="#modelos" className="hover:text-white transition-colors">Portfólio</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <button
              onClick={onLogin}
              className="text-[#fa2600] font-bold hover:underline cursor-pointer"
            >
              Entrar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
