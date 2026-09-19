'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocalizedInput from '@/components/admin/LocalizedInput';
import { Button, Card, Field, StatusMessage, inputClass } from '@/components/admin/ui';
import type { ContactInfo } from '@/types';

interface ContactFormProps {
  contact: ContactInfo;
}

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ContactInfo>(contact);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const patch = (changes: Partial<ContactInfo>) =>
    setForm((previous) => ({ ...previous, ...changes }));

  async function save() {
    setStatus('saving');
    setError('');

    const response = await fetch('/api/admin/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus('error');
      setError(payload.error ?? 'Yadda saxlamaq alınmadı');
      return;
    }

    setStatus('saved');
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Əlaqə məlumatları</h1>
        <p className="text-sm text-gray-500">
          Bu məlumatlar footer, əlaqə səhifəsi və WhatsApp düymələrində istifadə olunur.
        </p>
      </div>

      <Card
        actions={
          <>
            <StatusMessage status={status} error={error} />
            <Button onClick={save} disabled={status === 'saving'}>
              Yadda saxla
            </Button>
          </>
        }
        title="Məlumatlar"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field label="Telefon">
              <input
                type="text"
                value={form.phone}
                onChange={(event) => patch({ phone: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field
              label="WhatsApp nömrəsi"
              hint="Ölkə kodu ilə, yalnız rəqəmlər: 994501234567"
            >
              <input
                type="text"
                value={form.whatsapp}
                onChange={(event) => patch({ whatsapp: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={form.email}
                onChange={(event) => patch({ email: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Instagram linki">
              <input
                type="url"
                value={form.instagram}
                placeholder="https://instagram.com/…"
                onChange={(event) => patch({ instagram: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="space-y-4">
            <LocalizedInput
              label="Ünvan"
              value={form.address}
              multiline
              rows={3}
              onChange={(address) => patch({ address })}
            />
            <Field
              label="Google Maps embed linki"
              hint="Google Maps → Paylaş → Xəritəni yerləşdir → src=… hissəsi"
            >
              <textarea
                rows={4}
                value={form.mapEmbedUrl}
                onChange={(event) => patch({ mapEmbedUrl: event.target.value })}
                className={`${inputClass} resize-y text-xs`}
              />
            </Field>
          </div>
        </div>
      </Card>
    </div>
  );
}
