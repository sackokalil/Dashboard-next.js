import {fetchInvoiceById, fetchCustomers} from '@/app/lib/data'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import Form from '@/app/ui/invoices/edit-form'
import { notFound } from 'next/navigation'
import {z} from 'zod'
import { Metadata } from "next"


export const metadata : Metadata = {
    title : 'Modification de facture'
}


export default async function page({params}:{params: Promise<{id:string}>}) {
  const {id} = await params;

  //safeParse() retourne un objet de ce genre:
  /*
    si valide
    {
      success: true,
      data: "550e8400-e29b-41d4-a716-446655440000"
    }  

    Si invalide
    {
      success: false,
      error: // ZodError 
    }
    
  */
  const idShema = z.string().uuid();
  const parsedId = idShema.safeParse(id)
  if(!parsedId.success){
    notFound()
  }

  const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()])
  if(!invoice){
    notFound()
  }


  return(
    <main>

        <Breadcrumbs 
            breadcrumbs={[
                {label: 'Facture', href:'/dashboard/invoices'},
                {label: 'Edit invoice', href:`/dashboard/invoices/${id}/edit`, active:true}
            ]}
         />

         <Form customers={customers} invoice={invoice} />

    </main>
  )
}