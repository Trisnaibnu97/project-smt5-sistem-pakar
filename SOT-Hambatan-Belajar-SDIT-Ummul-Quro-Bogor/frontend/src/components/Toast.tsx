import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.show) return null;

  const bg = toast.type === 'success' ? 'bg-primary' : toast.type === 'error' ? 'bg-danger' : 'bg-info';
  const icon = toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ';

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 max-w-sm text-white text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 ${bg}`}
    >
      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">
        {icon}
      </span>
      <span>{toast.msg}</span>
    </div>
  );
};
