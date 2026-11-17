import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CookieConsentModal } from '../components/common/CookieConsentModal';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('juliasouzamartins71@gmail.com');
  const [password, setPassword] = useState('Araujo89@');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('O e-mail é obrigatório.', 'error');
      return;
    }
    if (!password) {
      showToast('A senha é obrigatória.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      showToast('Login realizado com sucesso! Bem-vindo de volta.', 'success');
    } catch (err) {
      showToast('Erro ao realizar login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCookies = () => {
    if ((window as any).flConsent && (window as any).flConsent.open) {
      (window as any).flConsent.open();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000000] flex flex-col justify-between items-center px-4 overflow-hidden select-none">
      {/* Glow e Arco Superior Exato do Original */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_50%_0%,rgba(250,38,0,0.24),transparent_75%)] z-0"></div>

      <div className="pointer-events-none absolute left-1/2 top-0 sm:top-1 w-[min(1150px,140vw)] -translate-x-1/2 opacity-95 z-0">
        <img
          src="/brand/arc.png"
          alt="Fluxo Lead Glow"
          className="h-auto w-full object-contain"
        />
      </div>

      {/* Espaçador superior para manter o card perfeitamente centralizado sob o arco */}
      <div className="w-full pt-16 sm:pt-20"></div>

      {/* Conteúdo Central */}
      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        {/* Cabeçalho do Card */}
        <div className="text-center mb-5">
          <p className="fx-eyebrow mb-2">FLUXO LEAD</p>
          <h1 className="text-3xl sm:text-[34px] font-bold text-white tracking-tight leading-tight">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-400">
            Entre para encontrar clientes e gerenciar suas vendas.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="w-full fx-card p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="fx-input"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  required
                  className="fx-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Link Esqueci minha senha */}
            <div className="-mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Um link de recuperação foi enviado ao seu e-mail.', 'info')}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Botão Entrar em formato de Pílula (Pill) idêntico */}
            <button
              type="submit"
              disabled={loading}
              className="fx-btn-primary h-11 w-full rounded-full text-sm font-semibold text-white mt-1 shadow-lg flex items-center justify-center transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>

        {/* Link Criar Conta */}
        <div className="mt-5 text-center text-xs sm:text-sm text-gray-400">
          Ainda não tem conta?{' '}
          <button
            type="button"
            onClick={() => showToast('Redirecionando para a página de cadastro...', 'info')}
            className="text-[#fa2600] font-medium hover:underline ml-0.5"
          >
            Criar conta
          </button>
        </div>
      </div>

      {/* Rodapé Centralizado */}
      <footer className="relative z-10 pb-6 text-center text-[11px] sm:text-xs text-gray-500 flex flex-wrap justify-center items-center gap-1.5">
        <span>© 2026 Fluxo Lead</span>
        <span>·</span>
        <button
          type="button"
          onClick={() => showToast('Início do Fluxo Lead', 'info')}
          className="hover:text-gray-300 transition-colors"
        >
          Início
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => showToast('Política de Privacidade', 'info')}
          className="hover:text-gray-300 transition-colors"
        >
          Privacidade
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={handleOpenCookies}
          className="hover:text-gray-300 transition-colors"
        >
          Preferências de cookies
        </button>
      </footer>

      {/* Componente FAB e Modal Idêntico ao Original de consent.js */}
      <CookieConsentModal />
    </div>
  );
};
