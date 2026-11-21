import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toastOrMessage: Omit<ToastMessage, 'id'> | string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toastOrMessage: Omit<ToastMessage, 'id'> | string, explicitType?: ToastType) => {
      let toastObj: Omit<ToastMessage, 'id'>;
      if (typeof toastOrMessage === 'string') {
        toastObj = {
          message: toastOrMessage,
          type: explicitType || 'info',
          duration: 4000,
        };
      } else {
        toastObj = toastOrMessage;
      }

      const { type, title, message, duration = 4000 } = toastObj;
      setToasts((prev) => {
        // Prevent duplicate toast if message is already displayed
        if (prev.some((t) => t.message === message)) {
          return prev;
        }
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const newToast: ToastMessage = { id, type, title, message, duration };

        if (duration > 0) {
          setTimeout(() => {
            removeToast(id);
          }, duration);
        }

        // Keep maximum 1 active toast to avoid screen clutter
        return [newToast];
      });
    },
    [removeToast]
  );

  // Listen for global custom events from axios interceptors or outside react tree
  useEffect(() => {
    const handleGlobalToast = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type?: ToastType;
        title?: string;
        message: string;
        duration?: number;
      }>;
      if (customEvent.detail && customEvent.detail.message) {
        showToast({
          type: customEvent.detail.type || 'error',
          title: customEvent.detail.title,
          message: customEvent.detail.message,
          duration: customEvent.detail.duration || 4500,
        });
      }
    };

    window.addEventListener('app:toast', handleGlobalToast);
    return () => {
      window.removeEventListener('app:toast', handleGlobalToast);
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3"
      >
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-200 animate-in slide-in-from-top-3 fade-in ${
                isError
                  ? 'bg-rose-950/90 text-rose-100 border-rose-800/80'
                  : isSuccess
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-800/80'
                  : isWarning
                  ? 'bg-amber-950/90 text-amber-100 border-amber-800/80'
                  : 'bg-slate-900/90 text-slate-100 border-slate-700/80'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {!isError && !isSuccess && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
              </div>

              <div className="flex-1 text-xs">
                {toast.title && <div className="font-bold text-sm mb-0.5">{toast.title}</div>}
                <div className="leading-relaxed opacity-95">{toast.message}</div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
