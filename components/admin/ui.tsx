'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-dark-green text-white hover:bg-dark-green/90',
  secondary: 'bg-white text-dark-green border-2 border-dark-green hover:bg-custom-green',
  danger: 'bg-white text-red-700 border-2 border-red-200 hover:bg-red-50 hover:border-red-400',
  ghost: 'text-gray-600 hover:text-custom-black hover:bg-gray-100',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, actions, children, className = '' }: CardProps) {
  return (
    <section
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            {title && <h2 className="font-bold text-custom-black">{title}</h2>}
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, hint, children, className = '' }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm focus:border-dark-green focus:outline-none transition-colors bg-white';

interface StatusMessageProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  error?: string;
}

/** One line of feedback shared by every admin form. */
export function StatusMessage({ status, error }: StatusMessageProps) {
  if (status === 'idle') return null;
  if (status === 'saving') return <span className="text-xs text-gray-500">Yadda saxlanılır…</span>;
  if (status === 'saved') return <span className="text-xs font-bold text-dark-green">Yadda saxlanıldı ✓</span>;
  return <span className="text-xs font-bold text-red-700">{error ?? 'Xəta baş verdi'}</span>;
}
