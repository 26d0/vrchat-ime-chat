import { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { TitleBar } from '../window/TitleBar';
import { WindowControls } from '../window/WindowControls';
import { SettingsDialog } from '../settings/SettingsDialog';
import { useTheme } from '../../hooks/useTheme';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  useTheme();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200 text-base-content">
        <TitleBar />
        <WindowControls />
        <div className="p-4 pt-12 max-w-2xl mx-auto">
          {children}
        </div>
        <SettingsDialog />
      </div>

      <Toaster
        theme="system"
        position="top-right"
        closeButton
        richColors
        toastOptions={{
          classNames: {
            toast: 'sonner-toast',
            title: 'text-base-content',
            description: 'text-base-content/80',
          }
        }}
      />
    </>
  );
}