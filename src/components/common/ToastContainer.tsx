import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-14 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#073B30] text-white p-3.5 rounded-xl shadow-2xl flex items-start gap-3 border border-emerald-500/20 backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 hover:scale-[1.01]"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-teal-300" />}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              {toast.title && (
                <div className="font-semibold text-xs text-emerald-200 tracking-wide">
                  {toast.title}
                </div>
              )}
              <p className="text-xs text-teal-100 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-teal-300 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
