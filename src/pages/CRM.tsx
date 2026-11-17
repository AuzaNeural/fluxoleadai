import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  Pencil,
  Bell,
  Headphones,
  X,
  Info
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { useToast } from '../context/ToastContext';
import { KanbanStatus, Lead } from '../types';
import { isSupabaseConfigured, supabaseService } from '../services/supabase';

interface Reminder {
  id: string;
  title: string;
  dueAt: string;
  done: boolean;
  leadId?: string;
  leadName?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  body: string;
}

const STAGES: { name: KanbanStatus; dot: string }[] = [
  { name: 'Novo lead', dot: 'bg-accent' },
  { name: 'Não contatado', dot: 'bg-accent' },
  { name: 'Primeiro contato', dot: 'bg-accent' },
  { name: 'Respondeu', dot: 'bg-accent' },
  { name: 'Interessado', dot: 'bg-accent' },
  { name: 'Reunião marcada', dot: 'bg-accent' },
  { name: 'Proposta enviada', dot: 'bg-accent' },
  { name: 'Negociação', dot: 'bg-accent' },
  { name: 'Fechado', dot: 'bg-success' },
  { name: 'Perdido', dot: 'bg-fg-3' },
];

const DEFAULT_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl_1',
    name: 'Primeiro contato — sem site',
    body: 'Olá, tudo bem? Vi a {empresa} aqui em {cidade} e não encontrei um site de vocês. Eu crio sites profissionais prontos em poucos dias, com WhatsApp e localização. Posso te mostrar um modelo do seu segmento? — {meu_nome}'
  },
  {
    id: 'tpl_2',
    name: 'Primeiro contato — site com problema',
    body: 'Olá! Passei pelo site da {empresa} e notei que ele está com problema para abrir. Trabalho com sites rápidos e que funcionam bem no celular. Quer que eu te mande uma proposta sem compromisso? — {meu_nome}'
  },
  {
    id: 'tpl_3',
    name: 'Retorno',
    body: 'Oi! Voltando ao nosso papo sobre o site da {empresa}. Conseguiu ver o modelo que te mandei? Fico à disposição. — {meu_nome}'
  }
];

