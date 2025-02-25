import { Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { FontSize } from '../../stores/useSettingsStore'

interface FontSizeSettingsProps {
  fontSize: FontSize
  onFontSizeChange: (size: FontSize) => void
}

export function FontSizeSettings({ fontSize, onFontSizeChange }: FontSizeSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text text-base font-medium">
          <div className="flex items-center gap-2">
            <Type size={18} />
            {t('settings.fontSize')}
          </div>
        </span>
      </label>
      <div className="join w-full grid grid-cols-3 gap-0">
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${fontSize === 'small' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onFontSizeChange('small')}
          title={t('settings.smallFontDescription')}
        >
          <span className="text-xs sm:text-sm">{t('settings.small')}</span>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${fontSize === 'medium' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onFontSizeChange('medium')}
          title={t('settings.mediumFontDescription')}
        >
          <span className="text-xs sm:text-sm">{t('settings.medium')}</span>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${fontSize === 'large' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onFontSizeChange('large')}
          title={t('settings.largeFontDescription')}
        >
          <span className="text-xs sm:text-sm">{t('settings.large')}</span>
        </button>
      </div>
    </div>
  )
}