import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  description?: string;
  duration?: number;
}

export const toast = {
  success: (title: string, options?: ToastOptions) => {
    return sonnerToast.success(title, {
      duration: 3000,
      ...options,
    });
  },

  error: (title: string, options?: ToastOptions) => {
    return sonnerToast.error(title, {
      duration: 4000,
      ...options,
    });
  },

  info: (title: string, options?: ToastOptions) => {
    return sonnerToast.info(title, {
      duration: 3000,
      ...options,
    });
  },

  dismiss: (toastId: string | number) => {
    sonnerToast.dismiss(toastId);
  },
};