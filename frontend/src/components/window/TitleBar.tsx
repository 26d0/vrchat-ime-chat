import { useTranslation } from 'react-i18next';

export function TitleBar() {
  const { t } = useTranslation();

  return (
    <div data-wails-drag className="fixed top-0 left-0 right-0 h-8 bg-gray-800/50 backdrop-blur flex items-center select-none border-b border-gray-700/50 z-10">
      <div data-wails-drag className="pl-3 text-sm font-medium text-gray-200 flex-1">{t('app.title')}</div>
    </div>
  );
}