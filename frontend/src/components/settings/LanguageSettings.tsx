import { useTranslation } from 'react-i18next'
import type { Language } from '../../stores/useSettingsStore'

interface LanguageSettingsProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function LanguageSettings({ language, onLanguageChange }: LanguageSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="form-control w-full">
      <label className="label py-1">
        <span className="label-text text-base font-medium">{t('settings.language')}</span>
      </label>
      <div className="join w-full grid grid-cols-3 gap-0">
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${language === 'en' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onLanguageChange('en')}
          title={t('settings.englishDescription')}
        >
          <div className="flex items-center justify-center whitespace-nowrap gap-1 sm:gap-2 min-w-0">
            <span className="font-medium flex-none">En</span>
            <span className="text-xs sm:text-sm truncate">{t('settings.english')}</span>
          </div>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${language === 'ja' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onLanguageChange('ja')}
          title={t('settings.japaneseDescription')}
        >
          <span className="font-medium min-w-[20px] text-center">あ</span>
          <span className="inline-block ml-1 sm:ml-2 text-xs sm:text-sm truncate">{t('settings.japanese')}</span>
        </button>
        <button
          type="button"
          className={`join-item btn btn-sm sm:btn-md flex-1 hover:bg-base-200 transition-colors duration-200
            ${language === 'kip' ? 'btn-primary hover:bg-primary/90' : ''}`}
          onClick={() => onLanguageChange('kip')}
          title="キプ"
        >
          <span className="font-medium min-w-[20px] text-center">キプ</span>
          <span className="inline-block ml-1 sm:ml-2 text-xs sm:text-sm truncate">キプ</span>
        </button>
      </div>
    </div>
  )
}