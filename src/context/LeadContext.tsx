import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KanbanStatus, Lead, Project, WhatsAppInstance } from '../types';
import { storage } from '../services/storage';
import { mockApi } from '../services/mockApi';
import { isSupabaseConfigured, supabaseService } from '../services/supabase';

interface LeadContextData {
  leads: Lead[];
  projects: Project[];
  whatsapp: WhatsAppInstance;
  stats: ReturnType<typeof mockApi.getDashboardStats>;
  addLead: (lead: Omit<Lead, 'id' | 'created_at'>) => void;
  updateLeadStatus: (leadId: string, newStatus: KanbanStatus) => void;
  deleteLead: (leadId: string) => void;
  createProject: (name: string, templateId?: string) => Project;
  publishProject: (id: string, url: string) => void;
  toggleWhatsAppAI: (active: boolean) => Promise<void>;
  connectWhatsApp: (phone: string) => Promise<void>;
  disconnectWhatsApp: () => Promise<void>;
  refreshData: () => void;
}

const LeadContext = createContext<LeadContextData>({} as LeadContextData);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => storage.getLeads());
  const [projects, setProjects] = useState<Project[]>(() => storage.getProjects());
  const [whatsapp, setWhatsapp] = useState<WhatsAppInstance>(() => storage.getWhatsApp());
  const [stats, setStats] = useState(() => mockApi.getDashboardStats());

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabaseService.getLeads().then((data) => {
        if (data) {
          setLeads(data as Lead[]);
          storage.setLeads(data as Lead[]);
        }
      });
    }
  }, []);

  const refreshData = () => {
    setLeads(storage.getLeads());
    setProjects(storage.getProjects());
    setWhatsapp(storage.getWhatsApp());
    setStats(mockApi.getDashboardStats());
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      created_at: 'Hoje às ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newLead, ...leads];
    storage.setLeads(updated);
    setLeads(updated);
    refreshData();

    if (isSupabaseConfigured) {
      supabaseService.insertLead(newLead);
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: KanbanStatus) => {
    const updated = mockApi.updateLeadStatus(leadId, newStatus);
    setLeads(updated);
    setStats(mockApi.getDashboardStats());

    if (isSupabaseConfigured) {
      supabaseService.updateLead(leadId, { status: newStatus });
    }
  };

  const deleteLead = (leadId: string) => {
    const updated = leads.filter((l) => l.id !== leadId);
    storage.setLeads(updated);
    setLeads(updated);
    setStats(mockApi.getDashboardStats());

    if (isSupabaseConfigured) {
      supabaseService.deleteLead(leadId);
    }
  };

  const createProject = (name: string, templateId?: string) => {
    const newProj = mockApi.createProject(name, templateId);
    setProjects(storage.getProjects());
    setStats(mockApi.getDashboardStats());
    return newProj;
  };

  const publishProject = (id: string, url: string) => {
    const updated = mockApi.publishProject(id, url);
    setProjects(updated);
  };

  const toggleWhatsAppAI = async (active: boolean) => {
    const updated = await mockApi.toggleWhatsAppAI(active);
    setWhatsapp(updated);
  };

  const connectWhatsApp = async (phone: string) => {
    const updated = await mockApi.connectWhatsApp(phone);
    setWhatsapp(updated);
  };

  const disconnectWhatsApp = async () => {
    const updated = await mockApi.disconnectWhatsApp();
    setWhatsapp(updated);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        projects,
        whatsapp,
        stats,
        addLead,
        updateLeadStatus,
        deleteLead,
        createProject,
        publishProject,
        toggleWhatsAppAI,
        connectWhatsApp,
        disconnectWhatsApp,
        refreshData
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);

