'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OptionListEditor, {
  type FieldSpec,
  type OptionRow,
} from '@/components/admin/OptionListEditor';
import { Button, Card, Field, StatusMessage, inputClass } from '@/components/admin/ui';
import type { CalculatorSettings } from '@/lib/store/schema';

interface CalculatorFormProps {
  settings: CalculatorSettings;
}

type Tab = 'general' | 'kitchen' | 'wardrobe' | 'living' | 'fixed';

const tabs: Array<{ id: Tab; label: string }> = [
  { id: 'general', label: 'Ümumi' },
  { id: 'kitchen', label: 'Mətbəx' },
  { id: 'wardrobe', label: 'Qarderob' },
  { id: 'living', label: 'Salon / TV' },
  { id: 'fixed', label: 'Çarpayı / komod' },
];

const nameField: FieldSpec = { kind: 'localized', key: 'name', label: 'Ad' };
const imageField: FieldSpec = { kind: 'image', key: 'image', label: 'Şəkil' };

const hardwareFields: FieldSpec[] = [
  nameField,
  { kind: 'localized', key: 'description', label: 'Açıqlama', multiline: true },
  { kind: 'number', key: 'multiplier', label: 'Əmsal', step: 0.01, hint: '1 = əlavəsiz' },
];

const addOnFields: FieldSpec[] = [
  nameField,
  { kind: 'number', key: 'price', label: 'Qiymət (AZN)' },
  { kind: 'number', key: 'max', label: 'Maks. say', hint: '1 = açıq/bağlı' },
];

/**
 * Every tariff the estimator uses, editable by the owner.
 *
 * Material prices in Baku move often, and a workshop that has to call its
 * developer for each change simply stops using the calculator — so nothing
 * here is hard-coded in the app.
 */
