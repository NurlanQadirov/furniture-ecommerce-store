import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, notFound, unauthorized } from '@/lib/api';
import { mutateStore } from '@/lib/store/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  if (!(await isAdmin())) return unauthorized();

  const { id } = await params;

  const removed = await mutateStore((store) => {
    const index = store.leads.findIndex((item) => item.id === id);
    if (index === -1) return false;
    store.leads.splice(index, 1);
    return true;
  });

  if (!removed) return notFound('Sorğu tapılmadı');
  return NextResponse.json({ ok: true });
}
