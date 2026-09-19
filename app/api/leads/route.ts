import { NextResponse, type NextRequest } from 'next/server';
import { toNumber, toText } from '@/lib/store/coerce';
import { createId, mutateStore } from '@/lib/store/server';
import type { Lead } from '@/types';

/** Public endpoint — the calculator posts a measurement request here. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const phone = toText(body.phone);
  if (phone.replace(/\D/g, '').length < 7) {
    return NextResponse.json({ error: 'Telefon nömrəsi düzgün deyil' }, { status: 400 });
  }

  await mutateStore((store) => {
    const lead: Lead = {
      id: createId('lead'),
      name: toText(body.name).slice(0, 120),
      phone: phone.slice(0, 40),
      summary: toText(body.summary).slice(0, 2000),
      estimateMin: toNumber(body.estimateMin, 0, 0, 10_000_000),
      estimateMax: toNumber(body.estimateMax, 0, 0, 10_000_000),
      createdAt: new Date().toISOString(),
    };
    store.leads.push(lead);
    // Keep the file small — the owner works from the newest requests.
    if (store.leads.length > 500) store.leads.splice(0, store.leads.length - 500);
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
