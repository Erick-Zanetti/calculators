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
  /** Fixed number of fractional digits the input always displays. Default 2. */
  decimals?: number;
  /** Value emitted upstream when the user clears every digit. Default 0. */
  emptyValue?: number;
}

/**
 * Mask-style numeric input. The displayed text is always derived from `value`
 * — there is no separate text buffer. Every keystroke produces a fresh
 * numeric value, which the component re-formats to the canonical pt-BR
 * representation. This keeps the field consistent during edits: deleting a
 * digit shifts all the others, so "100.000,00" → backspace → "10.000,00",
 * not "100.000,0".
 *
 * Behaviour mirrors what most Brazilian fintech apps do (Nubank, Itaú, etc.):
 * only digits are accepted, the cursor is always at the end, and decimals are
 * positioned automatically based on the `decimals` prop.
 */
export function NumberInput({
  value,
  onChange,
  step,
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
  const display = formatLocal(value, decimals);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 18);
    if (digitsOnly === "") {
      onChange(emptyValue);
      return;
    }
    const intVal = Number(digitsOnly);
    const factor = Math.pow(10, decimals);
    let next = intVal / factor;
    if (min != null && next < min) next = min;
    if (max != null && next > max) next = max;
    onChange(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Some browsers move the cursor on arrow keys, but our value is fully
    // controlled by the digit string — caret position is meaningless. Block
    // arrows so they do not visually move a cursor that is always at the end.
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const target = e.currentTarget;
      target.setSelectionRange(target.value.length, target.value.length);
    }
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
        value={display}
        step={step}
        onFocus={(e) => e.currentTarget.select()}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function formatLocal(v: number, digits: number): string {
  if (!Number.isFinite(v)) return "";
  return v.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