export default function CalculatorForm({ settings }: CalculatorFormProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('general');
  const [form, setForm] = useState<CalculatorSettings>(settings);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const patch = (changes: Partial<CalculatorSettings>) =>
    setForm((previous) => ({ ...previous, ...changes }));

  /** Replaces one list inside one room section without retyping the tree. */
  function patchSection<K extends 'kitchen' | 'wardrobe' | 'living' | 'fixed'>(
    section: K,
    key: string,
    rows: OptionRow[],
  ) {
    setForm((previous) => ({
      ...previous,
      [section]: { ...previous[section], [key]: rows },
    }));
  }

  async function save() {
    setStatus('saving');
    setError('');

    const response = await fetch('/api/admin/calculator', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus('error');
      setError(payload.error ?? 'Yadda saxlamaq alınmadı');
      return;
    }

    setForm((await response.json()) as CalculatorSettings);
    setStatus('saved');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kalkulyator</h1>
          <p className="text-sm text-gray-500">
            Metr qiymətləri, əmsallar və aksesuar qiymətləri buradan dəyişir.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusMessage status={status} error={error} />
          <Button onClick={save} disabled={status === 'saving'}>
            Yadda saxla
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold transition-colors whitespace-nowrap ${
              tab === item.id
                ? 'bg-white text-dark-green shadow-sm'
                : 'text-gray-500 hover:text-custom-black'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <Card
          title="Ümumi parametrlər"
          description="Bunlar bütün hesablamalara tətbiq olunur."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Field
              label="Aralıq (%)"
              hint="Nəticə ±bu faizlə göstərilir"
            >
              <input
                type="number"
                min={0}
                max={60}
                value={form.rangePercent}
                onChange={(event) => patch({ rangePercent: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Yuvarlaqlaşdırma" hint="Məs. 50 → 3450 / 4500">
              <input
                type="number"
                min={1}
                value={form.roundTo}
                onChange={(event) => patch({ roundTo: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Montaj (AZN)">
              <input
                type="number"
                min={0}
                value={form.installationFee}
                onChange={(event) => patch({ installationFee: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
            <Field label="Daşınma (AZN)">
              <input
                type="number"
                min={0}
                value={form.deliveryFee}
                onChange={(event) => patch({ deliveryFee: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>
        </Card>
      )}

      {tab === 'kitchen' && (
        <div className="space-y-4">
          <OptionListEditor
            title="Materiallar (metr qiyməti)"
            description="Aşağı və yuxarı şkaflar üçün 1 metrin qiyməti."
            minRows={1}
            fields={[
              nameField,
              imageField,
              { kind: 'number', key: 'lowerPerM', label: 'Aşağı (AZN/m)' },
              { kind: 'number', key: 'upperPerM', label: 'Yuxarı (AZN/m)' },
            ]}
            rows={form.kitchen.materials as unknown as OptionRow[]}
            onChange={(rows) => patchSection('kitchen', 'materials', rows)}
          />
          <OptionListEditor
            title="Tezgah növləri"
            minRows={1}
            fields={[nameField, imageField, { kind: 'number', key: 'pricePerM', label: 'AZN / m' }]}
            rows={form.kitchen.counterTops as unknown as OptionRow[]}
            onChange={(rows) => patchSection('kitchen', 'counterTops', rows)}
          />
          <OptionListEditor
            title="Furnitura səviyyələri"
            description="Əmsal aşağı + yuxarı + tezgah cəminə vurulur."
            minRows={1}
            fields={hardwareFields}
            rows={form.kitchen.hardwareLevels as unknown as OptionRow[]}
            onChange={(rows) => patchSection('kitchen', 'hardwareLevels', rows)}
          />
          <OptionListEditor
            title="Aksesuarlar"
            description="Karqo, qaldırıcı, LED, künc çıxarıcı — sabit qiymətlər."
            fields={addOnFields}
            rows={form.kitchen.accessories as unknown as OptionRow[]}
            onChange={(rows) => patchSection('kitchen', 'accessories', rows)}
          />
        </div>
      )}

      {tab === 'wardrobe' && (
        <div className="space-y-4">
          <OptionListEditor
            title="Materiallar (kvadrat qiyməti)"
            minRows={1}
            fields={[nameField, imageField, { kind: 'number', key: 'pricePerM2', label: 'AZN / m²' }]}
            rows={form.wardrobe.materials as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'materials', rows)}
          />
          <OptionListEditor
            title="Qapı tipləri"
            minRows={1}
            fields={[nameField, { kind: 'number', key: 'multiplier', label: 'Əmsal', step: 0.01 }]}
            rows={form.wardrobe.doorTypes as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'doorTypes', rows)}
          />
          <OptionListEditor
            title="Dərinlik variantları"
            minRows={1}
            fields={[nameField, { kind: 'number', key: 'multiplier', label: 'Əmsal', step: 0.01 }]}
            rows={form.wardrobe.depthOptions as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'depthOptions', rows)}
          />
          <OptionListEditor
            title="Güzgü / şüşə əlavələri"
            minRows={1}
            fields={[nameField, imageField, { kind: 'number', key: 'pricePerM2', label: 'AZN / m²' }]}
            rows={form.wardrobe.glassOptions as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'glassOptions', rows)}
          />
          <OptionListEditor
            title="Daxili doldurma"
            description="Rəf, ştanq, şuflyad — hər biri üçün sabit qiymət."
            fields={addOnFields}
            rows={form.wardrobe.interiorItems as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'interiorItems', rows)}
          />
          <OptionListEditor
            title="Furnitura səviyyələri"
            minRows={1}
            fields={hardwareFields}
            rows={form.wardrobe.hardwareLevels as unknown as OptionRow[]}
            onChange={(rows) => patchSection('wardrobe', 'hardwareLevels', rows)}
          />
        </div>
      )}

      {tab === 'living' && (
        <div className="space-y-4">
          <OptionListEditor
            title="Materiallar (kvadrat qiyməti)"
            minRows={1}
            fields={[nameField, imageField, { kind: 'number', key: 'pricePerM2', label: 'AZN / m²' }]}
            rows={form.living.materials as unknown as OptionRow[]}
            onChange={(rows) => patchSection('living', 'materials', rows)}
          />
          <OptionListEditor
            title="Bölmələr və əlavələr"
            description="Asma bölmə, vitrin şüşəsi, LED, kitab rəfi."
            fields={addOnFields}
            rows={form.living.modules as unknown as OptionRow[]}
            onChange={(rows) => patchSection('living', 'modules', rows)}
          />
          <OptionListEditor
            title="Furnitura səviyyələri"
            minRows={1}
            fields={hardwareFields}
            rows={form.living.hardwareLevels as unknown as OptionRow[]}
            onChange={(rows) => patchSection('living', 'hardwareLevels', rows)}
          />
        </div>
      )}

      {tab === 'fixed' && (
        <OptionListEditor
          title="Hazır modellər"
          description="Çarpayı və komod ölçüyə görə deyil, modelə görə qiymətlənir."
          minRows={1}
          fields={[
            nameField,
            imageField,
            { kind: 'localized', key: 'description', label: 'Qısa açıqlama', multiline: true },
            { kind: 'number', key: 'price', label: 'Qiymət (AZN)' },
          ]}
          rows={form.fixed.models as unknown as OptionRow[]}
          onChange={(rows) => patchSection('fixed', 'models', rows)}
        />
      )}
    </div>
  );
}
