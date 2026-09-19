import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, notFound, unauthorized } from '@/lib/api';
import { toLocalized, toNumber, toText } from '@/lib/store/coerce';
import { mutateStore, slugify } from '@/lib/store/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const updated = await mutateStore((store) => {
    const category = store.categories.find((item) => item.id === id);
    if (!category) return null;

    category.name = toLocalized(body.name, category.name);
    category.description = toLocalized(body.description, category.description);
    category.image = toText(body.image, category.image);
    category.order = toNumber(body.order, category.order, 0, 999);

    const requested = toText(body.slug) || slugify(category.name.az) || category.slug;
    if (requested !== category.slug) {
      let slug = requested;
      let suffix = 2;
      while (store.categories.some((item) => item.id !== id && item.slug === slug)) {
        slug = `${requested}-${suffix}`;
        suffix += 1;
      }
      category.slug = slug;
    }

    return category;
  });

  if (!updated) return notFound('Kateqoriya tapılmadı');
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  const result = await mutateStore((store) => {
    const index = store.categories.findIndex((item) => item.id === id);
    if (index === -1) return null;

    // Products would otherwise be orphaned into an unreachable category.
    const productCount = store.products.filter((item) => item.categoryId === id).length;
    if (productCount > 0) return { blocked: productCount };

    store.categories.splice(index, 1);
    return { blocked: 0 };
  });

  if (!result) return notFound('Kateqoriya tapılmadı');
  if (result.blocked > 0) {
    return NextResponse.json(
      {
        error: `Bu kateqoriyada ${result.blocked} məhsul var. Əvvəlcə onları silin və ya başqa kateqoriyaya keçirin.`,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
