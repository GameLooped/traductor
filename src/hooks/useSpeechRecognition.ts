import { useState, useCallback, useRef } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  start: () => void;
  stop: () => void;
  error: string | null;
}

// Get the SpeechRecognition constructor once
const SpeechRecognitionAPI: (new () => SpeechRecognition) | null =
  typeof window !== 'undefined'
    ? ((window as unknown as Record<string, unknown>).SpeechRecognition as new () => SpeechRecognition) ||
      ((window as unknown as Record<string, unknown>).webkitSpeechRecognition as new () => SpeechRecognition) ||
      null
    : null;

export function useSpeechRecognition(lang: string = 'es-ES'): SpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  const isSupported = !!SpeechRecognitionAPI;

  const start = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      setError('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }

    setError(null);
    setTranscript('');

    // Create a fresh instance each time — this avoids stale state issues
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langRef.current;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);

      let errorMsg: string | null = null;
      switch (event.error) {
        case 'not-allowed':
          errorMsg = 'Permiso de micrófono denegado. Permite el acceso en la configuración del navegador.';
          break;
        case 'no-speech':
          errorMsg = 'No se detectó voz. Intenta hablar más cerca del micrófono.';
          break;
        case 'audio-capture':
          errorMsg = 'No se encontró un micrófono. Conecta uno e intenta de nuevo.';
          break;
        case 'network':
          errorMsg = 'Error de red. El reconocimiento de voz necesita conexión a internet.';
          break;
        case 'aborted':
          // User-triggered abort, no error needed
          break;
        default:
          errorMsg = `Error de reconocimiento: ${event.error}`;
      }

      if (errorMsg) setError(errorMsg);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setError('No se pudo iniciar el reconocimiento de voz. Intenta de nuevo.');
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  return { transcript, isListening, isSupported, start, stop, error };
}
