import { useState } from 'react';

interface TranslationResultProps {
  translatedText: string;
  isTranslating: boolean;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  isSpeechSupported: boolean;
  error: string | null;
}

export function TranslationResult({
  translatedText,
  isTranslating,
  onSpeak,
  isSpeaking,
  isSpeechSupported,
  error,
}: TranslationResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = translatedText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="translation-card translation-card--result">
      <div className="card-header">
        <span className="card-label">Traducción</span>
      </div>

      <div className="result-content">
        {isTranslating ? (
          <div className="skeleton-loader">
            <div className="skeleton-line skeleton-line--long" />
            <div className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        ) : error ? (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
            </svg>
            <p>{error}</p>
          </div>
        ) : translatedText ? (
          <p className="translated-text" id="translation-output">{translatedText}</p>
        ) : (
          <p className="placeholder-text">La traducción aparecerá aquí...</p>
        )}
      </div>

      {translatedText && !isTranslating && (
        <div className="card-footer result-actions">
          {isSpeechSupported && (
            <button
              className={`action-btn listen-btn ${isSpeaking ? 'listen-btn--active' : ''}`}
              onClick={() => onSpeak(translatedText)}
              aria-label="Escuchar traducción"
              id="listen-translation-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {isSpeaking ? (
                  <path d="M6 6h12v12H6z" fill="currentColor" />
                ) : (
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="currentColor" />
                )}
              </svg>
              <span>{isSpeaking ? 'Detener' : 'Escuchar'}</span>
            </button>
          )}
          <button
            className={`action-btn copy-btn ${copied ? 'copy-btn--copied' : ''}`}
            onClick={handleCopy}
            aria-label="Copiar traducción"
            id="copy-translation-btn"
          >
            {copied ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor" />
              </svg>
            )}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
