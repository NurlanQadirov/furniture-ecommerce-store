'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  PencilSquareIcon,
  PlusIcon,
  StarIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import GalleryInput from '@/components/admin/GalleryInput';
import ImageInput from '@/components/admin/ImageInput';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { Button, Card, Field, StatusMessage, inputClass } from '@/components/admin/ui';
import { emptyLocalized } from '@/lib/i18n/localized';
import type { Category, Localized, Product } from '@/types';

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
}

interface Draft {
  id: string | null;
  categoryId: string;
  name: Localized;
  description: Localized;
  mainImage: string;
  images: string[];
  price: string;
  featured: boolean;
  order: string;
}

function emptyDraft(categoryId: string): Draft {
  return {
    id: null,
    categoryId,
    name: emptyLocalized(),
    description: emptyLocalized(),
    mainImage: '',
    images: [],
    price: '',
    featured: false,
    order: '',
  };
}

function toDraft(product: Product): Draft {
  return {
    id: product.id,
    categoryId: product.categoryId,
    name: { ...product.name },
    description: { ...product.description },
    mainImage: product.mainImage,
    images: [...product.images],
    price: typeof product.price === 'number' ? String(product.price) : '',
    featured: product.featured,
    order: String(product.order),
  };
}

export default function ProductsManager({ products, categories }: ProductsManagerProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const categoryName = useMemo(() => {
    const map = new Map(categories.map((category) => [category.id, category.name.az]));
    return (id: string) => map.get(id) ?? '—';
  }, [categories]);

  const visible = useMemo(() => {
    // `order` is per category, so the listing is grouped the same way —
    // otherwise the numbers read as a jumble of repeated 1s and 2s.
    const rank = new Map(categories.map((category, index) => [category.id, index]));
    const inScope =
      filter === 'all' ? products : products.filter((item) => item.categoryId === filter);

    return [...inScope].sort((a, b) => {
      const byCategory =
        (rank.get(a.categoryId) ?? 999) - (rank.get(b.categoryId) ?? 999);
      return byCategory !== 0 ? byCategory : a.order - b.order;
    });
  }, [products, categories, filter]);

  const patch = (changes: Partial<Draft>) =>
    setDraft((previous) => (previous ? { ...previous, ...changes } : previous));

  async function save() {
    if (!draft) return;
    if (!draft.name.az.trim()) {
      setStatus('error');
      setError('Məhsulun adını (AZ) yazın');
      return;
    }
    if (!draft.categoryId) {
      setStatus('error');
      setError('Kateqoriya seçin');
      return;
    }

    setStatus('saving');
    setError('');

    const body = {
      categoryId: draft.categoryId,
      name: draft.name,
      description: draft.description,
      mainImage: draft.mainImage,
      images: draft.images,
      price: draft.price.trim() === '' ? '' : Number(draft.price),
      featured: draft.featured,
      order: draft.order.trim() === '' ? undefined : Number(draft.order),
    };

    const response = await fetch(
      draft.id ? `/api/admin/products/${draft.id}` : '/api/admin/products',
      {
        method: draft.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  async function toggleFeatured(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !product.featured }),
    });
    router.refresh();
  }

  async function remove(product: Product) {
    if (!window.confirm(`"${product.name.az}" silinsin?`)) return;
    await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <Card title="Məhsullar">
        <p className="text-sm text-gray-500">
          Əvvəlcə ən azı bir kateqoriya yaradın — hər məhsul bir kateqoriyaya aid olmalıdır.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Məhsullar</h1>
          <p className="text-sm text-gray-500">
            Ulduzla işarələnən məhsullar əsas səhifədə göstərilir.
          </p>
        </div>
        <Button
          onClick={() => {
            setDraft(emptyDraft(filter === 'all' ? (categories[0]?.id ?? '') : filter));
            setStatus('idle');
          }}
        >
          <PlusIcon className="h-4 w-4" />
          Yeni məhsul
        </Button>
      </div>

      {draft && (
        <Card
          title={draft.id ? 'Məhsulu redaktə et' : 'Yeni məhsul'}
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
                label="Məhsulun adı"
                value={draft.name}
                onChange={(name) => patch({ name })}
              />
              <LocalizedInput
                label="Açıqlama"
                value={draft.description}
                multiline
                rows={8}
                onChange={(description) => patch({ description })}
              />
            </div>

            <div className="space-y-4">
              <Field label="Kateqoriya">
                <select
                  value={draft.categoryId}
                  onChange={(event) => patch({ categoryId: event.target.value })}
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name.az}
                    </option>
                  ))}
                </select>
              </Field>

              <ImageInput
                label="Əsas şəkil"
                value={draft.mainImage}
                onChange={(mainImage) => patch({ mainImage })}
              />

              <GalleryInput value={draft.images} onChange={(images) => patch({ images })} />

              <div className="grid grid-cols-2 gap-4">
                <Field label="Qiymət (AZN)" hint="Boş qalsa qiymət göstərilmir">
                  <input
                    type="number"
                    min={0}
                    value={draft.price}
                    onChange={(event) => patch({ price: event.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field
                  label="Sıra"
                  hint="Kateqoriya daxilində yeri: 1 birinci. Boş qalsa sona əlavə olunur."
                >
                  <input
                    type="number"
                    min={1}
                    value={draft.order}
                    onChange={(event) => patch({ order: event.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>

              <button
                type="button"
                onClick={() => patch({ featured: !draft.featured })}
                className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
                  draft.featured
                    ? 'border-dark-green bg-custom-green/50'
                    : 'border-gray-200 hover:border-dark-green/40'
                }`}
              >
                {draft.featured ? (
                  <StarIcon className="h-6 w-6 text-dark-green" />
                ) : (
                  <StarOutline className="h-6 w-6 text-gray-400" />
                )}
                <span>
                  <span className="block text-sm font-bold">Əsas səhifədə göstər</span>
                  <span className="block text-xs text-gray-500">
                    Ulduzlu məhsullar «Kataloqdan seçmələr» bölməsinə düşür.
                  </span>
                </span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {!draft && (
      <Card
        title={`${visible.length} məhsul`}
        actions={
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className={`${inputClass} w-auto`}
          >
            <option value="all">Bütün kateqoriyalar</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name.az}
              </option>
            ))}
          </select>
        }
      >
        {visible.length === 0 ? (
          <p className="text-sm text-gray-500">Hələ məhsul yoxdur.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((product) => (
              <li key={product.id} className="flex items-center gap-4 py-3">
                <div className="h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  {product.mainImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.mainImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-sm">{product.name.az}</p>
                  <p className="truncate text-xs text-gray-500">
                    <span className="font-bold text-dark-green">#{product.order}</span>{' '}
                    {categoryName(product.categoryId)}
                    {typeof product.price === 'number' && ` · ${product.price} AZN`}
                    {product.images.length > 0 && ` · ${product.images.length + 1} şəkil`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void toggleFeatured(product)}
                  aria-label="Əsas səhifədə göstər"
                  title="Əsas səhifədə göstər"
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  {product.featured ? (
                    <StarIcon className="h-5 w-5 text-dark-green" />
                  ) : (
                    <StarOutline className="h-5 w-5 text-gray-300" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(toDraft(product));
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
                  onClick={() => void remove(product)}
                  aria-label="Sil"
                  className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      )}
    </div>
  );
}
