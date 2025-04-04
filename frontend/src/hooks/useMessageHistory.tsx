import { useState, KeyboardEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '../utils/toast';

const STORAGE_KEY = 'vrchat-ime-message-history';
const MAX_HISTORY = 100; // Store up to 100 messages

export function useMessageHistory() {
  const [messageHistory, setMessageHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { t } = useTranslation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messageHistory));
  }, [messageHistory]);

  const addMessage = (message: string) => {
    setMessageHistory((prev: string[]) => {
      const newHistory = [...prev, message];
      // Keep only the latest MAX_HISTORY messages
      return newHistory.slice(-MAX_HISTORY);
    });
    setHistoryIndex(-1);
  };

  const handleHistoryNavigation = (e: KeyboardEvent<HTMLInputElement>, currentMessage: string) => {
    if (e.key === 'ArrowUp' && !currentMessage) {
      e.preventDefault();
      const newIndex = historyIndex + 1;
      if (newIndex < messageHistory.length) {
        setHistoryIndex(newIndex);
        return messageHistory[messageHistory.length - 1 - newIndex];
      }
    } else if (e.key === 'ArrowDown' && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      if (newIndex >= 0) {
        setHistoryIndex(newIndex);
        return messageHistory[messageHistory.length - 1 - newIndex];
      } else {
        setHistoryIndex(-1);
        return '';
      }
    }
    return undefined;
  };

  const clearHistory = () => {
    setMessageHistory([]);
    setHistoryIndex(-1);
    localStorage.removeItem(STORAGE_KEY);
    toast.info(t('history.cleared'));
  };

  const deleteMessage = (index: number) => {
    setMessageHistory((prev: string[]) => {
      const newHistory = [...prev];
      newHistory.splice(index, 1);
      return newHistory;
    });
    setHistoryIndex(-1);
    toast.info(t('history.messageDeleted'));
  };

  return {
    messageHistory,
    historyIndex,
    addMessage,
    handleHistoryNavigation,
    clearHistory,
    deleteMessage
  };
}