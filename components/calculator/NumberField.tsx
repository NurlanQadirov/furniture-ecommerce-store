'use client';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export default function NumberField({
  label,
  value,
  onChange,
  step = 0.1,
  min = 0,
  max = 20,
}: NumberFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-custom-black mb-2">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number.parseFloat(event.target.value);
          onChange(Number.isFinite(next) ? Math.min(max, Math.max(min, next)) : 0);
        }}
        className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-lg focus:border-dark-green focus:outline-none transition-colors"
      />
    </label>
  );
}
