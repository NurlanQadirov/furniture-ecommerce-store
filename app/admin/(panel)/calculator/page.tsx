import CalculatorForm from '@/components/admin/CalculatorForm';
import { getCalculatorSettings } from '@/lib/store/server';

export default async function AdminCalculatorPage() {
  const settings = await getCalculatorSettings();

  return <CalculatorForm settings={settings} />;
}
