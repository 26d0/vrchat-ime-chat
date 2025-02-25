import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type Language = 'en' | 'ja' | 'kip'
export type FontSize = 'small' | 'medium' | 'large'

export interface SendShortcut {
  key: string
  ctrlKey: boolean
  metaKey: boolean
  altKey: boolean
  shiftKey: boolean
}
interface SettingsState {
  theme: Theme
  language: Language
  fontSize: FontSize
  sendShortcut: SendShortcut
  sendTypingStatus: boolean
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  setFontSize: (fontSize: FontSize) => void
  setSendShortcut: (shortcut: SendShortcut) => void
  setSendTypingStatus: (sendTypingStatus: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'ja',
      fontSize: 'medium',
      sendTypingStatus: true,
      sendShortcut: {
        key: 'Enter',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false
      },
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize }),
      setSendShortcut: (shortcut) => set({ sendShortcut: shortcut }),
      setSendTypingStatus: (sendTypingStatus) => set({ sendTypingStatus }),
    }),
    {
      name: 'settings-storage',
    }
  )
)