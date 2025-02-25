import { StatusMessage as StatusMessageType } from '../../types';

interface StatusMessageProps {
  status: StatusMessageType;
}

export function StatusMessage({ status }: StatusMessageProps) {
  return (
    <div className={`mt-4 p-3 rounded-lg border ${
      status.type === 'success' 
        ? 'bg-green-900/30 border-green-700/50' 
        : 'bg-red-900/30 border-red-700/50'
    } transition-all duration-200 backdrop-blur-sm`}>
      {status.text}
    </div>
  );
}