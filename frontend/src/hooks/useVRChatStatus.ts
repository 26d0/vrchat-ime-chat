import { useEffect, useState, useRef } from 'react';
import { IsVRChatRunning } from '../../wailsjs/go/main/App';
import { toast } from '../utils/toast';
import { useTranslation } from 'react-i18next';

export function useVRChatStatus(interval = 5000) {
  const [isRunning, setIsRunning] = useState(false);
  const previousStatus = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await IsVRChatRunning();
        setIsRunning(status);

        // Show toast only when status changes
        if (status !== previousStatus.current) {
          if (status) {
            toast.success(t('status.vrchat_running'));
          } else {
            toast.error(t('status.vrchat_not_running'));
          }
          previousStatus.current = status;
        }
      } catch (error) {
        console.error('Failed to check VRChat status:', error);
        setIsRunning(false);
        // Show error toast only when transitioning from running to error state
        if (previousStatus.current) {
          toast.error(t('status.vrchat_check_failed'));
          previousStatus.current = false;
        }
      }
    };

    // Check immediately
    checkStatus();

    // Then check periodically
    const timer = setInterval(checkStatus, interval);

    return () => clearInterval(timer);
  }, [interval, t]);

  return isRunning;
}