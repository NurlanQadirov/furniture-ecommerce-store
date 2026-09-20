'use client';

import { useState, type FormEvent } from 'react';
import { useT } from '@/components/providers/TranslationProvider';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { FaWhatsapp } from 'react-icons/fa';
import { useContactInfo } from '@/components/providers/SiteDataProvider';
import { whatsappLink } from '@/lib/contact';

interface LeadFormProps {
  summary: string;
  estimateMin: number;
  estimateMax: number;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The point of the whole calculator: the estimate is a range, and the only way
 * to turn it into a real quote is a free on-site measurement — so the number
 * gets captured here.
 */
export default function LeadForm({ summary, estimateMin, estimateMax }: LeadFormProps) {
  const t = useT();
  const contact = useContactInfo();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const whatsappMessage = `Salam! Kalkulyatordan təxmini qiymət aldım: ${estimateMin}-${estimateMax} AZN.\n${summary}\nPulsuz ölçü istəyirəm.`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phone.trim().length < 6) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, summary, estimateMin, estimateMax }),
      });
      setStatus(response.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-custom-green rounded-lg p-8 text-center">
        <CheckCircleIcon className="h-12 w-12 text-dark-green mx-auto" />
        <p className="mt-3 font-bold text-dark-green text-lg">{t('calc_lead_success')}</p>
      </div>
    );
  }

  return (
    <div className="bg-custom-green rounded-lg p-6 sm:p-8">
      <h3 className="font-serif text-3xl text-dark-green">{t('calc_lead_title')}</h3>
      <p className="mt-2 text-sm text-custom-black">{t('calc_lead_desc')}</p>

      <form
        onSubmit={handleSubmit}
        aria-label={t('aria_lead_form')}
        className="mt-6 space-y-4"
      >
        <label className="block">
          <span className="block text-sm font-bold mb-1">{t('calc_name')}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border-2 border-transparent bg-white px-4 py-3 focus:border-dark-green focus:outline-none transition-colors"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-bold mb-1">{t('calc_phone')} *</span>
          <input
            type="tel"
            name="tel"
            autoComplete="tel"
            required
            inputMode="tel"
            placeholder="+994 __ ___ __ __"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-lg border-2 border-transparent bg-white px-4 py-3 focus:border-dark-green focus:outline-none transition-colors"
          />
        </label>

        {status === 'error' && (
          <p className="text-sm font-bold text-red-700">{t('calc_lead_error')}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={status === 'sending'}
            className="flex-1 bg-dark-green text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-60"
          >
            {status === 'sending' ? t('calc_sending') : t('calc_free_measure')}
          </button>
          {contact.whatsapp && (
            <a
              href={whatsappLink(contact.whatsapp, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('aria_whatsapp')}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-dark-green border-2 border-dark-green font-bold py-3 px-6 rounded-lg hover:bg-dark-green hover:text-white transition-all"
            >
              <FaWhatsapp size={20} />
              {t('calc_whatsapp')}
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
