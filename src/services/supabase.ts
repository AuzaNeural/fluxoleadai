import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-public-key'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helpers para sincronização com Supabase
export const supabaseService = {
  async getLeads() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Erro ao buscar leads do Supabase:', error.message);
      return null;
    }
    return data;
  },

  async insertLead(lead: any) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('leads').insert([lead]).select().single();
    if (error) {
      console.error('Erro ao inserir lead no Supabase:', error.message);
      return null;
    }
    return data;
  },

  async updateLead(id: string, updates: any) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) {
      console.error('Erro ao atualizar lead no Supabase:', error.message);
      return null;
    }
    return data;
  },

  async deleteLead(id: string) {
    if (!supabase) return null;
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir lead no Supabase:', error.message);
      return false;
    }
    return true;
  },

  async getReminders() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('reminders').select('*').order('due_at', { ascending: true });
    if (error) {
      console.error('Erro ao buscar lembretes do Supabase:', error.message);
      return null;
    }
    return data;
  },

  async insertReminder(reminder: any) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('reminders').insert([reminder]).select().single();
    if (error) {
      console.error('Erro ao inserir lembrete no Supabase:', error.message);
      return null;
    }
    return data;
  },

  async updateReminder(id: string, updates: any) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('reminders').update(updates).eq('id', id).select().single();
    if (error) {
      console.error('Erro ao atualizar lembrete no Supabase:', error.message);
      return null;
    }
    return data;
  },

  async deleteReminder(id: string) {
    if (!supabase) return null;
    const { error } = await supabase.from('reminders').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir lembrete no Supabase:', error.message);
      return false;
    }
    return true;
  },

  async getMessageTemplates() {
    if (!supabase) return null;
    const { data, error } = await supabase.from('message_templates').select('*').order('name', { ascending: true });
    if (error) {
      console.error('Erro ao buscar templates do Supabase:', error.message);
      return null;
    }
    return data;
  },

  async upsertMessageTemplate(template: any) {
    if (!supabase) return null;
    const { data, error } = await supabase.from('message_templates').upsert([template]).select().single();
    if (error) {
      console.error('Erro ao salvar template no Supabase:', error.message);
      return null;
    }
    return data;
  },

  async deleteMessageTemplate(id: string) {
    if (!supabase) return null;
    const { error } = await supabase.from('message_templates').delete().eq('id', id);
    if (error) {
      console.error('Erro ao excluir template no Supabase:', error.message);
      return false;
    }
    return true;
  }
};
