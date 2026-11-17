import React, { useState } from 'react';
import { Laptop, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ActiveSessionItem {
  id: string;
  device: string;
  ip: string;
  activeTime: string;
  loginTime: string;
  isCurrent?: boolean;
}

export const Configuracoes: React.FC = () => {
  const { showToast } = useToast();

  const [nome, setNome] = useState('Anderson');
  const [empresa, setEmpresa] = useState('fluxo');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [repitaSenha, setRepitaSenha] = useState('');

  const [sessions, setSessions] = useState<ActiveSessionItem[]>([
    {
      id: 's1',
      device: 'Navegador · Windows',
      ip: '104.28.235.105',
      activeTime: 'há 2 minutos',
      loginTime: 'há 3 dias',
      isCurrent: true
    },
    {
      id: 's2',
      device: 'Chrome · Windows',
      ip: '104.28.235.105',
      activeTime: 'há 5 minutos',
      loginTime: 'há 4 dias'
    },
    {
      id: 's3',
      device: 'Chrome · Windows',
      ip: '45.226.73.87',
      activeTime: 'há 4 dias',
      loginTime: 'há 28 dias'
    }
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senhaAtual) {
      showToast('Digite a senha atual.', 'error');
      return;
    }
    if (novaSenha.length < 8) {
      showToast('A nova senha deve ter no mínimo 8 caracteres.', 'error');
      return;
    }
    if (novaSenha !== repitaSenha) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }
    showToast('Senha alterada com sucesso!', 'success');
    setSenhaAtual('');
    setNovaSenha('');
    setRepitaSenha('');
  };

  const handleEndSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    showToast('Sessão encerrada com sucesso.', 'info');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="fx-eyebrow mb-2">Conta</p>
          <h1 className="font-display text-[26px] leading-tight text-fg sm:text-[30px]">
            Configurações
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-fg-3">
            Seu perfil, segurança da conta e dispositivos conectados.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Perfil */}
        <section className="fx-card">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Perfil</h2>
          </header>
          <div className="p-5">
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nome" className="text-[13px] font-medium text-fg-2">
                  Nome
                </label>
                <input
                  id="nome"
                  maxLength={120}
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="empresa" className="text-[13px] font-medium text-fg-2">
                  Empresa
                </label>
                <input
                  id="empresa"
                  maxLength={120}
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-medium text-fg-2">
                  E-mail
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="email"
                    disabled
                    className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                    value="juliasouzamartins71@gmail.com"
                  />
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success">
                    Confirmado
                  </span>
                </div>
                <p className="text-xs text-fg-3">
                  Para trocar o e-mail da conta, fale com o suporte.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-shiny text-fg h-10 px-5 text-sm"
                >
                  Salvar perfil
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Alterar senha */}
        <section className="fx-card">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Alterar senha</h2>
          </header>
          <div className="p-5">
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="sa" className="text-[13px] font-medium text-fg-2">
                  Senha atual
                </label>
                <input
                  id="sa"
                  type="password"
                  autoComplete="current-password"
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sn" className="text-[13px] font-medium text-fg-2">
                  Nova senha
                </label>
                <input
                  id="sn"
                  type="password"
                  autoComplete="new-password"
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
                <p className="text-xs text-fg-3">
                  Mínimo de 8 caracteres, com letras e números.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="sc" className="text-[13px] font-medium text-fg-2">
                  Repita a nova senha
                </label>
                <input
                  id="sc"
                  type="password"
                  autoComplete="new-password"
                  className="h-10 w-full rounded-[12px] border border-line bg-surface-2 px-3.5 text-sm text-fg placeholder:text-fg-3/70 transition-colors hover:border-line-strong focus:border-accent-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
                  value={repitaSenha}
                  onChange={(e) => setRepitaSenha(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!senhaAtual || !novaSenha || !repitaSenha}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 fx-btn-shiny text-fg h-10 px-5 text-sm"
                >
                  Alterar senha
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Sessões ativas */}
        <section className="fx-card xl:col-span-2">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <h2 className="font-display text-[15px] text-fg">Sessões ativas</h2>
          </header>
          <div>
            <ul className="divide-y divide-line">
              {sessions.map((sess) => (
                <li
                  key={sess.id}
                  className="flex flex-wrap items-center gap-3 px-5 py-3.5"
                >
                  <Laptop className="size-5 text-fg-3 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-fg">
                      {sess.device}
                      {sess.isCurrent && (
                        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11.5px] font-medium border-success/30 bg-success/10 text-success ml-2">
                          Esta sessão
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-fg-3">
                      IP {sess.ip} · ativa {sess.activeTime} · entrou {sess.loginTime}
                    </p>
                  </div>
                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleEndSession(sess.id)}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background,box-shadow,color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 text-fg-2 hover:bg-white/5 hover:text-fg h-8 px-3 text-[13px]"
                    >
                      <X className="size-3.5" />
                      Encerrar
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
