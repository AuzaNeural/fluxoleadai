import { User, Lead, Project, Template, WhatsAppInstance, SupportTicket, HistoryItem, ActiveSession } from '../types';

const STORAGE_KEYS = {
  USER: 'fluxo_lead_user',
  TOKEN: 'fluxo_lead_token',
  LEADS: 'fluxo_lead_leads',
  PROJECTS: 'fluxo_lead_projects',
  TEMPLATES: 'fluxo_lead_templates',
  WHATSAPP: 'fluxo_lead_whatsapp',
  TICKETS: 'fluxo_lead_tickets',
  HISTORY: 'fluxo_lead_history',
  SESSIONS: 'fluxo_lead_sessions',
  COOKIE_CONSENT: 'fluxo_lead_cookie_consent'
};

export const defaultUser: User = {
  id: 'usr_1',
  name: 'Anderson',
  email: 'juliasouzamartins71@gmail.com',
  company: 'Auza Neural Growth',
  plan_type: 'Fluxo Lead Anual',
  searches_used: 142,
  searches_limit: 1000,
  leads_count: 14,
  avatar_initial: 'A',
  renewal_date: '14 de Novembro de 2027',
  confirmed_email: true
};

export const defaultSessions: ActiveSession[] = [
  { id: 'sess_1', browser: 'Chrome 128 (Windows 11)', ip: '189.40.12.89', last_active: 'Agora (Sessão atual)', is_current: true },
  { id: 'sess_2', browser: 'Safari 17 (iPhone 15)', ip: '177.18.204.14', last_active: 'Há 2 dias', is_current: false }
];

export const defaultLeads: Lead[] = [
  {
    id: 'lead_1',
    company_name: 'Haroldo Azevedo Construções',
    niche: 'Construção Civil',
    neighborhood: 'Candelária',
    city: 'Natal',
    state: 'RN',
    source: 'Google Maps',
    phone: '(84) 3231-0094',
    whatsapp: '558432310094',
    whatsapp_confirmed: true,
    status: 'Não contatado',
    has_website: true,
    website: 'https://haroldoazevedo.com.br',
    website_status: 'Site funcionando',
    next_contact: '—',
    updated_at: 'há 10 horas',
    created_at: 'há 10 horas',
    contacted: false,
    tags: ['Site funcionando', 'Google Maps']
  },
  {
    id: 'lead_2',
    company_name: 'Lanchonete Dica',
    niche: 'Lanchonetes',
    neighborhood: 'Liberdade',
    city: 'São Paulo',
    state: 'SP',
    source: 'Google Maps',
    phone: '(11) 94600-7129',
    whatsapp: '5511946007129',
    whatsapp_confirmed: false,
    status: 'Respondeu',
    has_website: false,
    website_status: 'Site não informado',
    next_contact: '—',
    updated_at: 'há 5 dias',
    created_at: 'há 5 dias',
    contacted: true,
    tags: ['Sem site', 'Google Maps']
  },
  {
    id: 'lead_3',
    company_name: 'Consultório Odontológico Dra. Lorena Rocha',
    niche: 'Odontologia',
    neighborhood: 'Vila Telma',
    city: 'Montes Claros',
    state: 'MG',
    source: 'Google Maps',
    phone: '(38) 99197-4844',
    whatsapp: '5538991974844',
    whatsapp_confirmed: false,
    status: 'Novo lead',
    has_website: false,
    website_status: 'Site não informado',
    next_contact: '—',
    updated_at: 'há 7 dias',
    created_at: 'há 7 dias',
    contacted: true,
    tags: ['Sem site', 'Google Maps']
  },
  {
    id: 'lead_4',
    company_name: 'Papillon Odontologia',
    niche: 'Odontologia',
    neighborhood: 'Osvaldo Rezende',
    city: 'Uberlândia',
    state: 'MG',
    source: 'Google Maps',
    phone: '(34) 98437-9948',
    whatsapp: '5534984379948',
    whatsapp_confirmed: false,
    status: 'Novo lead',
    has_website: false,
    website_status: 'Site não informado',
    next_contact: '—',
    updated_at: 'há 11 dias',
    created_at: 'há 11 dias',
    contacted: false,
    tags: ['Sem site', 'Google Maps']
  },
  {
    id: 'lead_5',
    company_name: 'D odontologia dr',
    niche: 'Odontologia',
    neighborhood: 'Liberdade',
    city: 'São Paulo',
    state: 'SP',
    source: 'Google Maps',
    phone: '(11) 95314-7989',
    whatsapp: '5511953147989',
    whatsapp_confirmed: false,
    status: 'Novo lead',
    has_website: true,
    website_status: 'Problema confirmado',
    next_contact: '—',
    updated_at: 'há 12 dias',
    created_at: 'há 12 dias',
    contacted: false,
    tags: ['Problema confirmado', 'Google Maps']
  },
  {
    id: 'lead_6',
    company_name: 'Ratatui',
    niche: 'Restaurantes',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    source: 'Google Maps',
    phone: '(11) 91338-3340',
    whatsapp: '5511913383340',
    whatsapp_confirmed: true,
    status: 'Novo lead',
    has_website: false,
    website_status: 'Site não informado',
    next_contact: '—',
    updated_at: 'há 28 dias',
    created_at: 'há 28 dias',
    contacted: false,
    tags: ['Sem site', 'Google Maps']
  }
];

