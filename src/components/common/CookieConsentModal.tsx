import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';

interface CookieConsentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}

export const CookieConsentModal: React.FC<CookieConsentModalProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  forceOpen = false
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(forceOpen);
  const [isPersonalizing, setIsPersonalizing] = useState(true);

  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const isVisible = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const closeDialog = () => {
    if (externalOnClose) {
      externalOnClose();
    }
    setInternalIsOpen(false);
  };

  const openDialog = (customize = true) => {
    setIsPersonalizing(customize);
    setInternalIsOpen(true);
  };

  useEffect(() => {
    // Expor API idêntica ao original window.flConsent
    (window as any).flConsent = {
      open: () => openDialog(true),
      get: () => preferences,
      version: 1
    };

    // Abre na primeira visita se nunca foi salvo
    if (!storage.hasCookieConsent()) {
      setInternalIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({ analytics: true, marketing: true, preferences: true });
    storage.setCookieConsent();
    closeDialog();
  };

  const handleRejectOptional = () => {
    setPreferences({ analytics: false, marketing: false, preferences: false });
    storage.setCookieConsent();
    closeDialog();
  };

  const handleSaveCustom = () => {
    storage.setCookieConsent();
    closeDialog();
  };

  return (
    <>
      {/* Botão FAB Idêntico ao Original (quando modal não está aberto) */}
      {!isVisible && (
        <button
          type="button"
          onClick={() => openDialog(true)}
          className="flc-fab"
          aria-label="Preferências de cookies"
          title="Preferências de cookies"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="M21 12.5A9 9 0 1 1 11.5 3a3 3 0 0 0 4 3.5 3 3 0 0 0 3.5 4 3 3 0 0 0 2 2Z" />
            <circle cx="8.5" cy="10" r="1" fill="currentColor" />
            <circle cx="12" cy="15.5" r="1" fill="currentColor" />
            <circle cx="15.5" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* Modal / Banner de Cookies Idêntico ao Original (.flc) */}
      {isVisible && (
        <section
          className="flc"
          role="dialog"
          aria-live="polite"
          aria-labelledby="flc-t"
          aria-describedby="flc-d"
        >
          <div className="flc__txt">
            <h2 id="flc-t">Sua privacidade</h2>
            <p id="flc-d">
              Usamos cookies necessários para o site funcionar. Com a sua autorização, também usamos cookies
              de medição e de marketing para entender o uso do site e medir campanhas. Você pode mudar de
              ideia quando quiser.{' '}
              <a
                href="#politica-cookies"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Política de Privacidade e Cookies do Fluxo Lead em conformidade com a LGPD.');
                }}
              >
                Política de Cookies
              </a>
            </p>
          </div>

          {/* Categorias com Switches */}
          <div className="flc__cats">
            {/* Necessários */}
            <label className="flc__cat">
              <input type="checkbox" checked disabled />
              <span>
                <b>Necessários</b>
                <small>
                  Login, segurança e a sua escolha de cookies. Sempre ativos, porque o site não funciona sem eles.
                </small>
              </span>
            </label>

            {/* Analíticos */}
            <label className="flc__cat">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              />
              <span>
                <b>Analíticos</b>
                <small>
                  Medem visitas e uso das páginas (Google Analytics), sem identificar você diretamente.
                </small>
              </span>
            </label>

            {/* Marketing */}
            <label className="flc__cat">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
              />
              <span>
                <b>Marketing</b>
                <small>
                  Medem resultados de anúncios e permitem anúncios relacionados (Google Ads, Meta, TikTok).
                </small>
              </span>
            </label>

            {/* Preferências */}
            <label className="flc__cat">
              <input
                type="checkbox"
                checked={preferences.preferences}
                onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
              />
              <span>
                <b>Preferências</b>
                <small>
                  Guardam escolhas de exibição. Hoje não usamos nenhum cookie desta categoria.
                </small>
              </span>
            </label>
          </div>

          {/* Botões de Ação */}
          <div className="flc__btns">
            <button type="button" className="flc__pri" onClick={handleRejectOptional}>
              Rejeitar opcionais
            </button>
            <button type="button" onClick={handleSaveCustom}>
              Salvar escolhas
            </button>
            <button type="button" className="flc__pri" onClick={handleAcceptAll}>
              Aceitar todos
            </button>
          </div>
        </section>
      )}
    </>
  );
};
