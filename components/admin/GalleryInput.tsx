'use client';

import { useRef, useState } from 'react';
import { ArrowUpTrayIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { inputClass } from '@/components/admin/ui';

interface GalleryInputProps {
  value: string[];
  onChange: (images: string[]) => void;
}

/** The extra photos shown inside a product page, beneath the main image. */
export default function GalleryInput({ value, onChange }: GalleryInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const add = (image: string) => {
    const trimmed = image.trim();
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed]);
  };

  async function uploadAll(files: FileList) {
    setUploading(true);
    setError('');
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const data = new FormData();
      data.append('file', file);
      try {
        const response = await fetch('/api/admin/upload', { method: 'POST', body: data });
        const payload = (await response.json()) as { url?: string; error?: string };
        if (response.ok && payload.url) uploaded.push(payload.url);
        else setError(payload.error ?? 'Yükləmə alınmadı');
      } catch {
        setError('Yükləmə alınmadı');
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded.filter((image) => !value.includes(image))]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div>
      <span className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
        Digər şəkillər
      </span>

      {value.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
          {value.map((image) => (
            <div
              key={image}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                aria-label="Sil"
                onClick={() => onChange(value.filter((item) => item !== image))}
                className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 text-red-600 shadow"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          placeholder="Şəkil linki əlavə edin"
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add(url);
              setUrl('');
            }
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => {
            add(url);
            setUrl('');
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-gray-200 px-3 py-2 text-xs font-bold text-dark-green hover:border-dark-green transition-colors whitespace-nowrap"
        >
          <PlusIcon className="h-4 w-4" />
          Əlavə et
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-gray-200 px-3 py-2 text-xs font-bold text-dark-green hover:border-dark-green transition-colors whitespace-nowrap disabled:opacity-50"
        >
          <ArrowUpTrayIcon className="h-4 w-4" />
          {uploading ? 'Yüklənir…' : 'Yüklə'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files?.length) void uploadAll(event.target.files);
          }}
        />
      </div>
      {error && <span className="block text-xs font-bold text-red-700 mt-1">{error}</span>}
    </div>
  );
}
