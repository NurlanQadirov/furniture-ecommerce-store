import HeroSlider from '@/components/home/HeroSlider';
import WhyMebeltech from '@/components/home/WhyMebeltech';
import CatalogPicks from '@/components/home/CatalogPicks';
import CalculatorTeaser from '@/components/home/CalculatorTeaser';
import Philosophy from '@/components/home/Philosophy';
import WeeklyOffer from '@/components/home/WeeklyOffer';
import { getFeaturedProducts, getProducts } from '@/lib/store/server';

export default async function HomePage() {
  const featured = await getFeaturedProducts();
  // Fall back to the newest products so the home page is never empty before the
  // owner has starred anything in the admin panel.
  const picks = featured.length > 0 ? featured : (await getProducts()).slice(0, 6);

  return (
    <div>
      <HeroSlider />
      <WhyMebeltech />
      <CatalogPicks products={picks.slice(0, 3)} />
      <CalculatorTeaser />
      <Philosophy />
      <WeeklyOffer products={picks} />
    </div>
  );
}