export const defaultTemplates: Template[] = [
  {
    id: 'tmpl_1',
    name: 'Clínica & Consultório Odontológico Premium',
    category: 'SAÚDE',
    description: 'Design escuro e sofisticado para dentistas e implantodontistas com agendador de consultas integrado e depoimentos.',
    image_url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_2',
    name: 'Escritório de Advocacia & Consultoria Jurídica',
    category: 'SERVIÇOS',
    description: 'Layout imponente para advogados com áreas de atuação, botão direto para WhatsApp de plantão e formulário de contato.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_3',
    name: 'Restaurante & Gastronomia Gourmet',
    category: 'GASTRONOMIA',
    description: 'Cardápio interativo, reservas online de mesas e integração direta para pedidos rápidos pelo WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_4',
    name: 'Agência de Tecnologia, Growth & SaaS AI',
    category: 'TECNOLOGIA',
    description: 'Estética futurista dark com efeitos neon glow, demonstração de recursos, métricas de crescimento e tabelas de planos.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_5',
    name: 'Academia, CrossFit & Centro de Treinamento',
    category: 'SAÚDE',
    description: 'Alta energia, planos de matrícula, grade de horários, fotos da estrutura e botão para agendar aula experimental gratuita.',
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_6',
    name: 'Centro Automotivo & Oficina Mecânica',
    category: 'AUTOMOTIVO',
    description: 'Página focada em serviços rápidos, orçamento instantâneo, tabela de revisões preventivas e localização no mapa.',
    image_url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_7',
    name: 'Clínica de Estética & Harmonização Facial',
    category: 'ESTÉTICA',
    description: 'Visual clean e luxuoso com galeria de antes e depois, procedimentos faciais e corporais e agendamento via WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_8',
    name: 'Barbearia VIP & Salão Masculino Tradicional',
    category: 'ESTÉTICA',
    description: 'Estilo vintage moderno, serviços de barba, cabelo e bigode, fotos dos profissionais e agendamento de horário.',
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_9',
    name: 'Pet Shop, Banho & Tosa e Veterinária 24h',
    category: 'PET SHOP',
    description: 'Página alegre e confiável com serviços para pets, agendamento de táxi dog, consultas veterinárias e vacinas.',
    image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_10',
    name: 'Imobiliária & Corretores de Alto Padrão',
    category: 'IMOBILIÁRIA',
    description: 'Apresentação refinada de imóveis, casas em condomínio fechado, lançamentos na planta e filtros de busca.',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_11',
    name: 'Contabilidade Consultiva & BPO Financeiro',
    category: 'SERVIÇOS',
    description: 'Focado em abertura de empresas grátis, migração de MEI para ME, emissão de notas fiscais e redução de impostos.',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_12',
    name: 'Escola de Idiomas & Cursos Profissionalizantes',
    category: 'EDUCAÇÃO',
    description: 'Captação de matrículas, metodologia de ensino, depoimentos de alunos aprovados e teste de nível gratuito.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_13',
    name: 'Energia Solar Fotovoltaica & Engenharia',
    category: 'SERVIÇOS',
    description: 'Simulador de economia na conta de luz, projetos residenciais e industriais homologados e financiamento facilitado.',
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_14',
    name: 'Hamburgueria Artesanal & Delivery Rápido',
    category: 'GASTRONOMIA',
    description: 'Fotos de dar água na boca, combos promocionais, cupons de desconto para primeiro pedido e botão do iFood/WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    popular: true
  },
  {
    id: 'tmpl_15',
    name: 'Arquitetura, Interiores & Paisagismo',
    category: 'SERVIÇOS',
    description: 'Portfólio minimalista e editorial com projetos residenciais, corporativos, maquetes 3D e processo criativo.',
    image_url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_16',
    name: 'Pizzaria Tradicional & Forno a Lenha',
    category: 'GASTRONOMIA',
    description: 'Cardápio de pizzas salgadas e doces, bordas recheadas, taxa de entrega por bairro e pedido via WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_17',
    name: 'Estética Automotiva, Detailing & Lava Rápido',
    category: 'AUTOMOTIVO',
    description: 'Polimento técnico, vitrificação de pintura, higienização interna profunda e lavagem detalhada.',
    image_url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_18',
    name: 'Salão de Beleza & Cabeleireiro Feminino',
    category: 'ESTÉTICA',
    description: 'Mechas, coloração, mega hair, manicure, maquiagem para noivas e agendamento de avaliação capilar.',
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_19',
    name: 'E-commerce / Loja de Roupas & Calçados',
    category: 'ECOMMERCE',
    description: 'Vitrine de lançamentos, coleções da estação, guia de tamanhos e botão para comprar direto pelo carrinho ou WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_20',
    name: 'Fisioterapia, Pilates & Reabilitação Motora',
    category: 'SAÚDE',
    description: 'Tratamento de dores na coluna, fisioterapia esportiva, estúdio de pilates com aparelhos e consulta individual.',
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_21',
    name: 'Consultoria de Seguros, Vida & Previdência',
    category: 'SERVIÇOS',
    description: 'Cotação instantânea de seguro auto, plano de saúde empresarial, seguro de vida e consórcios imobiliários.',
    image_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_22',
    name: 'Construtora & Reformas Residenciais',
    category: 'SERVIÇOS',
    description: 'Obras do alicerce ao acabamento, pintura, elétrica, hidráulica com cronograma detalhado e contrato de garantia.',
    image_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_23',
    name: 'Buffet Infantil & Salão de Festas',
    category: 'GASTRONOMIA',
    description: 'Pacotes completos de festas de aniversário, brinquedoteca, cardápio infantil e agendamento de visita.',
    image_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'tmpl_24',
    name: 'Estúdio de Tatuagem & Body Piercing',
    category: 'SERVIÇOS',
    description: 'Portfólio com traços finos (fine line), realismo, biossegurança rigorosa e orçamento direto no WhatsApp.',
    image_url: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=600&auto=format&fit=crop&q=80'
  }
];

