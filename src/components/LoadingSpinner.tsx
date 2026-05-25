interface LoadingSpinnerProps {
  progress: number;
  message: string;
}

export function LoadingSpinner({ progress, message }: LoadingSpinnerProps) {
  return (
    <div className="loading-overlay" id="model-loading-overlay">
      <div className="loading-card">
        <div className="loading-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04z" fill="url(#loading-grad)" />
            <path d="M18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="url(#loading-grad2)" />
            <defs>
              <linearGradient id="loading-grad" x1="1" y1="2" x2="17" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00d4ff" />
                <stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="loading-grad2" x1="12" y1="10" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7c3aed" />
                <stop offset="1" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="loading-pulse" />
        </div>

        <h2 className="loading-title">Preparando el modelo de IA</h2>
        <p className="loading-message">{message || 'Iniciando descarga...'}</p>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <div className="progress-bar__shimmer" />
          </div>
        </div>
        <span className="progress-text">{progress}%</span>

        <p className="loading-hint">Solo necesita descargar una vez por idioma</p>
      </div>
    </div>
  );
}
