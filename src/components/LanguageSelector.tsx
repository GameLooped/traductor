import { LANGUAGES } from '../utils/languages';

interface LanguageSelectorProps {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (code: string) => void;
  onTargetChange: (code: string) => void;
  onSwap: () => void;
}

export function LanguageSelector({
  sourceLang,
  targetLang,
  onSourceChange,
  onTargetChange,
  onSwap,
}: LanguageSelectorProps) {
  return (
    <div className="language-selector">
      <div className="lang-dropdown-wrapper">
        <label className="lang-label" htmlFor="source-lang-select">Desde</label>
        <select
          id="source-lang-select"
          className="lang-select"
          value={sourceLang}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>

      <button
        className="swap-btn"
        onClick={onSwap}
        aria-label="Intercambiar idiomas"
        id="swap-languages-btn"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" fill="currentColor" />
        </svg>
      </button>

      <div className="lang-dropdown-wrapper">
        <label className="lang-label" htmlFor="target-lang-select">A</label>
        <select
          id="target-lang-select"
          className="lang-select"
          value={targetLang}
          onChange={(e) => onTargetChange(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
