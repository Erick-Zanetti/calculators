import { NumberInput } from "./NumberInput";

interface MoneyInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
  id?: string;
}

export function MoneyInput({ label, value, onChange, prefix, suffix, hint, id }: MoneyInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-text-dim">
        {label}
      </label>
      <NumberInput
        id={id}
        value={value}
        onChange={onChange}
        prefix={prefix}
        suffix={suffix}
        decimals={2}
      />
      {hint && <span className="text-xs text-text-mute">{hint}</span>}
    </div>
  );
}
