/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-20 end-4 sm:end-6 z-[9999] flex flex-col gap-3 max-w-[min(100vw-2rem,24rem)] pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl border text-sm sm:text-base font-medium animate-[slideIn_0.35s_ease-out]
              ${
                toast.type === "success"
                  ? "bg-white text-ink border-primary/30 border-s-4 border-s-primary"
                  : "bg-white text-ink border-red-300 border-s-4 border-s-red-500"
              }`}
          >
            <span className="mt-0.5 shrink-0">
              {toast.type === "success" ? (
                <FaCheckCircle className="text-primary text-xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-xl" />
              )}
            </span>
            <p className="flex-1 leading-snug pt-0.5">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-muted hover:text-ink transition p-1"
              aria-label="Close"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(1.5rem); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
