import React from 'react'
import { useTranslation } from 'react-i18next'

interface TypingStatusSettingsProps {
  sendTypingStatus: boolean
  onSendTypingStatusChange: (sendTypingStatus: boolean) => void
}

export function TypingStatusSettings({ sendTypingStatus, onSendTypingStatusChange }: TypingStatusSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{t('settings.typing_status')}</h4>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <span className={`${!sendTypingStatus ? 'font-medium' : ''}`}>
              {t('settings.typing_status_disabled')}
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={sendTypingStatus}
              onChange={(e) => onSendTypingStatusChange(e.target.checked)}
            />
            <span className={`${sendTypingStatus ? 'font-medium' : ''}`}>
              {t('settings.typing_status_enabled')}
            </span>
          </label>
        </div>
      </div>
      <p className="text-sm opacity-75">
        {t('settings.typing_status_description')}
      </p>
    </div>
  )
}