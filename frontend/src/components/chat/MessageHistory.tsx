import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { Trash2 } from 'lucide-react';

interface MessageHistoryProps {
  messages: string[];
  currentIndex: number;
  onClear: () => void;
  onDelete: (index: number) => void;
  onClick?: (message: string) => void;
}

export function MessageHistory({ messages, currentIndex, onClear, onDelete, onClick }: MessageHistoryProps) {
  const { t } = useTranslation();
  const { fontSize } = useSettingsStore();
  
  if (messages.length === 0) return null;

  // Combine consecutive duplicate messages
  const uniqueMessages = messages.reduce<{ message: string; originalIndex: number; }[]>((acc, msg, idx) => {
    if (acc.length === 0 || acc[acc.length - 1].message !== msg) {
      acc.push({ message: msg, originalIndex: idx });
    }
    return acc;
  }, []);

  // Get last 5 unique messages
  const displayMessages = uniqueMessages.slice(-5);

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center justify-between">
        <div className={`${
          fontSize === 'small' ? 'text-xs' :
          fontSize === 'large' ? 'text-base' :
          'text-sm'
        } font-medium text-gray-400`}>
          {t('history.title')}
        </div>
        <Button
          variant="secondary"
          onClick={onClear}
          className="!py-1 !px-2 text-xs !bg-transparent hover:!bg-red-500/10 text-gray-400 hover:text-red-400"
        >
          {t('history.clear')}
        </Button>
      </div>
      <div className="space-y-2">
        {displayMessages.reverse().map((item, i) => (
          <div
            key={i}
            onClick={() => onClick?.(item.message)}
            className={`relative p-3 rounded-lg bg-gray-800/30 backdrop-blur-sm transition-all duration-200 group cursor-pointer ${
              fontSize === 'small' ? 'text-sm' :
              fontSize === 'large' ? 'text-lg' :
              'text-base'
            } ${
              item.originalIndex === currentIndex
                ? 'border border-blue-500 shadow-lg shadow-blue-500/20'
                : 'border border-gray-700/30 hover:border-gray-600/50'
            }`}
          >
            {item.message}
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.originalIndex);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-20 group-hover:opacity-100 !p-1.5 !bg-gray-700/40 hover:!bg-red-500/20 text-gray-300 hover:text-red-400 rounded-md border border-gray-600/30 hover:border-red-400/30"
              aria-label={t('history.delete')}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}