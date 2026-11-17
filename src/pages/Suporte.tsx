import React, { useState } from 'react';
import { Inbox, CheckCircle2 } from 'lucide-react';
import { storage } from '../services/storage';
import { mockApi } from '../services/mockApi';
import { SupportTicket } from '../types';
import { useToast } from '../context/ToastContext';

export const Suporte: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => storage.getTickets());
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      showToast('Preencha o assunto e a descrição do chamado.', 'error');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const newTicket = mockApi.createTicket(subject, description);
    setTickets([newTicket, ...tickets]);

    setSubject('');
    setDescription('');
    setLoading(false);
    showToast('Chamado enviado com sucesso! A resposta chegará por e-mail.', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Ajuda</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Suporte
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Abra um chamado. A resposta chega por e-mail e fica registrada aqui.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Novo chamado */}
        <section className="fx-card xl:col-span-2">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Novo chamado</h2>
          </header>
          <div className="p-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ts" className="text-[13px] font-medium text-fg-2">
                  Assunto
                </label>
                <input
                  id="ts"
                  maxLength={150}
                  required
                  placeholder=""
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tb" className="text-[13px] font-medium text-fg-2">
                  Descreva o que aconteceu
                </label>
                <textarea
                  id="tb"
                  rows={6}
                  maxLength={5000}
                  required
                  placeholder=""
                  className="w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60 h-auto min-h-24 py-2.5 leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-primary text-white h-10 px-5 text-sm"
                >
                  {loading ? 'Enviando...' : 'Enviar chamado'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Seus chamados */}
        <section className="fx-card xl:col-span-3">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Seus chamados</h2>
          </header>
          <div>
            {tickets.length === 0 ? (
              <div className="flex items-center gap-3 px-5 py-10 text-sm text-fg-3">
                <Inbox className="size-4 text-fg-3" /> Nenhum chamado aberto.
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {tickets.map((t) => (
                  <li key={t.id} className="p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-fg">{t.subject}</span>
                        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium border-accent/30 bg-accent/10 text-accent">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-fg-3 mt-1 line-clamp-2">{t.description}</p>
                      <p className="text-[11px] text-fg-3 mt-2">{t.created_at}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
