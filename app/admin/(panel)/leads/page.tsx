import LeadsList from '@/components/admin/LeadsList';
import { getLeads } from '@/lib/store/server';

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return <LeadsList leads={leads} />;
}
