import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, notFound, unauthorized } from '@/lib/api';
import {
  toBoolean,
  toLocalized,
  toNumber,
  toStringArray,
  toText,
} from '@/lib/store/coerce';
import { LAST_POSITION, mutateStore, resequenceCategory } from '@/lib/store/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** An empty order field leaves the position alone; anything else is 1-based. */
function requestedPosition(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  return toNumber(value, 1, 1, 999);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const updated = await mutateStore((store) => {
    const product = store.products.find((item) => item.id === id);
    if (!product) return null;

    const previousCategory = product.categoryId;
    const categoryId = toText(body.categoryId, product.categoryId);
    if (store.categories.some((item) => item.id === categoryId)) {
      product.categoryId = categoryId;
    }

    product.name = toLocalized(body.name, product.name);
    product.description = toLocalized(body.description, product.description);
    product.mainImage = toText(body.mainImage, product.mainImage);
    product.images = toStringArray(body.images);
    product.featured = toBoolean(body.featured, product.featured);

    // An empty price field clears the price rather than writing a zero.
    if (body.price === '' || body.price === null) {
      delete product.price;
    } else if (body.price !== undefined) {
      product.price = toNumber(body.price, product.price ?? 0, 0, 1_000_000);
    }

    const position = requestedPosition(body.order);

    if (product.categoryId !== previousCategory) {
      // It joins the end of its new category, and the old one closes the gap.
      product.order = LAST_POSITION;
      resequenceCategory(store.products, previousCategory);
    }

    resequenceCategory(
      store.products,
      product.categoryId,
      position === undefined ? undefined : { id: product.id, to: position },
    );

    return product;
  });

  if (!updated) return notFound('Məhsul tapılmadı');
  return NextResponse.json(updated);
}

/** Toggles the star without having to send the whole product back. */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const updated = await mutateStore((store) => {
    const product = store.products.find((item) => item.id === id);
    if (!product) return null;
    product.featured = toBoolean(body.featured, !product.featured);
    return product;
  });

  if (!updated) return notFound('Məhsul tapılmadı');
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  const removed = await mutateStore((store) => {
    const index = store.products.findIndex((item) => item.id === id);
    if (index === -1) return false;

    const [product] = store.products.splice(index, 1);
    if (product) resequenceCategory(store.products, product.categoryId);
    return true;
  });

  if (!removed) return notFound('Məhsul tapılmadı');
  return NextResponse.json({ ok: true });
}
