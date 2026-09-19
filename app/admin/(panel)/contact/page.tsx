import ContactForm from '@/components/admin/ContactForm';
import { getContact } from '@/lib/store/server';

export default async function AdminContactPage() {
  const contact = await getContact();

  return <ContactForm contact={contact} />;
}
