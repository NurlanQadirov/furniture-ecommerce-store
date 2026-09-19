import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/api';
import { normalizeCalculator } from '@/lib/store/normalizeCalculator';
import { mutateStore } from '@/lib/store/server';

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const body = await request.json().catch(() => ({}));

  const settings = await mutateStore((store) => {
    store.calculator = normalizeCalculator(body, store.calculator);
    return store.calculator;
  });

  return NextResponse.json(settings);
}
