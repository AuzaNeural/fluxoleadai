import React from 'react';
import { ChevronRight } from 'lucide-react';
import historicoData from '../data/historico.json';

export const Historico: React.FC = () => {
  const { buscas, atividades } = historicoData;

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Histórico</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Histórico
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Todas as suas buscas e as ações importantes da conta.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        {/* Buscas */}
        <section className="fx-card xl:col-span-3">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Buscas</h2>
          </header>
          <div>
            <ul className="divide-y divide-line">
              {buscas.map((item, idx) => (
                <li key={idx}>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-fg">{item.term}</p>
                      <p className="text-xs text-fg-3">{item.dateInfo}</p>
                      <p className="text-xs text-fg-3">{item.stats}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success">
                      {item.status}
                    </span>
                    <ChevronRight className="size-4 text-fg-3" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Atividade da conta */}
        <section className="fx-card xl:col-span-2">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Atividade da conta</h2>
          </header>
          <div>
            <ul className="divide-y divide-line">
              {atividades.map((item, idx) => (
                <li key={idx} className="px-5 py-3">
                  <p className="text-sm text-fg-2">{item.title}</p>
                  <p className="text-xs text-fg-3">{item.date}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
