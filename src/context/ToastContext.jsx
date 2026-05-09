import { createContext, useContext, useMemo, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function pushToast(message, type = 'success') {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3000);
  }

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-lg border border-sage/20 bg-white px-4 py-3 text-sm text-ink shadow-soft dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {toast.type === 'info' ? <Info className="h-5 w-5 text-brass" /> : <CheckCircle2 className="h-5 w-5 text-sage" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} aria-label="Dismiss toast">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
