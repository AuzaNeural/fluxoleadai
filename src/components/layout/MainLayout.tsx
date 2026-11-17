import React from 'react';
import { Sidebar, PageId } from './Sidebar';
import { CookieConsentModal } from '../common/CookieConsentModal';

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
  return (
    <div className="min-h-screen bg-[#000000] text-gray-100 flex">
      {/* Sidebar Fixa */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Conteúdo Principal */}
      <main className="flex-1 ml-[230px] min-h-screen p-6 sm:p-8 max-w-[1440px] overflow-x-hidden">
        {children}
      </main>

      {/* Cookie Consent Oficial */}
      <CookieConsentModal />
    </div>
  );
};
