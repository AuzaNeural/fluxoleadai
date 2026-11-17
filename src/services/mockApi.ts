import { Company, KanbanStatus, Lead, Project, SupportTicket } from '../types';
import { storage } from './storage';

export const mockApi = {
  // Simular busca no Google Maps
  searchCompanies: async (
    niche: string,
    state: string,
    city: string,
    neighborhood: string,
    quantity: number,
    filters: {
      hasPhone?: boolean;
      hasWhatsapp?: boolean;
      hasWebsite?: boolean;
      noWebsite?: boolean;
      alreadyRegistered?: boolean;
      notContactedYet?: boolean;
    }
  ): Promise<Company[]> => {
    // Simula delay de rede de busca no Google Maps
    await new Promise((resolve) => setTimeout(resolve, 800));

    const prefixes = ['Centro de', 'Espaço', 'Grupo', 'Clínica', 'Ateliê', 'Studio', 'Instituto', 'Companhia', 'Master', 'Premier'];
    const surnames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Alves', 'Pereira', 'Lima', 'Carvalho', 'Ferreira'];
    const neighborhoodsList = neighborhood ? [neighborhood] : ['Centro', 'Jardins', 'Vila Nova', 'Bela Vista', 'Pinheiros', 'Moema'];

    const results: Company[] = [];
    const count = Math.min(quantity || 20, 700);

    for (let i = 1; i <= count; i++) {
      const prefix = prefixes[i % prefixes.length];
      const surname = surnames[(i * 3) % surnames.length];
      const neigh = neighborhoodsList[i % neighborhoodsList.length];

      // Determina se tem site com base nos filtros
      let hasWeb = Math.random() > 0.55;
      if (filters.hasWebsite) hasWeb = true;
      if (filters.noWebsite) hasWeb = false;

      const ddd = state === 'SP' ? '11' : state === 'RJ' ? '21' : state === 'MG' ? '31' : '41';
      const phoneNum = `9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

      results.push({
        id: `comp_${Date.now()}_${i}`,
        name: `${prefix} ${niche} ${surname}`,
        niche: niche,
        phone: `(${ddd}) ${phoneNum}`,
        whatsapp: `55${ddd}${phoneNum.replace('-', '')}`,
        has_website: hasWeb,
        website: hasWeb ? `https://${niche.toLowerCase().replace(/\s+/g, '')}${surname.toLowerCase()}.com.br` : undefined,
        rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
        reviews: Math.floor(15 + Math.random() * 220),
        address: `Rua das Palmeiras, ${100 + i * 15} - ${neigh}`,
        city: city,
        state: state,
        saved_as_lead: false
      });
    }

    // Registra no histórico
    storage.addHistory({
      action: 'Busca de Empresas',
      details: `${count} empresas encontradas no Google Maps para "${niche}" em ${city}/${state}`,
      category: 'Busca'
    });

    // Atualiza buscas utilizadas
    const user = storage.getUser();
    storage.setUser({
      ...user,
      searches_used: user.searches_used + count
    });

    return results;
  },

  // Retornar estatísticas do dashboard
  getDashboardStats: () => {
    const leads = storage.getLeads();
    const user = storage.getUser();
    const projects = storage.getProjects();

    const noSiteCount = leads.filter((l) => !l.has_website || l.website_status === 'Site não informado').length;
    const withSiteCount = leads.filter((l) => l.has_website && l.website_status !== 'Site não informado').length;
    const contactedCount = leads.filter((l) => l.contacted || (l.status !== 'Novo lead' && l.status !== 'Não contatado')).length;
    const inNegotiation = leads.filter((l) =>
      ['Primeiro contato', 'Respondeu', 'Interessado', 'Reunião marcada', 'Proposta enviada', 'Negociação'].includes(l.status)
    ).length;

    return {
      empresasEncontradas: user.searches_used > 0 ? user.searches_used * 12 : 0,
      leadsSalvos: leads.length,
      semSite: noSiteCount,
      comSite: withSiteCount,
      leadsContactados: contactedCount,
      negociacoesAndamento: inNegotiation,
      projetosCriados: projects.length,
      buscasDisponiveis: user.searches_limit - user.searches_used
    };
  },

  // Salvar empresa como lead
  saveLead: (company: Company): Lead => {
    const leads = storage.getLeads();
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      company_name: company.name,
      niche: company.niche,
      phone: company.phone,
      whatsapp: company.whatsapp,
      status: 'Novo lead',
      has_website: company.has_website,
      website: company.website,
      created_at: 'Agora',
      tags: company.has_website ? ['Com site'] : ['Sem site informado'],
      contacted: false
    };

    storage.setLeads([newLead, ...leads]);
    storage.addHistory({
      action: 'Novo Lead Salvo',
      details: `Empresa "${company.name}" adicionada ao CRM`,
      category: 'Lead'
    });

    const user = storage.getUser();
    storage.setUser({ ...user, leads_count: user.leads_count + 1 });

    return newLead;
  },

  // Atualizar status do lead (arrastar no Kanban)
  updateLeadStatus: (leadId: string, newStatus: KanbanStatus): Lead[] => {
    const leads = storage.getLeads();
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          contacted: newStatus !== 'Novo lead' && newStatus !== 'Não contatado'
        };
      }
      return l;
    });
    storage.setLeads(updated);

    const targetLead = leads.find((l) => l.id === leadId);
    if (targetLead) {
      storage.addHistory({
        action: 'Atualização de Etapa CRM',
        details: `"${targetLead.company_name}" movido para "${newStatus}"`,
        category: 'CRM'
      });
    }

    return updated;
  },

  // Ligar/Desligar Vendedor IA
  toggleWhatsAppAI: async (active: boolean) => {
    await new Promise((r) => setTimeout(r, 600));
    const wa = storage.getWhatsApp();
    const updated = {
      ...wa,
      ai_status: active ? ('Active' as const) : ('Paused' as const)
    };
    storage.setWhatsApp(updated);
    storage.addHistory({
      action: 'Vendedor IA',
      details: active ? 'Atendimento automático IA ativado' : 'Atendimento com IA pausado',
      category: 'WhatsApp'
    });
    return updated;
  },

  // Conectar WhatsApp simulado
  connectWhatsApp: async (phone: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    const wa = storage.getWhatsApp();
    const updated = {
      ...wa,
      status: 'Connected' as const,
      phone: phone || '+55 11 98845-9012'
    };
    storage.setWhatsApp(updated);
    storage.addHistory({
      action: 'WhatsApp Conectado',
      details: `Instância de WhatsApp conectada com sucesso (${updated.phone})`,
      category: 'WhatsApp'
    });
    return updated;
  },

  // Desconectar WhatsApp
  disconnectWhatsApp: async () => {
    await new Promise((r) => setTimeout(r, 600));
    const wa = storage.getWhatsApp();
    const updated = {
      ...wa,
      status: 'Disconnected' as const,
      ai_status: 'Paused' as const
    };
    storage.setWhatsApp(updated);
    storage.addHistory({
      action: 'WhatsApp Desconectado',
      details: 'Conexão de WhatsApp interrompida pelo usuário',
      category: 'WhatsApp'
    });
    return updated;
  },

  // Criar Projeto
  createProject: (name: string, templateId?: string): Project => {
    const projects = storage.getProjects();
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name,
      template_id: templateId,
      status: 'Draft',
      created_at: new Date().toLocaleDateString('pt-BR'),
      updated_at: 'Agora',
      category: 'Geral',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
    };
    storage.setProjects([newProj, ...projects]);
    storage.addHistory({
      action: 'Projeto Criado',
      details: `Projeto "${name}" iniciado`,
      category: 'Projeto'
    });
    return newProj;
  },

  // Publicar Projeto
  publishProject: (projectId: string, url: string): Project[] => {
    const projects = storage.getProjects();
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'Published' as const,
          url,
          updated_at: 'Agora'
        };
      }
      return p;
    });
    storage.setProjects(updated);
    return updated;
  },

  // Criar chamado de suporte
  createTicket: (subject: string, description: string): SupportTicket => {
    const tickets = storage.getTickets();
    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      subject,
      description,
      status: 'Aberto',
      created_at: new Date().toLocaleDateString('pt-BR')
    };
    storage.setTickets([newTicket, ...tickets]);
    storage.addHistory({
      action: 'Chamado Aberto',
      details: `Novo ticket de suporte: "${subject}"`,
      category: 'Conta'
    });
    return newTicket;
  }
};

