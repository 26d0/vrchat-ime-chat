import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import { SendShortcut } from '../../stores/useSettingsStore';
import { formatShortcut } from '../../utils/shortcut';
import { Button } from '../ui/Button';

interface ShortcutInputProps {
  value: SendShortcut;
  onChange: (shortcut: SendShortcut) => void;
}

export function ShortcutInput({ value, onChange }: ShortcutInputProps) {
  const { t } = useTranslation();
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isCapturing) {
      // Ignore modifier-only keypresses
      if (!['Control', 'Meta', 'Alt', 'Shift'].includes(e.key)) {
        onChange({
          key: e.key,
          ctrlKey: e.ctrlKey,
          metaKey: e.metaKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
        });
        setIsCapturing(false);
      }
    }
  };

  useEffect(() => {
    if (isCapturing) {
      inputRef.current?.focus();
    }
  }, [isCapturing]);

  const handleReset = () => {
    onChange({
      key: 'Enter',
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
    });
  };

  return (
    <div className="form-control w-full">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="input input-bordered flex-1"
          value={isCapturing ? t('settings.pressKeys') : formatShortcut(value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsCapturing(true)}
          onBlur={() => setIsCapturing(false)}
          readOnly
        />
        <button
          onClick={handleReset}
          className="btn btn-ghost h-[42px] px-3"
          title={t('settings.resetShortcut')}
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}