export const defaultProjects: Project[] = [
  {
    id: 'proj_1',
    name: 'Site — Haroldo Azevedo Construções',
    template_id: 'tmpl_const_1',
    status: 'Draft',
    created_at: 'Há 3 dias',
    updated_at: 'há 3 dias',
    category: 'Construção — Construc',
    thumbnail: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'proj_2',
    name: 'Site — Lanchonete Dica',
    template_id: 'tmpl_caf_1',
    status: 'Draft',
    created_at: 'Há 4 dias',
    updated_at: 'há 4 dias',
    category: 'Cafeteria — Coffee',
    thumbnail: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80'
  }
];

export const defaultWhatsApp: WhatsAppInstance = {
  id: 'wa_1',
  name: 'WhatsApp Vendas Comercial',
  phone: '+55 11 98845-9012',
  status: 'Disconnected',
  ai_status: 'Paused',
  contacts_count: 0
};

export const defaultHistory: HistoryItem[] = [
  { id: 'h_1', action: 'Busca de Empresas', details: 'Busca por "Dentistas" em São Paulo / SP - 50 resultados', timestamp: 'Hoje às 14:15', category: 'Busca' },
  { id: 'h_2', action: 'Lead Adicionado ao CRM', details: 'Empresa "Dr. Lucas Odontologia" adicionada na etapa Novo lead', timestamp: 'Hoje às 14:22', category: 'CRM' },
  { id: 'h_3', action: 'Projeto Criado', details: 'Novo site criado com template "Clínica & Consultório Médico"', timestamp: '10/11/2026', category: 'Projeto' },
  { id: 'h_4', action: 'Login Efetuado', details: 'Acesso autenticado via Chrome Windows', timestamp: 'Hoje às 12:00', category: 'Conta' }
];

export const storage = {
  getUser: (): User => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : defaultUser;
  },
  setUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    if (!data) return defaultLeads;
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0 && (parsed[0].updated_at === 'há 3 dias' || parsed[0].status === 'Novo lead')) {
        localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(defaultLeads));
        return defaultLeads;
      }
      return parsed;
    } catch {
      return defaultLeads;
    }
  },
  setLeads: (leads: Lead[]) => {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  },
  getProjects: (): Project[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) return defaultProjects;
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name.includes('Dr. Lucas')) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects));
        return defaultProjects;
      }
      return parsed;
    } catch {
      return defaultProjects;
    }
  },
  setProjects: (projects: Project[]) => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  getTemplates: (): Template[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : defaultTemplates;
  },
  setTemplates: (templates: Template[]) => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },
  getWhatsApp: (): WhatsAppInstance => {
    const data = localStorage.getItem(STORAGE_KEYS.WHATSAPP);
    return data ? JSON.parse(data) : defaultWhatsApp;
  },
  setWhatsApp: (instance: WhatsAppInstance) => {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP, JSON.stringify(instance));
  },
  getTickets: (): SupportTicket[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return data ? JSON.parse(data) : [];
  },
  setTickets: (tickets: SupportTicket[]) => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  },
  getHistory: (): HistoryItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : defaultHistory;
  },
  addHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const history = storage.getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: 'h_' + Date.now(),
      timestamp: 'Agora'
    };
    storage.setHistory([newItem, ...history]);
  },
  setHistory: (history: HistoryItem[]) => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  },
  getSessions: (): ActiveSession[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : defaultSessions;
  },
  setSessions: (sessions: ActiveSession[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
  hasCookieConsent: () => localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT) === 'true',
  setCookieConsent: () => localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, 'true')
};

