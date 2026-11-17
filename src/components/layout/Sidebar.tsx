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
  ChevronsRight
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
  | 'suporte';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
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
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#000000] border-r border-[#1a1c23] flex flex-col justify-between transition-all duration-300 z-40 select-none ${
          collapsed ? 'w-20' : 'w-[230px]'
        }`}
      >
        {/* Topo: Logo Oficial */}
        <div>
          <div
            onClick={() => onNavigate('dashboard')}
            className={`h-16 flex items-center cursor-pointer px-5 transition-all ${
              collapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className={collapsed ? 'h-6 w-6 object-contain' : 'h-6 w-auto object-contain'}
            />
          </div>

          {/* Links de Navegação */}
          <nav className="px-3 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#fa2600] to-[#ff5500] text-white font-semibold shadow-[0_4px_20px_rgba(250,38,0,0.45)]'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#12141a] font-normal'
                  } ${collapsed ? 'justify-center px-0' : 'justify-start'}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-3 border-t border-[#181a20] bg-[#000000]">
          {/* Badge de Plano Verde */}
          {!collapsed && (
            <div className="mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#062c17] border border-[#14532d] text-[#34d399] text-[10px] font-semibold">
                Fluxo Lead Anual
              </span>
            </div>
          )}

          {/* Usuário e Logout */}
          <div
            className={`flex items-center gap-2.5 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#181a22] border border-[#2b303c] flex items-center justify-center text-gray-300 font-bold text-xs shrink-0">
                {user.avatar_initial || 'A'}
              </div>
              {!collapsed && (
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
              className="p-1 text-gray-500 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Recolher Menu */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-3 w-full flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
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
