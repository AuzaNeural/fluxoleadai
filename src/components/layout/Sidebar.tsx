import React, { useState } from 'react';
import {
  LayoutDashboard,
  Bot,
  Search,
  Users,
  Columns3,
  LayoutTemplate,
  Folder,
  Globe,
  CreditCard,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../common/ConfirmModal';

export type PageId =
  | 'dashboard'
  | 'buscar-empresas'
  | 'meus-leads'
  | 'vendedor-ia'
  | 'crm'
  | 'templates'
  | 'meus-projetos'
  | 'sites-publicados'
  | 'planos'
  | 'historico'
  | 'configuracoes'
  | 'suporte'
  | 'editor';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menuItems: { id: PageId; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'vendedor-ia', label: 'Vendedor IA', icon: Bot },
    { id: 'buscar-empresas', label: 'Buscar empresas', icon: Search },
    { id: 'meus-leads', label: 'Meus leads', icon: Users },
    { id: 'crm', label: 'CRM', icon: Columns3 },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'meus-projetos', label: 'Meus projetos', icon: Folder },
    { id: 'sites-publicados', label: 'Sites publicados', icon: Globe },
    { id: 'planos', label: 'Planos e assinatura', icon: CreditCard },
    { id: 'historico', label: 'Histórico', icon: Clock },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
    { id: 'suporte', label: 'Suporte', icon: HelpCircle },
  ];

  return (
    <>
      {/* Backdrop Semi-Transparente para Mobile/Tablet */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-[#000000] border-r border-[#1a1c23] flex flex-col transition-transform lg:transition-[width] duration-300 z-50 select-none ${
          mobileOpen ? 'translate-x-0 w-[270px] max-w-[85vw] shadow-2xl' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-[230px]'}`}
      >
        {/* Topo: Logo Oficial e Botão Fechar no Mobile */}
        <div
          className={`h-16 shrink-0 flex items-center px-5 transition-all ${
            collapsed ? 'lg:justify-center justify-between' : 'justify-between'
          }`}
        >
          <div
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className={collapsed ? 'lg:h-6 lg:w-6 h-6 w-auto object-contain' : 'h-6 w-auto object-contain'}
            />
          </div>

          {/* Botão fechar apenas no Mobile/Tablet */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegação (Flex-1 com min-h-0 para nunca cortar items no rodapé) */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1 pb-4 overscroll-contain">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#fa2600] to-[#ff5500] text-white font-semibold shadow-[0_4px_20px_rgba(250,38,0,0.45)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#12141a] font-normal'
                } ${collapsed ? 'lg:justify-center lg:px-0' : 'justify-start'}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="shrink-0 p-3 border-t border-[#181a20] bg-[#000000]">
          {/* Badge de Plano Verde */}
          {(!collapsed || mobileOpen) && (
            <div className="mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#062c17] border border-[#14532d] text-[#34d399] text-[10px] font-semibold">
                Fluxo Lead Anual
              </span>
            </div>
          )}

          {/* Usuário e Logout */}
          <div
            className={`flex items-center gap-2.5 ${
              collapsed && !mobileOpen ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#181a22] border border-[#2b303c] flex items-center justify-center text-gray-300 font-bold text-xs shrink-0">
                {user.avatar_initial || 'A'}
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col overflow-hidden leading-tight">
                  <span className="text-xs font-bold text-white truncate">{user.name}</span>
                  <span className="text-[10px] text-gray-500 truncate max-w-[120px]" title={user.email}>
                    {user.email.replace(/(.{16}).+(@.+)/, '$1...')}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Sair da conta"
              className="p-1 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Recolher Menu (apenas no Desktop) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex mt-3 w-full items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronsRight className="w-3.5 h-3.5 mx-auto" />
            ) : (
              <>
                <ChevronsLeft className="w-3.5 h-3.5" />
                <span>Recolher menu</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Modal de Confirmação de Logout */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Encerrar sessão"
        description="Tem certeza que deseja sair da sua conta Fluxo Lead? Você precisará entrar novamente para acessar o sistema."
        confirmText="Sim, sair"
        cancelText="Voltar"
      />
    </>
  );
};
