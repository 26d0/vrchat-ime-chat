// Theme management store for system dark mode synchronization
import { writable } from 'svelte/store';

export const isDarkMode = writable(false);

// Check if we're in a Tauri environment
function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

// Initialize theme based on system preference
export function initTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (prefersDark) {
    document.documentElement.classList.add('dark');
    isDarkMode.set(true);
  } else {
    document.documentElement.classList.remove('dark');
    isDarkMode.set(false);
  }
}

// Listen for system theme changes
export function watchSystemTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    if (e.matches) {
      document.documentElement.classList.add('dark');
      isDarkMode.set(true);
    } else {
      document.documentElement.classList.remove('dark');
      isDarkMode.set(false);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  let tauriUnlisten: (() => void) | null = null;
  
  // If running in Tauri, also listen for Tauri theme changes
  if (isTauri()) {
    import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
      const appWindow = getCurrentWindow();
      appWindow.onThemeChanged(({ payload: theme }: { payload: string }) => {
        const isDark = theme === 'dark';
        if (isDark) {
          document.documentElement.classList.add('dark');
          isDarkMode.set(true);
        } else {
          document.documentElement.classList.remove('dark');
          isDarkMode.set(false);
        }
      }).then((unlisten: () => void) => {
        tauriUnlisten = unlisten;
      });
    }).catch(() => {
      // Ignore errors if Tauri APIs are not available
    });
  }
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
    if (tauriUnlisten) {
      tauriUnlisten();
    }
  };
}
