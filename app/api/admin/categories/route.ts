import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/api';
import { toLocalized, toNumber, toText } from '@/lib/store/coerce';
import { createId, mutateStore, slugify } from '@/lib/store/server';
import type { Category } from '@/types';

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const name = toLocalized(body.name);
  if (!name.az) {
    return NextResponse.json({ error: 'Kateqoriya adı boş ola bilməz' }, { status: 400 });
  }

  const category = await mutateStore((store) => {
    const requested = toText(body.slug) || slugify(name.az);
    // Slugs are the public URL, so collisions get a numeric suffix.
    let slug = requested;
    let suffix = 2;
    while (store.categories.some((item) => item.slug === slug)) {
      slug = `${requested}-${suffix}`;
      suffix += 1;
    }

    const created: Category = {
      id: createId('cat'),
      slug,
      name,
      description: toLocalized(body.description),
      image: toText(body.image),
      order: toNumber(body.order, store.categories.length + 1, 0, 999),
    };
    store.categories.push(created);
    return created;
  });

  return NextResponse.json(category, { status: 201 });
}
