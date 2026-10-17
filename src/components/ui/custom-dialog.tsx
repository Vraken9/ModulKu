"use client";

import React, { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type DialogVariant = "danger" | "warning" | "info" | "success" | "primary";

export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
}

export interface AlertDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  variant?: DialogVariant;
}

interface CustomConfirmModalProps {
  isOpen: boolean;
  options: ConfirmDialogOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CustomConfirmModal: React.FC<CustomConfirmModalProps> = ({
  isOpen,
  options,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen || !options) return null;

  const variant = options.variant || "primary";

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <HelpCircle className="w-6 h-6 text-slate-700" />;
    }
  };

  const getIconContainerStyle = () => {
    switch (variant) {
      case "danger":
        return "bg-red-50 border-red-200 text-red-600";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-600";
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "info":
        return "bg-slate-100 border-slate-200 text-slate-800";
      default:
        return "bg-slate-100 border-slate-200 text-slate-800";
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white font-bold";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white font-bold";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white font-bold";
      case "info":
        return "bg-slate-900 hover:bg-slate-800 text-white font-bold";
      default:
        return "bg-slate-900 hover:bg-slate-800 text-white font-bold";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${getIconContainerStyle()}`}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {options.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
              {options.message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-xs font-semibold px-4 h-9 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            {options.cancelText || "Batal"}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            className={`text-xs px-5 h-9 rounded-xl shadow-xs cursor-pointer transition-all ${getConfirmButtonClass()}`}
          >
            {options.confirmText || "Lanjutkan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface CustomAlertModalProps {
  isOpen: boolean;
  options: AlertDialogOptions | null;
  onClose: () => void;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({
  isOpen,
  options,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape" || e.key === "Enter") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !options) return null;

  const variant = options.variant || "info";

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
      case "info":
        return <Info className="w-6 h-6 text-blue-600" />;
      default:
        return <Info className="w-6 h-6 text-slate-700" />;
    }
  };

  const getIconContainerStyle = () => {
    switch (variant) {
      case "danger":
        return "bg-red-50 border-red-200 text-red-600";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-600";
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-600";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-600";
      default:
        return "bg-slate-100 border-slate-200 text-slate-800";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${getIconContainerStyle()}`}
          >
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {options.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
              {options.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="text-xs font-bold px-6 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs cursor-pointer"
          >
            {options.confirmText || "Mengerti"}
          </Button>
        </div>
      </div>
    </div>
  );
};
