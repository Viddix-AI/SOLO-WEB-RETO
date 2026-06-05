import type { ChangeEventHandler, ReactNode } from "react";

type InputMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

/**
 * Form field. Ported from 01-ui-components.jsx (`Field`): label (+ required *),
 * either a default `.reto-input` input or custom `children` (select/textarea),
 * and an error line. No hooks → usable inside client form components.
 */
export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required,
  autoComplete,
  name,
  full,
  inputMode,
  children,
}: {
  label?: string;
  type?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  name?: string;
  full?: boolean;
  inputMode?: InputMode;
  children?: ReactNode;
}) {
  const cls = ["field", error ? "invalid" : ""].filter(Boolean).join(" ");
  return (
    <div className={cls} style={full ? { gridColumn: "1 / -1" } : undefined}>
      {label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-ink-4"> *</span>}
        </label>
      )}
      {children ?? (
        <input
          id={name}
          name={name}
          className="reto-input"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
      )}
      {error && <span className="err">{error}</span>}
    </div>
  );
}
