import { getT } from '@/lib/i18n/server';
import { CheckBadgeIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';

export default async function WhyMebeltech() {
  const t = await getT();

  return (
    <section data-reveal="pending" id="why-mebeltech" className="w-full bg-custom-green py-24">
      <div className="w-full max-w-[1100px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-6xl text-dark-green animate-item">
            {t('whyMebeltech_title')}
          </h2>
          <p className="mt-4 text-lg text-custom-black max-w-3xl mx-auto animate-item">
            {t('whyMebeltech_desc')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center animate-item">
            <CheckBadgeIcon className="h-12 w-12 text-dark-green" />
            <h3 className="font-bold text-xl mt-4">{t('quality_title')}</h3>
            <p className="text-sm mt-2 text-gray-600">{t('quality_desc')}</p>
          </div>
          <div className="flex flex-col items-center animate-item">
            <TruckIcon className="h-12 w-12 text-dark-green" />
            <h3 className="font-bold text-xl mt-4">{t('delivery_title')}</h3>
            <p className="text-sm mt-2 text-gray-600">{t('delivery_desc')}</p>
          </div>
          <div className="flex flex-col items-center animate-item">
            <ShieldCheckIcon className="h-12 w-12 text-dark-green" />
            <h3 className="font-bold text-xl mt-4">{t('warranty_title')}</h3>
            <p className="text-sm mt-2 text-gray-600">{t('warranty_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
