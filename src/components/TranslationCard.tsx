import { useEffect, useRef } from 'react';
import { VoiceInput } from './VoiceInput';

interface TranslationCardProps {
  text: string;
  onTextChange: (text: string) => void;
  onTranslate: () => void;
  placeholder: string;
  isListening: boolean;
  isTranslating: boolean;
  isSpeechSupported: boolean;
  onMicStart: () => void;
  onMicStop: () => void;
  maxLength?: number;
}

export function TranslationCard({
  text,
  onTextChange,
  onTranslate,
  placeholder,
  isListening,
  isTranslating,
  isSpeechSupported,
  onMicStart,
  onMicStop,
  maxLength = 500,
}: TranslationCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  const handleClear = () => {
    onTextChange('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) onTranslate();
    }
  };

  return (
    <div className="translation-card translation-card--input">
      <div className="card-header">
        <span className="card-label">Texto original</span>
        {text.length > 0 && (
          <button className="clear-btn" onClick={handleClear} aria-label="Limpiar texto" id="clear-input-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
      <textarea
        ref={textareaRef}
        id="translation-input"
        className="translation-textarea"
        value={text}
        onChange={(e) => onTextChange(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        maxLength={maxLength}
      />
      <div className="card-footer">
        <div className="card-footer-left">
          <VoiceInput
            isListening={isListening}
            isSupported={isSpeechSupported}
            onStart={onMicStart}
            onStop={onMicStop}
          />
          <span className="char-count">
            {text.length}/{maxLength}
          </span>
        </div>
        <button
          className={`translate-btn ${isTranslating ? 'translate-btn--loading' : ''}`}
          onClick={onTranslate}
          disabled={!text.trim() || isTranslating}
          aria-label="Traducir"
          id="translate-btn"
        >
          {isTranslating ? (
            <>
              <span className="translate-btn__spinner" />
              Traduciendo...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="currentColor" />
              </svg>
              Traducir
            </>
          )}
        </button>
      </div>
    </div>
  );
}
