'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import ImageInput from '@/components/admin/ImageInput';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { Field, inputClass } from '@/components/admin/ui';
import { emptyLocalized } from '@/lib/i18n/localized';
import type { Localized } from '@/types';

export type FieldSpec =
  | { kind: 'localized'; key: string; label: string; multiline?: boolean }
  | { kind: 'image'; key: string; label: string }
  | { kind: 'number'; key: string; label: string; step?: number; hint?: string };

/** A calculator option row; the shape varies per list, so it stays generic. */
export type OptionRow = Record<string, unknown>;

interface OptionListEditorProps {
  title: string;
  description?: string;
  fields: FieldSpec[];
  rows: OptionRow[];
  onChange: (rows: OptionRow[]) => void;
  addLabel?: string;
  /** Guards against emptying a list the estimator cannot work without. */
  minRows?: number;
}

function blankRow(fields: FieldSpec[]): OptionRow {
  const row: OptionRow = {};
  for (const field of fields) {
    if (field.kind === 'localized') row[field.key] = emptyLocalized();
    else if (field.kind === 'number') row[field.key] = 0;
    else row[field.key] = '';
  }
  return row;
}

export default function OptionListEditor({
  title,
  description,
  fields,
  rows,
  onChange,
  addLabel = 'Sətir əlavə et',
  minRows = 0,
}: OptionListEditorProps) {
  const update = (index: number, key: string, value: unknown) => {
    const next = rows.map((row, position) =>
      position === index ? { ...row, [key]: value } : row,
    );
    onChange(next);
  };

  const remove = (index: number) => onChange(rows.filter((_, position) => position !== index));

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange([...rows, blankRow(fields)])}
          className="inline-flex items-center gap-1.5 rounded-lg border-2 border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-dark-green hover:border-dark-green transition-colors whitespace-nowrap"
        >
          <PlusIcon className="h-4 w-4" />
          {addLabel}
        </button>
      </header>

      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">Hələ sətir yoxdur.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {rows.map((row, index) => (
            <li key={(row.id as string) ?? `row-${index}`} className="p-4">
              <div className="flex items-start gap-4">
                <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.map((field) => {
                    if (field.kind === 'localized') {
                      return (
                        <div
                          key={field.key}
                          className={field.multiline ? 'sm:col-span-2' : undefined}
                        >
                          <LocalizedInput
                            label={field.label}
                            multiline={field.multiline}
                            rows={3}
                            value={(row[field.key] as Localized) ?? emptyLocalized()}
                            onChange={(value) => update(index, field.key, value)}
                          />
                        </div>
                      );
                    }
                    if (field.kind === 'image') {
                      return (
                        <div key={field.key} className="sm:col-span-2">
                          <ImageInput
                            label={field.label}
                            compact
                            value={(row[field.key] as string) ?? ''}
                            onChange={(value) => update(index, field.key, value)}
                          />
                        </div>
                      );
                    }
                    return (
                      <Field key={field.key} label={field.label} hint={field.hint}>
                        <input
                          type="number"
                          min={0}
                          step={field.step ?? 1}
                          value={String(row[field.key] ?? '')}
                          onChange={(event) =>
                            update(
                              index,
                              field.key,
                              event.target.value === '' ? '' : Number(event.target.value),
                            )
                          }
                          className={inputClass}
                        />
                      </Field>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={rows.length <= minRows}
                  aria-label="Sətri sil"
                  title={
                    rows.length <= minRows
                      ? 'Ən azı bir variant qalmalıdır'
                      : 'Sətri sil'
                  }
                  className="mt-6 p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
