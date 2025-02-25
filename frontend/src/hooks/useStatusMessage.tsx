import { useState, useEffect } from 'react';
import { StatusMessage } from '../types';

export function useStatusMessage(timeout: number = 3000) {
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatus({
      type,
      text,
      timestamp: Date.now()
    });
  };

  // Clear status after timeout
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), timeout);
      return () => clearTimeout(timer);
    }
  }, [status?.timestamp, timeout]);

  return {
    status,
    showStatus,
    clearStatus: () => setStatus(null)
  };
}