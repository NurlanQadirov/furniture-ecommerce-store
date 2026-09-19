import { promises as fs } from 'node:fs';
import path from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';
import { isAdmin, unauthorized } from '@/lib/api';
import { slugify } from '@/lib/store/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_BYTES = 8 * 1024 * 1024;

/** Only formats a browser can render inline, keyed by the extension we write. */
const ALLOWED: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
};

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const form = await request.formData().catch(() => null);
  const file = form?.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Şəkil seçilməyib' }, { status: 400 });
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: 'Yalnız JPG, PNG, WEBP, AVIF və GIF yükləmək olar' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Şəkil 8 MB-dan böyükdür' }, { status: 400 });
  }

  // The stored name never comes from the upload: only a slug of it, so a
  // crafted filename cannot escape the uploads directory.
  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const fileName = `${Date.now().toString(36)}-${base}${extension}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(
    path.join(UPLOAD_DIR, fileName),
    Buffer.from(await file.arrayBuffer()),
  );

  return NextResponse.json({ url: `/uploads/${fileName}` }, { status: 201 });
}
