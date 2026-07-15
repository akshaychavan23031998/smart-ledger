import type { InputHTMLAttributes } from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId =
    id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-');

  const describedBy = [
    error ? `${inputId}-error` : null,
    hint ? `${inputId}-hint` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy || undefined}
        className={[
          'w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition',
          'placeholder:text-slate-400',
          'focus:ring-2',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-slate-300 focus:border-slate-500 focus:ring-slate-200',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />

      {hint ? (
        <p
          id={`${inputId}-hint`}
          className="text-xs text-slate-500"
        >
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}