import type { SendShortcut } from '../stores/useSettingsStore';

export const formatShortcut = (shortcut: SendShortcut): string => {
  const parts = [];
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.metaKey) parts.push('Cmd');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  parts.push(shortcut.key);
  return parts.join(' + ');
};