import { useEffect, useRef, useState } from "react";

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  id?: string;
  placeholder?: string;
  /** Controls how many decimals to display on blur. Default 2. */
  decimals?: number;
  /** When input is empty, what value to emit upstream. Default 0. */
  emptyValue?: number;
}

/**
 * Controlled numeric input that uses a local text buffer so the user can
 * freely clear / edit the field (including temporary empty state).
 * The numeric state is synced to the parent on every keystroke, but the
 * displayed text is only normalized on blur.
 */
export function NumberInput({
  value,
  onChange,
  step = 0.01,
  min,
  max,
  suffix,
  prefix,
  className = "",
  id,
  placeholder,
  decimals = 2,
  emptyValue = 0,
}: NumberInputProps) {
  const [text, setText] = useState<string>(() => formatLocal(value, decimals));
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    // Sync from upstream when value changes externally (e.g. reset button)
    const parsed = parseLocal(text);
    if (!Number.isFinite(parsed) || Math.abs(parsed - value) > 1e-9) {
      setText(formatLocal(value, decimals));
    }
  }, [value, decimals]);

  const emit = (raw: string) => {
    setText(raw);
    if (raw.trim() === "" || raw === "-" || raw === ".") {
      onChange(emptyValue);
      return;
    }
    const n = parseLocal(raw);
    if (Number.isFinite(n)) {
      let v = n;
      if (min != null && v < min) v = min;
      if (max != null && v > max) v = max;
      onChange(v);
    }
  };

  const handleBlur = () => {
    focused.current = false;
    if (text.trim() === "") {
      setText(formatLocal(emptyValue, decimals));
      return;
    }
    const n = parseLocal(text);
    setText(formatLocal(Number.isFinite(n) ? n : emptyValue, decimals));
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        className={`input-field ${className}`}
        style={{
          paddingLeft: prefix ? 34 : undefined,
          paddingRight: suffix ? 34 : undefined,
        }}
        value={text}
        step={step}
        onFocus={(e) => {
          focused.current = true;
          e.currentTarget.select();
        }}
        onChange={(e) => emit(e.target.value)}
        onBlur={handleBlur}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function parseLocal(s: string): number {
  if (!s) return NaN;
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  return Number(cleaned);
}

function formatLocal(v: number, digits: number): string {
  if (!Number.isFinite(v)) return "";
  return v.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
