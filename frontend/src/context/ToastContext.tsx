/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

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

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // حذف الرسالة بعد 5 ثواني
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 1500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* مكان ظهور التوست */}
      <div className="fixed bottom-5 right-5 space-y-3 z-9999">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-10 py-4 rounded-xl shadow-lg text-white text-lg animate-slide 
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};
