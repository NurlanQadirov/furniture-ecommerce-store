'use client';

import { useRef, useState } from 'react';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { inputClass } from '@/components/admin/ui';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  /** Compact variant used inside the calculator's dense option rows. */
  compact?: boolean;
}

/**
 * Accepts a file upload or a pasted URL — the owner photographs finished work
 * on a phone, but stock imagery still arrives as a link.
 */
export default function ImageInput({
  label,
  value,
  onChange,
  compact = false,
}: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file: File) {
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setError(payload.error ?? 'Yükləmə alınmadı');
        return;
      }
      onChange(payload.url);
    } catch {
      setError('Yükləmə alınmadı');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
        {label}
      </span>

      <div className="flex items-start gap-3">
        <div
          className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 ${
            compact ? 'h-16 w-16' : 'h-24 w-24'
          }`}
        >
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label="Şəkli sil"
                className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 text-red-600 shadow"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
              şəkil yoxdur
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <input
            type="url"
            value={value}
            placeholder="https://… və ya yükləyin"
            onChange={(event) => onChange(event.target.value)}
            className={inputClass}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-gray-200 px-3 py-1.5 text-xs font-bold text-dark-green hover:border-dark-green transition-colors disabled:opacity-50"
            >
              <ArrowUpTrayIcon className="h-4 w-4" />
              {uploading ? 'Yüklənir…' : 'Kompüterdən yüklə'}
            </button>
            {error && <span className="text-xs font-bold text-red-700">{error}</span>}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </div>
      </div>
    </div>
  );
}
