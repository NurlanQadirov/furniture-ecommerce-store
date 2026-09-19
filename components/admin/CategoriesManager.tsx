'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import ImageInput from '@/components/admin/ImageInput';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { Button, Card, Field, StatusMessage, inputClass } from '@/components/admin/ui';
import { emptyLocalized } from '@/lib/i18n/localized';
import type { Category, Localized } from '@/types';

interface CategoriesManagerProps {
  categories: Category[];
  /** Product totals per category id, so deletions can be explained up front. */
  counts: Record<string, number>;
}

interface Draft {
  id: string | null;
  name: Localized;
  description: Localized;
  image: string;
  slug: string;
  order: string;
}

const emptyDraft = (): Draft => ({
  id: null,
  name: emptyLocalized(),
  description: emptyLocalized(),
  image: '',
  slug: '',
  order: '',
});

export default function CategoriesManager({ categories, counts }: CategoriesManagerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const patch = (changes: Partial<Draft>) =>
    setDraft((previous) => (previous ? { ...previous, ...changes } : previous));

  async function save() {
    if (!draft) return;
    if (!draft.name.az.trim()) {
      setStatus('error');
      setError('Kateqoriya adını (AZ) yazın');
      return;
    }

    setStatus('saving');
    setError('');

    const response = await fetch(
      draft.id ? `/api/admin/categories/${draft.id}` : '/api/admin/categories',
      {
        method: draft.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          image: draft.image,
          slug: draft.slug,
          order: draft.order.trim() === '' ? undefined : Number(draft.order),
        }),
      },
    );

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus('error');
      setError(payload.error ?? 'Yadda saxlamaq alınmadı');
      return;
    }

    setStatus('saved');
    setDraft(null);
    router.refresh();
  }

  async function remove(category: Category) {
    if (!window.confirm(`"${category.name.az}" kateqoriyası silinsin?`)) return;

    const response = await fetch(`/api/admin/categories/${category.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      window.alert(payload.error ?? 'Silmək alınmadı');
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Kateqoriyalar</h1>
          <p className="text-sm text-gray-500">
            Mətbəx, salon, yataq… — məhsullar səhifəsinin ilk ekranı.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft());
            setStatus('idle');
          }}
        >
          <PlusIcon className="h-4 w-4" />
          Yeni kateqoriya
        </Button>
      </div>

      {draft && (
        <Card
          title={draft.id ? 'Kateqoriyanı redaktə et' : 'Yeni kateqoriya'}
          actions={
            <>
              <StatusMessage status={status} error={error} />
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Ləğv et
              </Button>
              <Button onClick={save} disabled={status === 'saving'}>
                Yadda saxla
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <LocalizedInput
                label="Kateqoriya adı"
                value={draft.name}
                onChange={(name) => patch({ name })}
              />
              <LocalizedInput
                label="Qısa açıqlama"
                value={draft.description}
                multiline
                rows={4}
                onChange={(description) => patch({ description })}
              />
            </div>
            <div className="space-y-4">
              <ImageInput
                label="Kateqoriya şəkli"
                value={draft.image}
                onChange={(image) => patch({ image })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Link (slug)" hint="Boş qalsa addan yaradılır">
                  <input
                    type="text"
                    value={draft.slug}
                    placeholder="metbex-mebeli"
                    onChange={(event) => patch({ slug: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Sıra">
                  <input
                    type="number"
                    min={0}
                    value={draft.order}
                    onChange={(event) => patch({ order: event.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card title={`${categories.length} kateqoriya`}>
        <ul className="divide-y divide-gray-100">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                {category.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={category.image} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-sm">{category.name.az}</p>
                <p className="truncate text-xs text-gray-500">
                  /products/{category.slug} · {counts[category.id] ?? 0} məhsul
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDraft({
                    id: category.id,
                    name: { ...category.name },
                    description: { ...category.description },
                    image: category.image,
                    slug: category.slug,
                    order: String(category.order),
                  });
                  setStatus('idle');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                aria-label="Redaktə et"
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-dark-green"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => void remove(category)}
                aria-label="Sil"
                className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
