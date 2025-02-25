import { Keyboard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ShortcutInput } from './ShortcutInput'
import type { SendShortcut } from '../../stores/useSettingsStore'

interface SendShortcutSettingsProps {
  shortcut: SendShortcut
  onShortcutChange: (shortcut: SendShortcut) => void
}

export function SendShortcutSettings({ shortcut, onShortcutChange }: SendShortcutSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text text-base font-medium">
          <div className="flex items-center gap-2">
            <Keyboard size={18} />
            {t('settings.sendShortcut')}
          </div>
        </span>
      </label>
      <ShortcutInput
        value={shortcut}
        onChange={onShortcutChange}
      />
    </div>
  )
}