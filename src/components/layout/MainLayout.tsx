import React, { useState } from 'react';
import { Sidebar, PageId } from './Sidebar';
import { CookieConsentModal } from '../common/CookieConsentModal';
import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentPage,
  onNavigate,
  children
}) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex flex-col">
      {/* Top Mobile Header (visível em telas menores que lg: 1024px) */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-[#0c0d12]/95 backdrop-blur-md border-b border-[#1f232d]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1.5 -ml-1 text-gray-300 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors focus:outline-none cursor-pointer"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/brand/logo-fluxo-lead.png"
              alt="Fluxo Lead"
              className="h-5 w-auto object-contain"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-[#062c17] border border-[#14532d] text-[#34d399] text-[10px] font-semibold">
            Fluxo Lead Anual
          </span>
          <div className="w-7 h-7 rounded-full bg-[#181a22] border border-[#2b303c] flex items-center justify-center text-gray-300 font-bold text-xs">
            {user?.avatar_initial || 'A'}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar (Desktop fixo e gaveta responsiva para mobile/tablet) */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Conteúdo Principal 100% responsivo para Mobile, Tablet, Notebook e Desktop */}
        <main
          className={`flex-1 min-h-[calc(100vh-56px)] lg:min-h-screen p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full min-w-0 transition-all duration-300 ${
            collapsed ? 'lg:ml-20' : 'lg:ml-[230px]'
          }`}
        >
          {children}
        </main>
      </div>

      {/* Cookie Consent Oficial */}
      <CookieConsentModal />
    </div>
  );
};
