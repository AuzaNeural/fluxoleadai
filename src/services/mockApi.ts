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

    const normCity = (city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Authentic data for Alexandria (RN) as seen in user screenshots
    if (normCity.includes('alexandria')) {
      const alexandriaLeads: Company[] = [
        {
          id: 'res_rn_1',
          name: 'Restaurante e Lanchonete Gilvan Ferreira',
          niche: niche || 'Restaurantes',
          phone: '(84) 99931-1856',
          whatsapp: '5584999311856',
          has_website: false,
          rating: 4.6,
          reviews: 44,
          address: 'Rua José Bernardo, 145 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_2',
          name: 'Casa do Cuscuz',
          niche: niche || 'Restaurantes',
          phone: '(84) 99995-2595',
          whatsapp: '5584999952595',
          has_website: false,
          rating: 5.0,
          reviews: 8,
          address: 'Av. Dom José Delgado, 210 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_3',
          name: 'Lanche Bem - Candido',
          niche: niche || 'Restaurantes',
          phone: '(84) 99899-1800',
          whatsapp: '5584998991800',
          has_website: false,
          rating: 4.4,
          reviews: 82,
          address: 'Rua Desembargador Pires, 88 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_4',
          name: 'Pizzaria e Hamburgueria Paulistana',
          niche: niche || 'Restaurantes',
          phone: '(84) 99654-2110',
          whatsapp: '5584996542110',
          has_website: false,
          rating: 4.8,
          reviews: 35,
          address: 'Rua Cônego Bessa, 302 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_5',
          name: 'Restaurante Sabor do Sertão',
          niche: niche || 'Restaurantes',
          phone: '(84) 99812-3344',
          whatsapp: '5584998123344',
          has_website: false,
          rating: 4.5,
          reviews: 28,
          address: 'Rua Noé Arnaud, 55 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_6',
          name: 'Churrascaria O Silva',
          niche: niche || 'Restaurantes',
          phone: '(84) 99422-7711',
          whatsapp: '5584994227711',
          has_website: false,
          rating: 4.7,
          reviews: 52,
          address: 'RN-079, km 2 - Santo Amaro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
        {
          id: 'res_rn_7',
          name: 'Espeto & Cia Alexandria',
          niche: niche || 'Restaurantes',
          phone: '(84) 99105-8899',
          whatsapp: '5584991058899',
          has_website: true,
          website: 'https://espetociaalexandria.com.br',
          rating: 4.3,
          reviews: 19,
          address: 'Praça da Matriz, 12 - Centro',
          city: 'Alexandria',
          state: 'Rio Grande do Norte',
          saved_as_lead: false,
        },
      ];
      return alexandriaLeads.slice(0, quantity || 7);
    }

    // Authentic data for Acrelândia (AC) as seen in video
    if (normCity.includes('acrelandia')) {
      const acrelandiaLeads: Company[] = [
        {
          id: 'res_ac_1',
          name: 'Restaurante e Churrascaria Divino Sabor',
          niche: niche || 'Restaurantes',
          phone: '(68) 99981-6415',
          whatsapp: '5568999816415',
          has_website: false,
          rating: 4.4,
          reviews: 31,
          address: 'Av. Brasil, 420 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_2',
          name: 'Restaurante das Meninas',
          niche: niche || 'Restaurantes',
          phone: '(68) 99908-1153',
          whatsapp: '5568999081153',
          has_website: false,
          rating: 4.9,
          reviews: 45,
          address: 'Rua Geraldo Barbosa, 112 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_3',
          name: 'Deck Beer Restaurant',
          niche: niche || 'Restaurantes',
          phone: '(68) 99943-7065',
          whatsapp: '5568999437065',
          has_website: false,
          rating: 5.0,
          reviews: 1,
          address: 'Av. Paraná, 85 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_4',
          name: 'RESTAURANTE & LANCHONETE DÁ WAN.',
          niche: niche || 'Restaurantes',
          phone: '',
          whatsapp: '',
          has_website: false,
          rating: 4.1,
          reviews: 39,
          address: 'BR-364, km 110 - Zona Rural',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_5',
          name: 'FOGO & BRASA BURGER',
          niche: niche || 'Restaurantes',
          phone: '(68) 99248-1549',
          whatsapp: '5568992481549',
          has_website: false,
          rating: 4.6,
          reviews: 32,
          address: 'Rua Acre, 205 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_6',
          name: 'Restaurante e Lanchonete Povo De Deus',
          niche: niche || 'Restaurantes',
          phone: '',
          whatsapp: '',
          has_website: false,
          rating: 4.3,
          reviews: 19,
          address: 'Av. Geraldo Barbosa, 550 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_7',
          name: 'Novo Arado Restaurante e Lanchonete',
          niche: niche || 'Restaurantes',
          phone: '',
          whatsapp: '',
          has_website: false,
          rating: 4.3,
          reviews: 14,
          address: 'Rua São Paulo, 310 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_8',
          name: 'Panificadora Pão café',
          niche: niche || 'Restaurantes',
          phone: '(68) 99933-2190',
          whatsapp: '5568999332190',
          has_website: false,
          rating: 4.5,
          reviews: 26,
          address: 'Av. Brasil, 580 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_9',
          name: 'Pizzaria e Lanchonete Saborear',
          niche: niche || 'Restaurantes',
          phone: '(68) 99912-4455',
          whatsapp: '5568999124455',
          has_website: false,
          rating: 4.7,
          reviews: 38,
          address: 'Rua Rio de Janeiro, 140 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_10',
          name: 'Lanchonete e Sorveteria Ponto Chick',
          niche: niche || 'Restaurantes',
          phone: '(68) 99978-8812',
          whatsapp: '5568999788812',
          has_website: false,
          rating: 4.8,
          reviews: 51,
          address: 'Av. Geraldo Barbosa, 310 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_11',
          name: 'Lanchonete Doce Mel',
          niche: niche || 'Restaurantes',
          phone: '(68) 99955-1209',
          whatsapp: '5568999551209',
          has_website: false,
          rating: 4.6,
          reviews: 22,
          address: 'Rua Acre, 88 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_12',
          name: 'Espetinho do Gaucho',
          niche: niche || 'Restaurantes',
          phone: '(68) 99967-3341',
          whatsapp: '5568999673341',
          has_website: false,
          rating: 4.9,
          reviews: 17,
          address: 'Av. Brasil, 710 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_13',
          name: 'Restaurante Bom Paladar',
          niche: niche || 'Restaurantes',
          phone: '(68) 99989-5567',
          whatsapp: '5568999895567',
          has_website: false,
          rating: 4.4,
          reviews: 29,
          address: 'Rua São Paulo, 450 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_14',
          name: 'Cantinho do Pastel',
          niche: niche || 'Restaurantes',
          phone: '(68) 99923-4411',
          whatsapp: '5568999234411',
          has_website: false,
          rating: 4.7,
          reviews: 43,
          address: 'Av. Paraná, 210 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_15',
          name: 'Lanchonete e Açaiteria Tropical',
          niche: niche || 'Restaurantes',
          phone: '(68) 99911-7788',
          whatsapp: '5568999117788',
          has_website: false,
          rating: 4.5,
          reviews: 34,
          address: 'Rua Geraldo Barbosa, 620 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_16',
          name: 'Point do Hamburguer',
          niche: niche || 'Restaurantes',
          phone: '(68) 99945-8822',
          whatsapp: '5568999458822',
          has_website: false,
          rating: 4.6,
          reviews: 25,
          address: 'Rua Acre, 412 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_17',
          name: 'Pizzaria Bella Massa',
          niche: niche || 'Restaurantes',
          phone: '(68) 99966-1199',
          whatsapp: '5568999661199',
          has_website: false,
          rating: 4.8,
          reviews: 62,
          address: 'Av. Brasil, 830 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
        {
          id: 'res_ac_18',
          name: 'Restaurante Popular Acrelândia',
          niche: niche || 'Restaurantes',
          phone: '',
          whatsapp: '',
          has_website: false,
          rating: 4.2,
          reviews: 18,
          address: 'Rua Paraná, 510 - Centro',
          city: 'Acrelândia',
          state: 'Acre',
          saved_as_lead: false,
        },
      ];
      return acrelandiaLeads.slice(0, quantity || 18);
    }

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

    const noSiteCount = leads.filter((l) => !l.has_website).length;
    const withSiteCount = leads.filter((l) => l.has_website).length;
    const contactedCount = leads.filter((l) => l.status !== 'Novo lead' && l.status !== 'Não contatado').length;
    const inNegotiation = leads.filter((l) => l.status === 'Primeiro contato' || l.status === 'Respondeu').length;

    return {
      empresasEncontradas: user.searches_used * 12 + 450,
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

