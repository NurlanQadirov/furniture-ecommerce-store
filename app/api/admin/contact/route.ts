import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/api';
import { toLocalized, toText } from '@/lib/store/coerce';
import { mutateStore } from '@/lib/store/server';

export async function PUT(request: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const contact = await mutateStore((store) => {
    store.contact = {
      phone: toText(body.phone, store.contact.phone),
      whatsapp: toText(body.whatsapp, store.contact.whatsapp),
      email: toText(body.email, store.contact.email),
      address: toLocalized(body.address, store.contact.address),
      instagram: toText(body.instagram, store.contact.instagram),
      mapEmbedUrl: toText(body.mapEmbedUrl, store.contact.mapEmbedUrl),
    };
    return store.contact;
  });

  return NextResponse.json(contact);
}
