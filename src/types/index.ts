export type KanbanStatus = 
  | 'Novo lead'
  | 'Não contatado'
  | 'Primeiro contato'
  | 'Respondeu'
  | 'Interessado'
  | 'Reunião marcada'
  | 'Proposta enviada'
  | 'Negociação'
  | 'Fechado'
  | 'Perdido';

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan_type: 'Fluxo Lead Anual' | 'Fluxo Lead Mensal';
  searches_used: number;
  searches_limit: number;
  leads_count: number;
  avatar_initial: string;
  renewal_date: string;
  confirmed_email: boolean;
}

export interface ActiveSession {
  id: string;
  browser: string;
  ip: string;
  last_active: string;
  is_current: boolean;
}

export interface SearchFilterState {
  hasPhone: boolean;
  hasWhatsapp: boolean;
  hasWebsite: boolean;
  noWebsite: boolean;
  alreadyRegistered: boolean;
  notContactedYet: boolean;
}

export interface Company {
  id: string;
  name: string;
  niche: string;
  phone: string;
  whatsapp?: string;
  has_website: boolean;
  website?: string;
  rating: number;
  reviews: number;
  address: string;
  city: string;
  state: string;
  saved_as_lead?: boolean;
}

export interface Lead {
  id: string;
  company_name: string;
  niche: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  status: KanbanStatus;
  has_website: boolean;
  website?: string;
  website_status?: 'Site funcionando' | 'Site não informado' | 'Problema confirmado' | 'Site com falha';
  whatsapp_confirmed?: boolean;
  neighborhood?: string;
  city?: string;
  state?: string;
  source?: string;
  next_contact?: string;
  updated_at?: string;
  notes?: string;
  created_at: string;
  tags?: string[];
  contacted?: boolean;
}

export interface Project {
  id: string;
  name: string;
  template_id?: string;
  status: 'Draft' | 'Published';
  url?: string;
  created_at: string;
  updated_at: string;
  category: string;
  thumbnail: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  image_url: string;
  description: string;
  popular?: boolean;
}

export interface WhatsAppInstance {
  id: string;
  name: string;
  phone: string;
  status: 'Connected' | 'Disconnected';
  ai_status: 'Active' | 'Paused';
  contacts_count: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'Aberto' | 'Em Análise' | 'Resolvido';
  created_at: string;
}

export interface HistoryItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'Busca' | 'Lead' | 'CRM' | 'WhatsApp' | 'Projeto' | 'Conta';
}

