import React from 'react';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const PlanosAssinatura: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Assinatura</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Planos e assinatura
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Seu plano, seus limites de uso e o histórico de pagamentos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Card: Seu plano */}
        <section className="fx-card lg:col-span-1">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Seu plano</h2>
          </header>
          <div className="p-5">
            <div className="flex items-center gap-2">
              <p className="font-display text-2xl text-fg">Fluxo Lead Anual</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success">
                Ativa
              </span>
            </div>
            <p className="mt-3 text-sm text-fg-3">Próxima renovação: 18/10/2027</p>
          </div>
        </section>

        {/* Card: Uso neste mês */}
        <section className="fx-card lg:col-span-2">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Uso neste mês</h2>
          </header>
          <div className="p-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <p className="text-xs text-fg-3">Buscas</p>
                <p className="mt-1 font-display text-2xl text-fg tabular-nums">
                  15<span className="text-sm text-fg-3"> / ∞</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-3">Leads salvos</p>
                <p className="mt-1 font-display text-2xl text-fg tabular-nums">
                  6<span className="text-sm text-fg-3"> / ∞</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-fg-3">Empresas por busca</p>
                <p className="mt-1 font-display text-2xl text-fg tabular-nums">700</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <h2 className="mb-4 mt-10 font-display text-xl text-fg">Planos disponíveis</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* Fluxo Lead Mensal */}
        <article className="fx-card relative flex flex-col overflow-hidden p-6">
          <div className="relative">
            <h3 className="font-display text-xl text-fg">Fluxo Lead Mensal</h3>
            <p className="mt-1 text-sm text-fg-3">Acesso completo, cobrado todo mês.</p>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-[40px] leading-none text-fg">R$ 197,00</span>
              <span className="text-sm text-fg-3">por mês</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-fg-2">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Buscas ilimitadas
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Leads salvos ilimitados
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Até 700 empresas por busca
              </li>
            </ul>
            <div className="mt-7">
              <button
                type="button"
                onClick={() => showToast('Redirecionando para o checkout da Cakto...', 'info')}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-shiny text-fg h-12 px-7 text-[15px] w-full"
              >
                Assinar
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-fg-3">
              Pagamento seguro pela Cakto · cartão ou Pix
            </p>
          </div>
        </article>

        {/* Fluxo Lead Anual */}
        <article className="fx-card relative flex flex-col overflow-hidden p-6 border-accent/40">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative">
            <h3 className="font-display text-xl text-fg">Fluxo Lead Anual</h3>
            <p className="mt-1 text-sm text-fg-3">
              Acesso completo por 12 meses (à vista ou parcelado).
            </p>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-[40px] leading-none text-fg">R$ 297,00</span>
              <span className="text-sm text-fg-3">por ano</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-fg-2">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Buscas ilimitadas
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Leads salvos ilimitados
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-accent shrink-0" /> Até 700 empresas por busca
              </li>
            </ul>
            <div className="mt-7">
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 border border-line bg-surface-2 text-fg hover:border-line-strong hover:bg-surface-3 h-10 px-5 text-sm w-full"
              >
                Seu plano atual
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-fg-3">
              Pagamento seguro pela Cakto · cartão ou Pix
            </p>
          </div>
        </article>
      </div>

      {/* Histórico de pagamentos */}
      <section className="fx-card mt-10">
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="font-display text-[15px] text-fg">Histórico de pagamentos</h2>
        </header>
        <div>
          <div className="flex items-center gap-3 px-5 py-8 text-sm text-fg-3">
            <CreditCard className="size-4 text-fg-3" /> Nenhum pagamento registrado.
          </div>
        </div>
      </section>
    </div>
  );
};