export const CRM: React.FC = () => {
  const { leads, updateLeadStatus } = useLeads();
  const { showToast } = useToast();

  // Active Tab: 'kanban' | 'tabela' | 'lembretes' | 'mensagens'
  const [activeTab, setActiveTab] = useState<'kanban' | 'tabela' | 'lembretes' | 'mensagens'>('kanban');

  const handleTabChange = (tab: 'kanban' | 'tabela' | 'lembretes' | 'mensagens') => {
    setActiveTab(tab);
  };

  // Drag and Drop
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: KanbanStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      updateLeadStatus(id, targetStatus);
      showToast(`Lead movido para "${targetStatus}"!`, 'success');
      setDraggedLeadId(null);
    }
  };

  // WhatsApp for Calls Modal State
  const [isCallsModalOpen, setIsCallsModalOpen] = useState(false);
  const [callsPaired, setCallsPaired] = useState(false);
  const [callsAcceptRisk, setCallsAcceptRisk] = useState(false);
  const [callsPreparing, setCallsPreparing] = useState(false);
  const [callsShowQr, setCallsShowQr] = useState(false);
  const [isTestingAudio, setIsTestingAudio] = useState(false);

  // Sound Test (Web Audio API)
  const handleTestPhoneAudio = () => {
    try {
      setIsTestingAudio(true);
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      setTimeout(() => {
        setIsTestingAudio(false);
        showToast('Som de teste reproduzido com sucesso.', 'info');
      }, 400);
    } catch {
      setIsTestingAudio(false);
      showToast('Dispositivo de áudio testado.', 'info');
    }
  };

  const handleConnectCalls = () => {
    setCallsPreparing(true);
    setTimeout(() => {
      setCallsPreparing(false);
      setCallsShowQr(true);
    }, 600);
  };

  const handleDisconnectCalls = () => {
    setCallsPaired(false);
    setCallsShowQr(false);
    setCallsPreparing(false);
    setCallsAcceptRisk(false);
  };

  // Call Lead Direct Modal
  const [callLeadModalTarget, setCallLeadModalTarget] = useState<Lead | null>(null);
  const [callLeadAuthorized, setCallLeadAuthorized] = useState(false);

  const handleOpenCallLeadModal = (lead: Lead) => {
    setCallLeadAuthorized(false);
    setCallLeadModalTarget(lead);
  };

  const handleStartCall = () => {
    if (!callLeadModalTarget) return;
    if (!callsPaired && !callsShowQr) {
      setCallLeadModalTarget(null);
      setIsCallsModalOpen(true);
      showToast('Conecte seu WhatsApp para realizar ligações.', 'info');
      return;
    }
    showToast(`Iniciando chamada para ${callLeadModalTarget.company_name}...`, 'success');
    setCallLeadModalTarget(null);
  };

  // Reminders (Lembretes) State
  const [reminderFilter, setReminderFilter] = useState<'pendentes' | 'concluidos'>('pendentes');
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    try {
      const saved = localStorage.getItem('fluxo_crm_reminders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isNewReminderModalOpen, setIsNewReminderModalOpen] = useState(false);
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderDueAt, setNewReminderDueAt] = useState('');

  const saveRemindersToStorage = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem('fluxo_crm_reminders', JSON.stringify(updated));
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim() || !newReminderDueAt) return;

    const newRem: Reminder = {
      id: 'rem_' + Date.now(),
      title: newReminderTitle.trim(),
      dueAt: new Date(newReminderDueAt).toISOString(),
      done: false
    };

    saveRemindersToStorage([...reminders, newRem]);
    if (isSupabaseConfigured) {
      supabaseService.insertReminder({
        id: newRem.id,
        title: newRem.title,
        due_at: newRem.dueAt,
        done: false
      });
    }
    showToast('Lembrete criado.', 'success');
    setIsNewReminderModalOpen(false);
    setNewReminderTitle('');
    setNewReminderDueAt('');
  };

  const handleToggleReminder = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );
    saveRemindersToStorage(updated);
    if (isSupabaseConfigured && target) {
      supabaseService.updateReminder(id, { done: !target.done });
    }
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveRemindersToStorage(updated);
    if (isSupabaseConfigured) {
      supabaseService.deleteReminder(id);
    }
    showToast('Lembrete excluído.', 'info');
  };

  const pendingReminders = reminders.filter((r) => !r.done);
  const completedReminders = reminders.filter((r) => r.done);
  const displayedReminders = reminderFilter === 'pendentes' ? pendingReminders : completedReminders;

  // Supabase Initial Sync for CRM
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabaseService.getReminders().then((data) => {
        if (data && data.length > 0) {
          const mapped: Reminder[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            dueAt: d.due_at,
            done: d.done,
            leadId: d.lead_id,
            leadName: d.lead_name
          }));
          setReminders(mapped);
          localStorage.setItem('fluxo_crm_reminders', JSON.stringify(mapped));
        }
      });

      supabaseService.getMessageTemplates().then((data) => {
        if (data && data.length > 0) {
          const mapped: MessageTemplate[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            body: d.body
          }));
          setMessageTemplates(mapped);
          localStorage.setItem('fluxo_crm_message_templates', JSON.stringify(mapped));
        }
      });
    }
  }, []);

  // Message Templates (Modelos de Mensagens) State
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('fluxo_crm_message_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [editingTemplate, setEditingTemplate] = useState<{
    id: string | null;
    name: string;
    body: string;
  } | null>(null);

  const saveTemplatesToStorage = (updated: MessageTemplate[]) => {
    setMessageTemplates(updated);
    localStorage.setItem('fluxo_crm_message_templates', JSON.stringify(updated));
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate || !editingTemplate.name.trim() || !editingTemplate.body.trim()) return;

    if (editingTemplate.id) {
      // Edit
      const updated = messageTemplates.map((t) =>
        t.id === editingTemplate.id
          ? { ...t, name: editingTemplate.name.trim(), body: editingTemplate.body.trim() }
          : t
      );
      saveTemplatesToStorage(updated);
      if (isSupabaseConfigured) {
        supabaseService.upsertMessageTemplate({
          id: editingTemplate.id,
          name: editingTemplate.name.trim(),
          body: editingTemplate.body.trim()
        });
      }
      showToast('Modelo salvo e definido como padrão da sua conta.', 'success');
    } else {
      // Create new
      const newTpl: MessageTemplate = {
        id: 'tpl_' + Date.now(),
        name: editingTemplate.name.trim(),
        body: editingTemplate.body.trim()
      };
      saveTemplatesToStorage([...messageTemplates, newTpl]);
      if (isSupabaseConfigured) {
        supabaseService.upsertMessageTemplate({
          id: newTpl.id,
          name: newTpl.name,
          body: newTpl.body
        });
      }
      showToast('Modelo salvo e definido como padrão da sua conta.', 'success');
    }

    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    const updated = messageTemplates.filter((t) => t.id !== id);
    saveTemplatesToStorage(updated);
    if (isSupabaseConfigured) {
      supabaseService.deleteMessageTemplate(id);
    }
    showToast('Modelo excluído.', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* =========================================================================
          1. CABEÇALHO DO CRM (100% IDÊNTICO AO ORIGINAL)
          ========================================================================= */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">CRM</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Suas oportunidades
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Arraste os cards entre as etapas, registre cada contato e não perca nenhum retorno.
          </p>
        </div>
      </div>

      {/* Botão Conectar WhatsApp para ligações */}
      <div className="mb-5">
        <button
          type="button"
          onClick={() => setIsCallsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm"
        >
          <Phone className="size-4" />
          Conectar WhatsApp para ligações
        </button>
      </div>

      {/* =========================================================================
          2. ABAS DE NAVEGAÇÃO: KANBAN | TABELA | LEMBRETES | MENSAGENS
          ========================================================================= */}
      <nav className="mb-5 flex gap-1 overflow-x-auto border-b border-line" aria-label="Seções do CRM">
        <button
          type="button"
          onClick={() => handleTabChange('kanban')}
          className={`relative whitespace-nowrap px-4 pb-3 pt-1 text-sm transition-colors cursor-pointer ${
            activeTab === 'kanban' ? 'text-fg font-medium' : 'text-fg-3 hover:text-fg-2'
          }`}
        >
          Kanban
          {activeTab === 'kanban' && (
            <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-[0_0_10px_rgba(250,38,0,0.7)]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tabela')}
          className={`relative whitespace-nowrap px-4 pb-3 pt-1 text-sm transition-colors cursor-pointer ${
            activeTab === 'tabela' ? 'text-fg font-medium' : 'text-fg-3 hover:text-fg-2'
          }`}
        >
          Tabela
          {activeTab === 'tabela' && (
            <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-[0_0_10px_rgba(250,38,0,0.7)]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('lembretes')}
          className={`relative whitespace-nowrap px-4 pb-3 pt-1 text-sm transition-colors cursor-pointer ${
            activeTab === 'lembretes' ? 'text-fg font-medium' : 'text-fg-3 hover:text-fg-2'
          }`}
        >
          Lembretes
          {activeTab === 'lembretes' && (
            <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-[0_0_10px_rgba(250,38,0,0.7)]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('mensagens')}
          className={`relative whitespace-nowrap px-4 pb-3 pt-1 text-sm transition-colors cursor-pointer ${
            activeTab === 'mensagens' ? 'text-fg font-medium' : 'text-fg-3 hover:text-fg-2'
          }`}
        >
          Mensagens
          {activeTab === 'mensagens' && (
            <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent shadow-[0_0_10px_rgba(250,38,0,0.7)]" />
          )}
        </button>
      </nav>

      {/* =========================================================================
          3. ABA 1: KANBAN COM 10 COLUNAS
          ========================================================================= */}
      {activeTab === 'kanban' && (
        <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="flex min-w-max gap-3">
            {STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage.name);
              const count = stageLeads.length;

              return (
                <section
                  key={stage.name}
                  aria-label={`Etapa ${stage.name}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.name)}
                  className="flex w-[272px] flex-col rounded-[18px] border bg-surface/70 transition-colors border-line"
                >
                  <header className="flex items-center justify-between px-3.5 py-3">
                    <h3 className="flex items-center gap-2 text-[13px] font-medium text-fg">
                      <span className={`size-2 rounded-full ${stage.dot}`} />
                      {stage.name}
                    </h3>
                    <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] tabular-nums text-fg-3">
                      {count}
                    </span>
                  </header>

                  <div className="flex max-h-[68vh] min-h-24 flex-col gap-2 overflow-y-auto px-2.5 pb-2.5">
                    {stageLeads.map((lead) => {
                      const isWorking = lead.website_status === 'Site funcionando';
                      const hasProblem = lead.website_status === 'Problema confirmado';

                      return (
                        <article
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          className="group cursor-grab rounded-[14px] border border-line bg-surface-3 p-3 transition-[border-color,opacity,transform] hover:border-line-strong active:cursor-grabbing"
                        >
                          <a
                            className="block text-sm font-medium leading-snug text-fg hover:text-accent-soft cursor-pointer"
                          >
                            {lead.company_name}
                          </a>
                          <p className="mt-0.5 truncate text-xs text-fg-3">
                            {lead.neighborhood || 'Centro'}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {isWorking ? (
                              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success !text-[10.5px]">
                                Site funcionando
                              </span>
                            ) : hasProblem ? (
                              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-danger/30 bg-danger/10 text-danger !text-[10.5px]">
                                Problema confirmado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-accent/30 bg-accent/10 text-accent-soft !text-[10.5px]">
                                Site não informado
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-fg-3">{lead.phone}</span>
                            <button
                              type="button"
                              title={`Ligar para ${lead.company_name} pelo WhatsApp`}
                              aria-label={`Ligar para ${lead.company_name}`}
                              onClick={() => handleOpenCallLeadModal(lead)}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-8 px-3 text-[13px]"
                            >
                              <Phone className="size-3.5" />
                              <span className="sr-only">Ligar</span>
                            </button>
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`WhatsApp de ${lead.company_name}`}
                              className="text-fg-3 hover:text-success"
                              href={`https://wa.me/${(lead.whatsapp || lead.phone).replace(/\D/g, '')}`}
                            >
                              <MessageCircle className="size-4" />
                            </a>
                          </div>

                          <label className="sr-only" htmlFor={`mv-${lead.id}`}>
                            Mover {lead.company_name} para
                          </label>
                          <select
                            id={`mv-${lead.id}`}
                            value={lead.status}
                            onChange={(e) => {
                              updateLeadStatus(lead.id, e.target.value as KanbanStatus);
                              showToast(`Lead movido para "${e.target.value}"!`, 'success');
                            }}
                            className="mt-2 h-7 w-full rounded-lg border border-line bg-surface-2 px-2 text-[11px] text-fg-3 lg:hidden lg:group-focus-within:block"
                          >
                            {STAGES.map((s) => (
                              <option key={s.name} value={s.name}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. ABA 2: TABELA DE LEADS DO CRM
          ========================================================================= */}
      {activeTab === 'tabela' && (
        <div className="fx-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line text-[11.5px] uppercase tracking-wide text-fg-3">
                <tr>
                  <th className="px-5 py-3 font-medium">Empresa</th>
                  <th className="px-3 py-3 font-medium">Etapa</th>
                  <th className="px-3 py-3 font-medium">Contato</th>
                  <th className="px-3 py-3 font-medium">Próximo contato</th>
                  <th className="px-3 py-3 font-medium">Última atualização</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-line hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <a
                        className="font-medium text-fg hover:text-accent-soft cursor-pointer"
                      >
                        {lead.company_name}
                      </a>
                      <p className="text-xs text-fg-3">
                        {lead.neighborhood || 'Centro'} · {lead.city || 'São Paulo'}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <select
                        aria-label={`Etapa de ${lead.company_name}`}
                        value={lead.status}
                        onChange={(e) => {
                          updateLeadStatus(lead.id, e.target.value as KanbanStatus);
                          showToast(`Etapa alterada para "${e.target.value}"`, 'success');
                        }}
                        className="h-8 w-44 rounded-[12px] border border-line bg-surface-2 px-3 text-xs text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 appearance-none bg-[url('data:image/svg+xml;utf8,<svg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23929292%22%20stroke-width=%222%22><path%20d=%22m2%204%204%204%204-4%22/></svg>')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-9 cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.name} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title={`Ligar para ${lead.company_name} pelo WhatsApp`}
                          aria-label={`Ligar para ${lead.company_name}`}
                          onClick={() => handleOpenCallLeadModal(lead)}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-8 px-3 text-[13px]"
                        >
                          <Phone className="size-3.5" />
                          <span className="sr-only">Ligar</span>
                        </button>
                        {lead.contacted ? (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success">
                            Contatado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-line bg-white/[0.04] text-fg-2">
                            Não contatado
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-xs text-fg-2">—</td>

                    <td className="px-3 py-3 text-xs text-fg-3">
                      <time>{lead.updated_at || 'há 10 horas'}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-xs text-fg-3">
            <span>{leads.length} lead(s) · página 1 de 1</span>
            <div className="flex gap-2" />
          </div>
        </div>
      )}

      {/* =========================================================================
          5. ABA 3: LEMBRETES (100% IDÊNTICO AO ORIGINAL)
          ========================================================================= */}
      {activeTab === 'lembretes' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setReminderFilter('pendentes')}
                className={`h-8 rounded-full border px-3 text-xs transition-colors cursor-pointer ${
                  reminderFilter === 'pendentes'
                    ? 'border-accent/50 bg-accent/10 text-accent-soft'
                    : 'border-line text-fg-3 hover:text-fg-2'
                }`}
              >
                Pendentes ({pendingReminders.length})
              </button>
              <button
                type="button"
                onClick={() => setReminderFilter('concluidos')}
                className={`h-8 rounded-full border px-3 text-xs transition-colors cursor-pointer ${
                  reminderFilter === 'concluidos'
                    ? 'border-accent/50 bg-accent/10 text-accent-soft'
                    : 'border-line text-fg-3 hover:text-fg-2'
                }`}
              >
                Concluídos ({completedReminders.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsNewReminderModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-8 px-3 text-[13px] cursor-pointer"
            >
              <Plus className="size-4" />
              Novo lembrete
            </button>
          </div>

          {displayedReminders.length === 0 ? (
            <div className="fx-card relative flex flex-col items-center justify-center overflow-hidden px-6 py-14 text-center">
              <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(250,38,0,0.18),transparent)]" />
              <div className="relative mb-4 grid size-12 place-items-center rounded-2xl border border-line bg-surface-3 text-accent-soft">
                <Bell className="size-5" />
              </div>
              <h3 className="relative font-display text-lg text-fg font-medium">
                {reminderFilter === 'pendentes' ? 'Nenhum lembrete pendente' : 'Nada concluído ainda'}
              </h3>
              <p className="relative mt-1.5 max-w-md text-sm leading-relaxed text-fg-3">
                Crie lembretes para retornos e reuniões. Eles aparecem na visão geral.
              </p>
            </div>
          ) : (
            <ul className="fx-card divide-y divide-line">
              {displayedReminders.map((rem) => {
                const isLate = !rem.done && new Date(rem.dueAt) < new Date();
                return (
                  <li key={rem.id} className="flex items-start gap-3 px-5 py-3.5">
                    <input
                      type="checkbox"
                      aria-label={`Concluir ${rem.title}`}
                      checked={rem.done}
                      onChange={() => handleToggleReminder(rem.id)}
                      className="mt-1 size-4 accent-[#fa2600] cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={rem.done ? 'text-sm text-fg-3 line-through' : 'text-sm text-fg'}>
                        {rem.title}
                      </p>
                      <p className={`text-xs ${isLate ? 'text-warning' : 'text-fg-3'}`}>
                        {isLate ? 'Atrasado · ' : ''}
                        {new Date(rem.dueAt).toLocaleString('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                        {rem.leadName ? ` · ${rem.leadName}` : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="Excluir lembrete"
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="rounded-full p-1.5 text-fg-3 hover:bg-white/5 hover:text-danger cursor-pointer transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* =========================================================================
          6. ABA 4: MENSAGENS (100% IDÊNTICO AO ORIGINAL)
          ========================================================================= */}
      {activeTab === 'mensagens' && (
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-2xl text-sm text-fg-3 leading-relaxed">
              Modelos para abordar seus leads. Use as variáveis{' '}
              <code className="text-accent-soft">{'{empresa}'}</code>,{' '}
              <code className="text-accent-soft">{'{cidade}'}</code>,{' '}
              <code className="text-accent-soft">{'{bairro}'}</code>,{' '}
              <code className="text-accent-soft">{'{segmento}'}</code> e{' '}
              <code className="text-accent-soft">{'{meu_nome}'}</code>. O segmento usa a categoria da empresa; se ela não estiver disponível, tenta o nicho e o nome. Sem identificação, usa “atuação de vocês”. Ao salvar um modelo, ele passa a ser o padrão da sua conta nos atalhos do WhatsApp. Você revisa e envia a mensagem — não há disparo automático.
            </p>
            <button
              type="button"
              onClick={() => setEditingTemplate({ id: null, name: '', body: '' })}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-8 px-3 text-[13px] cursor-pointer"
            >
              <Plus className="size-4" />
              Novo modelo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {messageTemplates.map((tpl) => (
              <article key={tpl.id} className="fx-card flex flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-display text-[15px] font-medium text-fg">{tpl.name}</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label={`Editar ${tpl.name}`}
                      onClick={() => setEditingTemplate({ id: tpl.id, name: tpl.name, body: tpl.body })}
                      className="rounded-full p-1.5 text-fg-3 hover:bg-white/5 hover:text-fg transition-colors cursor-pointer"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir ${tpl.name}`}
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="rounded-full p-1.5 text-fg-3 hover:bg-white/5 hover:text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg-2">{tpl.body}</p>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODAL: SEU WHATSAPP PARA LIGAÇÕES
          ========================================================================= */}
      {isCallsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="fx-card m-auto w-[calc(100vw-2rem)] max-w-xl max-h-[92vh] overflow-y-auto bg-surface p-5 sm:p-6 text-fg rounded-2xl border border-line relative animate-scale-up space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-medium text-fg">Seu WhatsApp para ligações</h3>
                <p className="text-xs text-fg-3 mt-1">
                  Conexão exclusiva para chamadas manuais dentro do Fluxo Lead.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCallsModalOpen(false)}
                className="rounded-lg p-1 text-fg-3 hover:text-fg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-sm text-fg-2">
              <Headphones className="mr-2 inline size-4" />
              Use um fone com microfone para evitar eco. A conexão de mensagens do Vendedor permanece separada.
            </p>

            <div>
              <button
                type="button"
                disabled={isTestingAudio}
                onClick={handleTestPhoneAudio}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-8 px-3 text-[13px] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Headphones className="size-4" />
                <span>Testar fone</span>
              </button>
              <p className="mt-1 text-xs text-fg-3">
                Reproduz um som curto neste dispositivo, sem ligar nem usar o microfone.
              </p>
            </div>

            {callsPaired ? (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-success font-medium">WhatsApp conectado</p>
                <p className="text-sm text-fg-3">
                  Use o botão Ligar nos seus leads ou no CRM. Tentativas hoje: 0/50.
                </p>
                <button
                  type="button"
                  onClick={handleDisconnectCalls}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface-2 text-fg hover:bg-surface-3 h-8 px-3 text-xs cursor-pointer"
                >
                  Desconectar este WhatsApp
                </button>
              </div>
            ) : callsShowQr ? (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-fg-2">
                  No celular, abra WhatsApp → Aparelhos conectados → Conectar um aparelho.
                </p>
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl w-fit mx-auto shadow-lg">
                  <img
                    src="/brand/whatsapp-qr.png"
                    alt="QR Code WhatsApp"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCallsPreparing(true);
                      setCallsShowQr(false);
                      setTimeout(() => {
                        setCallsPreparing(false);
                        setCallsShowQr(true);
                        showToast('Novo QR Code gerado.', 'info');
                      }, 500);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface-2 text-fg hover:bg-surface-3 h-8 px-3 text-xs cursor-pointer"
                  >
                    Gerar novo QR
                  </button>
                  <button
                    type="button"
                    onClick={handleDisconnectCalls}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-1 text-xs text-fg-3 hover:text-fg cursor-pointer"
                  >
                    Cancelar conexão
                  </button>
                </div>
              </div>
            ) : callsPreparing ? (
              <div className="space-y-3 py-4 text-center">
                <p role="status" className="text-sm text-fg-3 animate-pulse">
                  Preparando conexão…
                </p>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="rounded-xl border border-warning/25 bg-warning/5 p-3 text-sm text-fg-2">
                  Esta conexão usa um cliente não oficial do WhatsApp. O número pode sofrer restrições da plataforma. Conecte um número dedicado.
                </p>
                <label className="flex items-start gap-3 text-sm text-fg-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={callsAcceptRisk}
                    onChange={(e) => setCallsAcceptRisk(e.target.checked)}
                    className="mt-1 size-4 accent-[#fa2600]"
                  />
                  <span>Entendi e quero conectar meu número para ligações.</span>
                </label>
                <button
                  type="button"
                  disabled={!callsAcceptRisk}
                  onClick={handleConnectCalls}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium fx-btn-primary text-white h-9 px-4 text-sm disabled:opacity-50 cursor-pointer"
                >
                  Conectar WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODAL: LIGAR PARA LEAD ESPECÍFICO
          ========================================================================= */}
      {callLeadModalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="fx-card m-auto w-[calc(100vw-2rem)] max-w-xl max-h-[92vh] overflow-y-auto bg-surface p-5 sm:p-6 text-fg rounded-2xl border border-line relative animate-scale-up space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg font-medium text-fg">
                  Ligar para {callLeadModalTarget.company_name}
                </h3>
                <p className="text-xs text-fg-3 mt-1">Chamada de áudio via WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => setCallLeadModalTarget(null)}
                className="rounded-lg p-1 text-fg-3 hover:text-fg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-sm text-fg-2">
              Você conversa pelo microfone e ouve o cliente aqui no Fluxo Lead. A chamada chega no WhatsApp do contato.
            </p>
            <p className="text-sm text-fg-3">
              Número do contato: <span className="text-fg font-medium">{callLeadModalTarget.phone}</span>. Nenhum áudio é gravado. Limite de 5 minutos por ligação.
            </p>

            <label className="mt-5 flex items-start gap-3 text-sm text-fg-2 cursor-pointer">
              <input
                type="checkbox"
                checked={callLeadAuthorized}
                onChange={(e) => setCallLeadAuthorized(e.target.checked)}
                className="mt-1 size-4 accent-[#fa2600]"
              />
              <span>Confirmo que este contato autorizou receber esta ligação.</span>
            </label>

            <div className="mt-6 flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setCallLeadModalTarget(null)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs text-fg-3 hover:text-fg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!callLeadAuthorized}
                onClick={handleStartCall}
                className="inline-flex items-center justify-center gap-2 rounded-full fx-btn-primary text-white h-9 px-4 text-xs font-medium disabled:opacity-50 cursor-pointer"
              >
                <Phone className="size-3.5" />
                <span>Ligar agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. MODAL: NOVO LEMBRETE
          ========================================================================= */}
      {isNewReminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="fx-card m-auto w-[calc(100vw-2rem)] max-w-md max-h-[92vh] overflow-y-auto bg-surface p-5 sm:p-6 text-fg rounded-2xl border border-line relative animate-scale-up space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-medium text-fg">Novo lembrete</h3>
              <button
                type="button"
                onClick={() => setIsNewReminderModalOpen(false)}
                className="rounded-lg p-1 text-fg-3 hover:text-fg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminder} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-fg-3 mb-1.5">
                  O que fazer
                </label>
                <input
                  type="text"
                  required
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  placeholder="Ex: Retornar para apresentar proposta"
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-3 mb-1.5">
                  Quando
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newReminderDueAt}
                  onChange={(e) => setNewReminderDueAt(e.target.value)}
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewReminderModalOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs text-fg-3 hover:text-fg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newReminderTitle.trim() || !newReminderDueAt}
                  className="inline-flex items-center justify-center gap-2 rounded-full fx-btn-primary text-white h-9 px-5 text-xs font-medium disabled:opacity-50 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. MODAL: NOVO MODELO / EDITAR MODELO
          ========================================================================= */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="fx-card m-auto w-[calc(100vw-2rem)] max-w-xl max-h-[92vh] overflow-y-auto bg-surface p-5 sm:p-6 text-fg rounded-2xl border border-line relative animate-scale-up space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-medium text-fg">
                {editingTemplate.id ? 'Editar modelo' : 'Novo modelo'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="rounded-lg p-1 text-fg-3 hover:text-fg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-fg-3 mb-1.5">
                  Nome do modelo
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  placeholder="Ex: Abordagem inicial"
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-fg-3 mb-1.5">
                  Mensagem
                </label>
                <textarea
                  required
                  rows={7}
                  maxLength={2000}
                  value={editingTemplate.body}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, body: e.target.value })
                  }
                  placeholder="Olá {empresa}, tudo bem?"
                  className="w-full rounded-[12px] border border-line bg-surface-2 p-3 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 p-3 text-xs text-fg-3">
                <Info className="size-4 shrink-0 mt-0.5 text-fg-3" />
                <span>
                  Mensagens em massa sem consentimento violam as regras do WhatsApp e a LGPD. Envie uma a uma, para quem faz sentido.
                </span>
              </div>

              <div className="mt-4 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs text-fg-3 hover:text-fg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!editingTemplate.name.trim() || !editingTemplate.body.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-full fx-btn-primary text-white h-9 px-5 text-xs font-medium disabled:opacity-50 cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
