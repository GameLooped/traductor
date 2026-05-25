import { useState, useCallback, useRef } from 'react';

export interface HistoryEntry {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}

const STORAGE_KEY = 'translation_history';
const MAX_ENTRIES = 5;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const historyRef = useRef(history);
  historyRef.current = history;

  const addEntry = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };

      const updated = [newEntry, ...historyRef.current].slice(0, MAX_ENTRIES);
      historyRef.current = updated;
      setHistory(updated);
      saveHistory(updated);
    },
    []
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    historyRef.current = [];
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEntry, clearHistory };
}
