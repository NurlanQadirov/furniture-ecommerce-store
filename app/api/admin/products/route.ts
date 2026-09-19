import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/api';
import {
  toBoolean,
  toLocalized,
  toNumber,
  toStringArray,
  toText,
} from '@/lib/store/coerce';
import {
  LAST_POSITION,
  createId,
  mutateStore,
  resequenceCategory,
} from '@/lib/store/server';
import type { Product } from '@/types';

/** An empty order field means "append"; anything else is a 1-based position. */
function requestedPosition(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  return toNumber(value, 1, 1, 999);
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = toLocalized(body.name);
  const categoryId = toText(body.categoryId);

  if (!name.az) {
    return NextResponse.json({ error: 'Məhsul adı boş ola bilməz' }, { status: 400 });
  }

  const created = await mutateStore((store) => {
    if (!store.categories.some((item) => item.id === categoryId)) return null;

    const hasPrice = body.price !== null && body.price !== undefined && body.price !== '';
    const product: Product = {
      id: createId('p'),
      categoryId,
      name,
      description: toLocalized(body.description),
      mainImage: toText(body.mainImage),
      images: toStringArray(body.images),
      ...(hasPrice ? { price: toNumber(body.price, 0, 0, 1_000_000) } : {}),
      featured: toBoolean(body.featured),
      // Sorts last until the resequence below hands out the real position.
      order: LAST_POSITION,
      createdAt: new Date().toISOString(),
    };
    store.products.push(product);

    const position = requestedPosition(body.order);
    resequenceCategory(
      store.products,
      categoryId,
      position === undefined ? undefined : { id: product.id, to: position },
    );

    return product;
  });

  if (!created) {
    return NextResponse.json({ error: 'Kateqoriya seçilməyib' }, { status: 400 });
  }

  return NextResponse.json(created, { status: 201 });
}
