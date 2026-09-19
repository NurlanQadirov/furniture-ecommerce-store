import CalculatorWizard from '@/components/calculator/CalculatorWizard';
import { getCalculatorSettings } from '@/lib/store/server';

export default async function CalculatorPage() {
  const settings = await getCalculatorSettings();

  return (
    <div className="bg-gray-50">
      <CalculatorWizard settings={settings} />
    </div>
  );
}
