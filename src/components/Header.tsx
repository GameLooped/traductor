import { useState, useEffect } from 'react';

interface HeaderProps {
  onHistoryToggle: () => void;
  historyCount: number;
}

export function Header({ onHistoryToggle, historyCount }: HeaderProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="url(#logo-gradient)" />
            <path d="M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="url(#logo-gradient2)" />
            <defs>
              <linearGradient id="logo-gradient" x1="1" y1="2" x2="17" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00d4ff" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="logo-gradient2" x1="12" y1="10" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="header-title">Traductor IA</h1>
          <p className="header-subtitle">Traducción inteligente con IA</p>
        </div>
      </div>
      <div className="header-actions">
        <button
          className="icon-btn history-btn"
          onClick={onHistoryToggle}
          aria-label="Historial de traducciones"
          id="history-toggle-btn"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7a6.99 6.99 0 01-4.95-2.05l-1.41 1.41A8.96 8.96 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor" />
          </svg>
          {historyCount > 0 && <span className="badge">{historyCount}</span>}
        </button>
        {installPrompt && !isInstalled && (
          <button className="install-btn" onClick={handleInstall} id="install-pwa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor" />
            </svg>
            Instalar
          </button>
        )}
      </div>
    </header>
  );
}

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
