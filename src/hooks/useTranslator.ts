import { useState, useCallback, useRef } from 'react';
import { pipeline, type TextGenerationPipeline } from '@huggingface/transformers';
import { getTranslationPath } from '../utils/languages';

interface TranslatorState {
  translate: (text: string, sourceLang: string, targetLang: string) => Promise<string>;
  isLoading: boolean;
  isTranslating: boolean;
  loadingProgress: number;
  loadingMessage: string;
  error: string | null;
}

type TranslationPipeline = Awaited<ReturnType<typeof pipeline<'translation'>>>;

export function useTranslator(): TranslatorState {
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Cache pipeline instances by model ID
  const pipelinesRef = useRef<Map<string, TranslationPipeline>>(new Map());

  const getPipeline = useCallback(async (modelId: string): Promise<TranslationPipeline> => {
    const cached = pipelinesRef.current.get(modelId);
    if (cached) return cached;

    setIsLoading(true);
    setLoadingMessage(`Descargando modelo de IA: ${modelId.split('/')[1]}...`);
    setLoadingProgress(0);

    try {
      const pipe = await pipeline('translation', modelId, {
        dtype: 'fp32',
        progress_callback: (progress: { status: string; progress?: number; file?: string }) => {
          if (progress.status === 'progress' && progress.progress !== undefined) {
            setLoadingProgress(Math.round(progress.progress));
          } else if (progress.status === 'done') {
            setLoadingProgress(100);
          }
          if (progress.file) {
            setLoadingMessage(`Descargando: ${progress.file}`);
          }
        },
      });

      pipelinesRef.current.set(modelId, pipe as TranslationPipeline);
      setIsLoading(false);
      setLoadingProgress(0);
      return pipe as TranslationPipeline;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const translate = useCallback(
    async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
      if (!text.trim()) return '';

      setError(null);
      setIsTranslating(true);

      try {
        const { models, intermediary } = getTranslationPath(sourceLang, targetLang);

        let currentText = text;

        for (const modelId of models) {
          const pipe = await getPipeline(modelId);
          const result = await pipe(currentText, {
            max_length: 512,
          } as Record<string, unknown>);

          // The result is an array of objects with 'translation_text'
          if (Array.isArray(result) && result.length > 0) {
            currentText = (result[0] as { translation_text: string }).translation_text;
          }
        }

        if (intermediary) {
          console.log(`Translated via English intermediary: ${sourceLang} → en → ${targetLang}`);
        }

        setIsTranslating(false);
        return currentText;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido al traducir';
        setError(message);
        setIsTranslating(false);
        return '';
      }
    },
    [getPipeline]
  );

  return {
    translate,
    isLoading,
    isTranslating,
    loadingProgress,
    loadingMessage,
    error,
  };
}
