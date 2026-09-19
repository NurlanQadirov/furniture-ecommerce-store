'use client';

import { useRouter } from 'next/navigation';
import { PhoneIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FaWhatsapp } from 'react-icons/fa';
import { Card } from '@/components/admin/ui';
import type { Lead } from '@/types';

interface LeadsListProps {
  leads: Lead[];
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function LeadsList({ leads }: LeadsListProps) {
  const router = useRouter();

  async function remove(lead: Lead) {
    if (!window.confirm(`${lead.phone} sorğusu silinsin?`)) return;
    await fetch(`/api/admin/leads/${lead.id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ölçü sorğuları</h1>
        <p className="text-sm text-gray-500">
          Kalkulyatordan gələn nömrələr — ən yenisi yuxarıda.
        </p>
      </div>

      <Card title={`${leads.length} sorğu`}>
        {leads.length === 0 ? (
          <p className="text-sm text-gray-500">Hələ sorğu yoxdur.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <li key={lead.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm">
                      {lead.name || 'Ad yazılmayıb'}
                      <span className="ml-2 font-normal text-xs text-gray-400">
                        {formatDate(lead.createdAt)}
                      </span>
                    </p>
                    <p className="text-sm text-dark-green font-bold">{lead.phone}</p>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed">{lead.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-custom-green px-3 py-1 text-xs font-bold text-dark-green whitespace-nowrap">
                      {lead.estimateMin} – {lead.estimateMax} AZN
                    </span>
                    <a
                      href={`tel:${lead.phone.replace(/\s/g, '')}`}
                      aria-label="Zəng et"
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-dark-green"
                    >
                      <PhoneIcon className="h-5 w-5" />
                    </a>
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-dark-green"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                    <button
                      type="button"
                      onClick={() => void remove(lead)}
                      aria-label="Sil"
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
