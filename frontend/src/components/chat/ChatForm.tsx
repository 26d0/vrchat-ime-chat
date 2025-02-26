import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { SendChatMessage, SendTypingStatus } from '../../../wailsjs/go/main/App';
import { useVRChatStatus } from '../../hooks/useVRChatStatus';
import { Button } from '../ui/Button';
import { CharacterCounter } from './CharacterCounter';
import { MessageHistory } from './MessageHistory';
import { useMessageHistory } from '../../hooks/useMessageHistory';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { formatShortcut } from '../../utils/shortcut';
import { toast } from '../../utils/toast';
import { useCallback } from 'react';

const MAX_LENGTH = 144; // VRChat message length limit
export function ChatForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const isVRChatRunning = useVRChatStatus();
  const { sendTypingStatus } = useSettingsStore();
  
  const { messageHistory, historyIndex, addMessage, handleHistoryNavigation, clearHistory, deleteMessage } = useMessageHistory();

  // Send typing status to VRChat - only when it changes and if enabled in settings
  const updateTypingStatus = useCallback(async (typing: boolean) => {
    // Skip if VRChat isn't running or if typing status is disabled in settings
    if (!isVRChatRunning || !sendTypingStatus) return;
    
    // Only send update if status is changing
    if (typing === isTyping) return;
    
    try {
      await SendTypingStatus(typing);
      setIsTyping(typing);
    } catch (err) {
      console.error("Failed to send typing status:", err);
    }
  }, [isVRChatRunning, isTyping, sendTypingStatus]);

  // Stop typing when VRChat closes
  useEffect(() => {
    if (!isVRChatRunning && isTyping) {
      setIsTyping(false);
    }
  }, [isVRChatRunning, isTyping]);

  // Manage typing status with longer inactivity period
  useEffect(() => {
    // Don't do anything if VRChat isn't running or typing status is disabled
    if (!isVRChatRunning || !sendTypingStatus) {
      // If typing is active but setting was disabled, turn it off
      if (isTyping) {
        updateTypingStatus(false);
      }
      return;
    }
    
    // If message becomes empty, stop typing indicator immediately
    if (!message.trim()) {
      if (isTyping) {
        updateTypingStatus(false);
      }
      return;
    }
    
    // Start typing if not already typing
    if (!isTyping) {
      updateTypingStatus(true);
    }
    
    // Clear any existing timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    
    // Only set a new timer if we're currently typing
    // Use a much longer timeout (10 seconds) to prevent frequent flickering
    typingTimerRef.current = setTimeout(() => {
      // Only change status if we're still typing and have an active timer
      if (isTyping) {
        updateTypingStatus(false);
      }
    }, 10000); // 10 seconds of inactivity
    
    // Cleanup function
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [message, isTyping, isVRChatRunning, sendTypingStatus, updateTypingStatus]);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    if (!isVRChatRunning) {
      toast.error(t('status.vrchat_required'));
      return;
    }

    // Clear typing status when sending message
    if (isTyping) {
      updateTypingStatus(false);
    }

    setIsLoading(true);
    try {
      const result = await SendChatMessage(message);
      if (result.success) {
        toast.success(t('chat.message_sent'));
        addMessage(message);
        setMessage("");
      } else {
        toast.error(result.error || t('chat.send_failed'));
      }
    } catch (err) {
      toast.error(`${t('common.error')}: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const { sendShortcut, fontSize } = useSettingsStore();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Send using configured shortcut
    if (e.key === sendShortcut.key &&
        e.ctrlKey === sendShortcut.ctrlKey &&
        e.metaKey === sendShortcut.metaKey &&
        e.altKey === sendShortcut.altKey &&
        e.shiftKey === sendShortcut.shiftKey) {
      if (!isVRChatRunning) {
        toast.error(t('status.vrchat_required'));
        return;
      }
      handleSubmit(e as unknown as FormEvent);
      return;
    }

    // Handle message history navigation
    const newMessage = handleHistoryNavigation(e, message);
    if (newMessage !== undefined) {
      setMessage(newMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2 mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className={`w-2 h-2 rounded-full ${isVRChatRunning ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>{isVRChatRunning ? t('status.vrchat_running') : t('status.vrchat_not_running')}</span>
        </div>
        {isTyping && isVRChatRunning && sendTypingStatus && (
          <div className="text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-md p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            {t('chat.typing_status')}
          </div>
        )}
        {!isVRChatRunning && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md p-2">
            {t('status.vrchat_required')}
          </div>
        )}
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          className={`w-full p-3 rounded-lg backdrop-blur border ${
            !isVRChatRunning ? 'bg-gray-800/20 text-gray-500' : 'bg-gray-800/50'
          } ${
            message.length >= MAX_LENGTH ? 'border-yellow-500' : 'border-gray-700/50'
          } focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-20 transition-colors duration-200 ${
            fontSize === 'small' ? 'text-sm' :
            fontSize === 'large' ? 'text-lg' :
            'text-base'
          } ${!isVRChatRunning ? 'cursor-not-allowed' : ''}`}
          placeholder={`${t('chat.placeholder')} (${formatShortcut(sendShortcut)})`}
          disabled={isLoading || !isVRChatRunning}
        />
        <CharacterCounter current={message.length} max={MAX_LENGTH} />
      </div>
      
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={!isVRChatRunning}
        fullWidth
      >
        {t('chat.send')}
      </Button>

      <MessageHistory
        messages={messageHistory}
        currentIndex={historyIndex}
        onClear={clearHistory}
        onDelete={deleteMessage}
        onClick={setMessage}
        disabled={isLoading || !isVRChatRunning}
      />
    </form>
  );
}