export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string; // BCP-47 locale for speech recognition/synthesis
}

export const LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', speechCode: 'pt-BR' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speechCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA' },
];

/**
 * Get the Hugging Face model ID for a given language pair.
 * Helsinki-NLP/opus-mt models follow the pattern: Helsinki-NLP/opus-mt-{src}-{tgt}
 * We use the Xenova ONNX-converted versions for browser inference.
 */
export function getModelId(sourceLang: string, targetLang: string): string {
  return `Xenova/opus-mt-${sourceLang}-${targetLang}`;
}

/**
 * Check if a direct translation model exists for the given pair.
 * If not, we'll pivot through English as an intermediary.
 */
export function getTranslationPath(
  sourceLang: string,
  targetLang: string
): { models: string[]; intermediary: boolean } {
  // Direct pairs that are well-supported by opus-mt
  const directPairs = new Set([
    'en-es', 'es-en',
    'en-fr', 'fr-en',
    'en-de', 'de-en',
    'en-pt', 'pt-en',
    'en-it', 'it-en',
    'en-ru', 'ru-en',
    'en-zh', 'zh-en',
    'en-ja', 'ja-en',
    'en-ar', 'ar-en',
    'es-fr', 'fr-es',
    'es-pt', 'pt-es',
    'es-it', 'it-es',
    'es-de', 'de-es',
    'fr-de', 'de-fr',
  ]);

  const pairKey = `${sourceLang}-${targetLang}`;

  if (directPairs.has(pairKey)) {
    return {
      models: [getModelId(sourceLang, targetLang)],
      intermediary: false,
    };
  }

  // Pivot through English
  return {
    models: [
      getModelId(sourceLang, 'en'),
      getModelId('en', targetLang),
    ],
    intermediary: true,
  };
}

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
