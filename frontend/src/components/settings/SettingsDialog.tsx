import React, { useEffect, useRef, useState } from 'react'
import { Settings as SettingsIcon, X, Save } from 'lucide-react'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { useTranslation } from 'react-i18next'
import { toast } from '../../utils/toast'
import { ThemeSettings } from './ThemeSettings'
import { LanguageSettings } from './LanguageSettings'
import { FontSizeSettings } from './FontSizeSettings'
import { SendShortcutSettings } from './SendShortcutSettings'
import { TypingStatusSettings } from './TypingStatusSettings'
import type { Theme, Language, FontSize, SendShortcut } from '../../stores/useSettingsStore'

// Focus trap utility
const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
    
    // Set initial focus
    firstElement?.focus()
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    document.addEventListener('keydown', handleTabKey)
    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive])
  
  return containerRef
}

export function SettingsDialog() {
  // Settings and translation hooks
  const {
    theme, language, fontSize, sendShortcut, sendTypingStatus,
    setTheme, setLanguage, setFontSize, setSendShortcut, setSendTypingStatus
  } = useSettingsStore()
  const { t } = useTranslation()
  
  // Reference for the dialog element and focus return element
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  
  // Track toast count to prevent multiple toasts
  const [changesMade, setChangesMade] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
  // Settings state (for the option to save/cancel)
  const [tempSettings, setTempSettings] = useState({
    theme,
    language,
    fontSize,
    sendShortcut,
    sendTypingStatus
  })
  
  // Focus trap
  const focusTrapRef = useFocusTrap(isOpen)
  
  // Handle closing with cleanup
  const handleClose = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault()
    }
    
    // Show summary toast if multiple changes were made
    if (changesMade) {
      toast.success(t('settings.changesSaved'))
      setChangesMade(false)
    }
    
    // Close dialog with animation
    const dialog = dialogRef.current
    if (dialog && dialog.open) {
      const container = dialog.querySelector('div')
      if (container) {
        container.classList.add('animate-fade-out')
        setTimeout(() => {
          dialog.close()
          // Return focus to the element that opened the dialog
          returnFocusRef.current?.focus()
          setIsOpen(false)
        }, 150)
      } else {
        dialog.close()
        returnFocusRef.current?.focus()
        setIsOpen(false)
      }
    }
  }
  
  // Open dialog with animation
  const openDialog = () => {
    returnFocusRef.current = document.activeElement as HTMLElement
    const dialog = dialogRef.current
    if (dialog && !dialog.open) {
      dialog.showModal()
      setIsOpen(true)
      
      // Set temp settings to current settings
      setTempSettings({
        theme,
        language,
        fontSize,
        sendShortcut,
        sendTypingStatus
      })
      
      // Add animation
      const container = dialog.querySelector('div')
      if (container) {
        container.classList.remove('animate-fade-out')
        container.classList.add('animate-fade-in')
      }
    }
  }

  // Group related setting changes to reduce toast notifications
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setTempSettings({...tempSettings, theme: newTheme})
    setChangesMade(true)
    // Only show individual toast if this is the only change
    if (!changesMade) {
      toast.info(t('settings.themeChanged', { theme: t(`settings.${newTheme}`) }))
    }
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setTempSettings({...tempSettings, language: newLanguage})
    setChangesMade(true)
    // Only show individual toast if this is the only change
    if (!changesMade) {
      toast.info(t('settings.languageChanged', {
        language: t(`settings.${newLanguage === 'kip' ? 'kip' : newLanguage === 'ja' ? 'japanese' : 'english'}`)
      }))
    }
  }

  const handleFontSizeChange = (newSize: FontSize) => {
    setFontSize(newSize)
    setTempSettings({...tempSettings, fontSize: newSize})
    setChangesMade(true)
    // Only show individual toast if this is the only change
    if (!changesMade) {
      toast.info(t('settings.fontSizeChanged', { size: t(`settings.${newSize}`) }))
    }
  }

  const handleShortcutChange = (shortcut: SendShortcut) => {
    setSendShortcut(shortcut)
    setTempSettings({...tempSettings, sendShortcut: shortcut})
    setChangesMade(true)
    // Only show individual toast if this is the only change
    if (!changesMade) {
      toast.info(t('settings.shortcutChanged'))
    }
  }
  
  const handleTypingStatusChange = (enabled: boolean) => {
    setSendTypingStatus(enabled)
    setTempSettings({...tempSettings, sendTypingStatus: enabled})
    setChangesMade(true)
    // Only show individual toast if this is the only change
    if (!changesMade) {
      toast.info(t(enabled ? 'settings.typingStatusEnabled' : 'settings.typingStatusDisabled'))
    }
  }

  // Add an event listener to handle external open requests
  useEffect(() => {
    const handleOpenEvent = () => {
      openDialog()
    }
    
    document.addEventListener('open-settings', handleOpenEvent)
    
    return () => {
      document.removeEventListener('open-settings', handleOpenEvent)
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      id="settings_modal"
      className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-sm bg-black/30 border-0 outline-none overflow-hidden m-0 p-4"
      aria-labelledby="settings-title"
      aria-describedby="settings-description"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          handleClose()
        }
      }}
      onClick={(e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
        <div
          ref={focusTrapRef}
          className="w-[clamp(320px,90vw,600px)] bg-[hsl(var(--b1))] rounded-lg shadow-xl p-6 animate-fade-in"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 id="settings-title" className="font-bold text-xl">{t('settings.title')}</h3>
            <button
              className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors duration-200"
              aria-label={t('settings.close')}
              title={t('settings.close')}
              onClick={handleClose}
            >
              <X size={20} />
            </button>
          </div>
          
          <p id="settings-description" className="sr-only">
            {t('settings.description')}
          </p>

          <div className="space-y-6" role="form">
            <ThemeSettings theme={theme} onThemeChange={handleThemeChange} />
            <LanguageSettings language={language} onLanguageChange={handleLanguageChange} />
            <FontSizeSettings fontSize={fontSize} onFontSizeChange={handleFontSizeChange} />
            <SendShortcutSettings shortcut={sendShortcut} onShortcutChange={handleShortcutChange} />
            <TypingStatusSettings sendTypingStatus={sendTypingStatus} onSendTypingStatusChange={handleTypingStatusChange} />
            
            <div className="flex justify-end pt-4">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleClose}
                aria-label={t('settings.save')}
              >
                <Save size={16} className="mr-1" />
                {t('settings.saveAndClose')}
              </button>
            </div>
          </div>
        </div>
      </dialog>
  )
}

// We've consolidated the SettingsButton into the SettingsDialog component
// to better handle focus management and reduce code duplication
export function SettingsButton() {
  const { t } = useTranslation()
  return (
    <button
      onClick={() => {
        const dialog = document.getElementById('settings_modal') as HTMLDialogElement
        if (dialog && !dialog.open) {
          // Trigger the open method in the dialog component
          const event = new CustomEvent('open-settings')
          document.dispatchEvent(event)
          dialog.showModal()
        }
      }}
      className="btn btn-ghost btn-sm"
      aria-label={t('settings.open')}
    >
      <SettingsIcon size={16} />
    </button>
  )
}