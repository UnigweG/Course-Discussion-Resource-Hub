import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

/**
 * Lightweight toast notification system.
 * Usage: const { toast } = useToast();  toast('Saved!', 'success');
 * Types: 'success' | 'error' | 'info'
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const typeStyles = {
    success: 'bg-green-600 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900',
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-xs w-full">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium animate-slide-up ${typeStyles[t.type]}`}
            >
              <span>{t.message}</span>
              <button onClick={() => dismiss(t.id)} className="opacity-70 hover:opacity-100 shrink-0 text-lg leading-none">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
