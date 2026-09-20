import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';


export const metadata : Metadata = {
    title : 'Clients'
}


export default async function Page({searchParams}:{searchParams?: Promise<{query?:string}>}) {
  const params = await searchParams;

  const query = params?.query || ''
  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
