import { lusitana } from "@/app/ui/fonts"
import Search from "@/app/ui/search"
import { CreateInvoices } from "@/app/ui/invoices/buttons"
import Table from "@/app/ui/invoices/table"
import { Suspense } from "react"
import { InvoicesTableSkeleton } from "@/app/ui/skeletons"
import { fetchInvoicesPages } from "@/app/lib/data"
import Pagination from "@/app/ui/invoices/pagination"
import { Metadata } from "next"




export const metadata : Metadata = {
    title : 'Facture'
}


export default async function Page({searchParams}: {searchParams?:{query?:string, page?:string}}){

    const query = searchParams?.query || ''
    const currentPage = Number(searchParams?.page) || 1

    const totalPages = await fetchInvoicesPages(query)
    //dans Nextjs 15+, on ferait :
   /* export default async function Page({
        searchParams,
        }: {
        searchParams?: Promise<{ query?: string; page?: string }>
        }) {
        const params = await searchParams
        const query = params?.query || ''
        const currentPage = Number(params?.page) || 1

        // ...
    }*/

    return (
        <div className="w-full">

            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}> Factures </h1>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Recherche des factures" />
                <CreateInvoices />

            </div>

            <Suspense key={ query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>

        </div>
    )
}