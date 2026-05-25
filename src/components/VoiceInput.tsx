interface VoiceInputProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceInput({ isListening, isSupported, onStart, onStop }: VoiceInputProps) {
  if (!isSupported) return null;

  return (
    <button
      className={`mic-btn ${isListening ? 'mic-btn--active' : ''}`}
      onClick={isListening ? onStop : onStart}
      aria-label={isListening ? 'Detener grabación' : 'Iniciar grabación de voz'}
      id="voice-input-btn"
      type="button"
    >
      <div className="mic-btn__ring" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
          fill="currentColor"
        />
        <path
          d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
          fill="currentColor"
        />
      </svg>
      {isListening && <span className="mic-btn__label">Escuchando...</span>}
    </button>
  );
}
