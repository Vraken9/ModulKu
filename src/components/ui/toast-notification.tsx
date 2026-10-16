"use client";

import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[110] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.variant === "success"
              ? "bg-white/95 border-emerald-300 text-slate-900 shadow-emerald-500/10"
              : toast.variant === "error"
              ? "bg-white/95 border-red-300 text-slate-900 shadow-red-500/10"
              : toast.variant === "warning"
              ? "bg-white/95 border-amber-300 text-slate-900 shadow-amber-500/10"
              : "bg-white/95 border-blue-300 text-slate-900 shadow-blue-500/10"
          }`}
        >
          <div className="mt-0.5 flex-shrink-0">
            {toast.variant === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            {toast.variant === "error" && (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            {toast.variant === "warning" && (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
            {toast.variant === "info" && (
              <Info className="w-5 h-5 text-blue-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">
                {toast.title}
              </h4>
            )}
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
