import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { TranslationCard } from './components/TranslationCard';
import { TranslationResult } from './components/TranslationResult';
import { HistoryPanel } from './components/HistoryPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useTranslator } from './hooks/useTranslator';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useHistory } from './hooks/useHistory';
import { getLanguageByCode } from './utils/languages';
import type { HistoryEntry } from './hooks/useHistory';
import './App.css';

function App() {
  const [sourceLang, setSourceLang] = useState('es');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);



  const { translate, isLoading, isTranslating, loadingProgress, loadingMessage, error } =
    useTranslator();

  const sourceSpeechCode = getLanguageByCode(sourceLang)?.speechCode || 'es-ES';
  const targetSpeechCode = getLanguageByCode(targetLang)?.speechCode || 'en-US';

  const { transcript, isListening, isSupported: isSpeechRecSupported, start: startListening, stop: stopListening, error: speechError } =
    useSpeechRecognition(sourceSpeechCode);

  const { speak, isSpeaking, isSupported: isTTSSupported } =
    useSpeechSynthesis(targetSpeechCode);

  const { history, addEntry, clearHistory } = useHistory();

  // When speech recognition produces a transcript, set it as input
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Manual translation triggered by button or Enter key
  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }

    const result = await translate(inputText, sourceLang, targetLang);
    if (result) {
      setTranslatedText(result);
      addEntry({
        sourceText: inputText,
        translatedText: result,
        sourceLang,
        targetLang,
      });
    }
  }, [inputText, translate, sourceLang, targetLang, addEntry]);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setSourceLang(entry.sourceLang);
    setTargetLang(entry.targetLang);
    setInputText(entry.sourceText);
    setTranslatedText(entry.translatedText);
    setIsHistoryOpen(false);
  };

  const srcLang = getLanguageByCode(sourceLang);
  const placeholder = sourceLang === 'es'
    ? 'Escribe o dicta algo para traducir...'
    : `Type or speak something in ${srcLang?.name || 'source language'}...`;

  return (
    <div className="app">
      {/* Background animated gradient orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
      </div>

      {isLoading && (
        <LoadingSpinner progress={loadingProgress} message={loadingMessage} />
      )}

      <div className="app-container">
        <Header
          onHistoryToggle={() => setIsHistoryOpen((prev) => !prev)}
          historyCount={history.length}
        />

        <main className="main-content">
          <LanguageSelector
            sourceLang={sourceLang}
            targetLang={targetLang}
            onSourceChange={setSourceLang}
            onTargetChange={setTargetLang}
            onSwap={handleSwap}
          />

          <div className="cards-container">
            <TranslationCard
              text={inputText}
              onTextChange={setInputText}
              onTranslate={handleTranslate}
              placeholder={placeholder}
              isListening={isListening}
              isTranslating={isTranslating}
              isSpeechSupported={isSpeechRecSupported}
              onMicStart={startListening}
              onMicStop={stopListening}
            />

            <div className="translate-divider">
              <div className="divider-line" />
              <div className={`translate-indicator ${isTranslating ? 'translate-indicator--active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor" />
                </svg>
              </div>
              <div className="divider-line" />
            </div>

            <TranslationResult
              translatedText={translatedText}
              isTranslating={isTranslating}
              onSpeak={speak}
              isSpeaking={isSpeaking}
              isSpeechSupported={isTTSSupported}
              error={error}
            />
          </div>
        </main>

        <footer className="app-footer">
          <p>Traducción impulsada por IA • Funciona sin internet</p>
        </footer>
      </div>

      <HistoryPanel
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleHistorySelect}
        onClear={clearHistory}
      />

      {speechError && (
        <div className="speech-error-toast" id="speech-error-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
          </svg>
          <span>{speechError}</span>
        </div>
      )}
    </div>
  );
}

export default App;
