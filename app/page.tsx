import HeroSlider from '@/components/home/HeroSlider';
import WhyMebeltech from '@/components/home/WhyMebeltech';
import CatalogPicks from '@/components/home/CatalogPicks';
import Philosophy from '@/components/home/Philosophy';
import WeeklyOffer from '@/components/home/WeeklyOffer';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <WhyMebeltech />
      <CatalogPicks />
      <Philosophy />
      <WeeklyOffer />
    </div>
  );
}
