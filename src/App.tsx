import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { MainLayout } from './components/layout/MainLayout';
import { PageId } from './components/layout/Sidebar';

// Páginas
import { Dashboard } from './pages/Dashboard';
import { BuscarEmpresas } from './pages/BuscarEmpresas';
import { MeusLeads } from './pages/MeusLeads';
import { VendedorIA } from './pages/VendedorIA';
import { CRM } from './pages/CRM';
import { Templates } from './pages/Templates';
import { MeusProjetos } from './pages/MeusProjetos';
import { SitesPublicados } from './pages/SitesPublicados';
import { PlanosAssinatura } from './pages/PlanosAssinatura';
import { Historico } from './pages/Historico';
import { Configuracoes } from './pages/Configuracoes';
import { Suporte } from './pages/Suporte';

const getPageFromHash = (): PageId => {
  const hash = window.location.hash.toLowerCase();
  if (hash.includes('crm')) return 'crm';
  if (hash.includes('vendedor')) return 'vendedor-ia';
  if (hash.includes('leads')) return 'meus-leads';
  if (hash.includes('buscar')) return 'buscar-empresas';
  if (hash.includes('templates')) return 'templates';
  if (hash.includes('projetos')) return 'meus-projetos';
  if (hash.includes('sites')) return 'sites-publicados';
  if (hash.includes('planos') || hash.includes('assinatura')) return 'planos';
  if (hash.includes('historico')) return 'historico';
  if (hash.includes('configuracoes')) return 'configuracoes';
  if (hash.includes('suporte')) return 'suporte';
  return 'dashboard';
};

export const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = `/app/${page}`;
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'buscar-empresas':
        return <BuscarEmpresas onNavigate={handleNavigate} />;
      case 'meus-leads':
        return <MeusLeads />;
      case 'vendedor-ia':
        return <VendedorIA />;
      case 'crm':
        return <CRM />;
      case 'templates':
        return <Templates onNavigate={handleNavigate} />;
      case 'meus-projetos':
        return <MeusProjetos />;
      case 'sites-publicados':
        return <SitesPublicados onNavigate={handleNavigate} />;
      case 'planos':
        return <PlanosAssinatura />;
      case 'historico':
        return <Historico />;
      case 'configuracoes':
        return <Configuracoes />;
      case 'suporte':
        return <Suporte />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </MainLayout>
  );
};

