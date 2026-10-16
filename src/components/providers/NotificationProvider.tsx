"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  CustomConfirmModal,
  CustomAlertModal,
  ConfirmDialogOptions,
  AlertDialogOptions,
} from "@/components/ui/custom-dialog";
import { ToastContainer, ToastItem, ToastVariant } from "@/components/ui/toast-notification";

interface NotificationContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  alert: (options: AlertDialogOptions | string) => Promise<void>;
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Confirm Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmDialogOptions | null>(null);
  const confirmResolverRef = useRef<((value: boolean) => void) | null>(null);

  // Alert Modal state
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertDialogOptions | null>(null);
  const alertResolverRef = useRef<(() => void) | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Confirm API
  const confirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      confirmResolverRef.current = resolve;
      setConfirmOptions(options);
      setConfirmOpen(true);
    });
  }, []);

  const handleConfirmAction = useCallback(() => {
    setConfirmOpen(false);
    if (confirmResolverRef.current) {
      confirmResolverRef.current(true);
      confirmResolverRef.current = null;
    }
  }, []);

  const handleCancelAction = useCallback(() => {
    setConfirmOpen(false);
    if (confirmResolverRef.current) {
      confirmResolverRef.current(false);
      confirmResolverRef.current = null;
    }
  }, []);

  // Alert API
  const alert = useCallback((options: AlertDialogOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      alertResolverRef.current = resolve;
      if (typeof options === "string") {
        setAlertOptions({
          title: "Pemberitahuan",
          message: options,
          variant: "info",
        });
      } else {
        setAlertOptions(options);
      }
      setAlertOpen(true);
    });
  }, []);

  const handleAlertClose = useCallback(() => {
    setAlertOpen(false);
    if (alertResolverRef.current) {
      alertResolverRef.current();
      alertResolverRef.current = null;
    }
  }, []);

  // Toast API
  const addToast = useCallback(
    (message: string, variant: ToastVariant, title?: string, duration = 3500) => {
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        message,
        variant,
        title,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastMethods = {
    success: (message: string, title?: string, duration?: number) =>
      addToast(message, "success", title, duration),
    error: (message: string, title?: string, duration?: number) =>
      addToast(message, "error", title, duration),
    warning: (message: string, title?: string, duration?: number) =>
      addToast(message, "warning", title, duration),
    info: (message: string, title?: string, duration?: number) =>
      addToast(message, "info", title, duration),
  };

  return (
    <NotificationContext.Provider
      value={{
        confirm,
        alert,
        toast: toastMethods,
      }}
    >
      {children}
      <CustomConfirmModal
        isOpen={confirmOpen}
        options={confirmOptions}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
      <CustomAlertModal
        isOpen={alertOpen}
        options={alertOptions}
        onClose={handleAlertClose}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </NotificationContext.Provider>
  );
};

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
