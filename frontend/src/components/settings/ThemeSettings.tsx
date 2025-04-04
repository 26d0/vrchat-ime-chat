import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Theme } from '../../stores/useSettingsStore'

interface ThemeSettingsProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

export function ThemeSettings({ theme, onThemeChange }: ThemeSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text text-base font-medium">{t('settings.theme')}</span>
      </label>
      <div className="join w-full grid grid-cols-3 gap-0">
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${theme === 'system' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onThemeChange('system')}
          title={t('settings.systemDescription')}
        >
          <Monitor size={18} />
          <span className="inline-block ml-1 sm:ml-2 text-xs sm:text-sm">{t('settings.system')}</span>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${theme === 'light' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onThemeChange('light')}
          title={t('settings.lightDescription')}
        >
          <Sun size={18} />
          <span className="inline-block ml-1 sm:ml-2 text-xs sm:text-sm">{t('settings.light')}</span>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${theme === 'dark' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onThemeChange('dark')}
          title={t('settings.darkDescription')}
        >
          <Moon size={18} />
          <span className="inline-block ml-1 sm:ml-2 text-xs sm:text-sm">{t('settings.dark')}</span>
        </button>
      </div>
    </div>
  )
}