import type { HistoryEntry } from '../hooks/useHistory';
import { getLanguageByCode } from '../utils/languages';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

export function HistoryPanel({ isOpen, history, onClose, onSelect, onClear }: HistoryPanelProps) {
  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Justo ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <>
      <div className={`overlay ${isOpen ? 'overlay--visible' : ''}`} onClick={onClose} />
      <div className={`history-panel ${isOpen ? 'history-panel--open' : ''}`}>
        <div className="history-panel__header">
          <div className="history-panel__handle" />
          <div className="history-panel__title-row">
            <h2 className="history-panel__title">Historial</h2>
            {history.length > 0 && (
              <button className="clear-history-btn" onClick={onClear} id="clear-history-btn">
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="history-panel__content">
          {history.length === 0 ? (
            <div className="history-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
                <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7a6.99 6.99 0 01-4.95-2.05l-1.41 1.41A8.96 8.96 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="currentColor" />
              </svg>
              <p>Sin traducciones recientes</p>
              <span>Tus últimas 5 traducciones aparecerán aquí</span>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((entry) => {
                const srcLang = getLanguageByCode(entry.sourceLang);
                const tgtLang = getLanguageByCode(entry.targetLang);
                return (
                  <li key={entry.id}>
                    <button
                      className="history-item"
                      onClick={() => onSelect(entry)}
                      id={`history-item-${entry.id}`}
                    >
                      <div className="history-item__langs">
                        <span className="history-item__flag">{srcLang?.flag}</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor" />
                        </svg>
                        <span className="history-item__flag">{tgtLang?.flag}</span>
                      </div>
                      <div className="history-item__text">
                        <p className="history-item__source">{entry.sourceText}</p>
                        <p className="history-item__translated">{entry.translatedText}</p>
                      </div>
                      <span className="history-item__time">{getTimeAgo(entry.timestamp)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
