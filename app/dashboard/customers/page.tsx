import CustomersTable from '@/app/ui/customers/table';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';


export const metadata : Metadata = {
    title : 'Clients'
}


export default async function Page({searchParams}:{searchParams?:{query?:string}}) {

  const query = searchParams?.query || ''
  const customers = await fetchFilteredCustomers(query);

  return (
    <main>
      <CustomersTable customers={customers} />
    </main>
  );
}
