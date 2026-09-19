'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/solid';
import { Button, inputClass } from '@/components/admin/ui';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(payload.error ?? 'E-poçt və ya şifrə yanlışdır');
        return;
      }

      // `next` comes from the middleware redirect; keep it inside the panel so
      // the parameter cannot be used to bounce anyone to another site.
      const next = searchParams.get('next');
      router.replace(next?.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } catch {
      setError('Əlaqə qurulmadı');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/Logo2.png"
            alt="Mebeltech"
            width={400}
            height={400}
            className="h-12 w-auto mx-auto"
            priority
          />
          <h1 className="mt-4 text-lg font-bold">İdarə paneli</h1>
          <p className="text-sm text-gray-500">
            Davam etmək üçün e-poçt və şifrəni daxil edin
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
        >
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              E-poçt
            </span>
            <input
              type="email"
              autoFocus
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
              Şifrə
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </label>

          {error && <p className="text-sm font-bold text-red-700">{error}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            <LockClosedIcon className="h-4 w-4" />
            {busy ? 'Yoxlanılır…' : 'Daxil ol'}
          </Button>
        </form>
      </div>
    </div>
  );
}
