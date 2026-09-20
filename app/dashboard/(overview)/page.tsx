import { lusitana } from "@/app/ui/fonts"
import RevenueChart from "@/app/ui/dashboard/revenue-chart"
import LatestInvoices from "@/app/ui/dashboard/latest-invoices"
import { Suspense } from "react"
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from "@/app/ui/skeletons"
import CardWrapper from "@/app/ui/dashboard/cards"
import { Metadata } from "next"


export const metadata : Metadata = {
    title : 'Admin'
}


export default  async function Page(){

    //const {totalPaidInvoices, totalPendingInvoices, totalCustomers, totalInvoices} = await fetchCardData()
    //const latestInvoices = await fetchLatestInvoices()
    //const revenue = await fetchRevenue() 

    return(
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Tableau de bord
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8" >
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <LatestInvoices  / >
                </Suspense>
                
            </div>
            
        </main>
    )
}


{/** Vue que RevenueChart appelle une fonction (fetchRevenue()) qui met 3 séconde pour retourne les donné
 * (les 3 seconde sont fait ici expres avec setTimeout() pour les besoin du concept Suspense), ce qui ralentit 
 * le temps de chargement, parce que tant que tous les composant ne sont pas chargé on continuera toujours à voir
 * le skeleton du chargement que le fichier 'loading.tsx' retourne; c'est la raison pour la quel on a ciblé le 
 * composant qui met plus de temps(ici <RevenueChart /> ) et on l'a entouré du composant <Suspense ></Suspense >
 * tout en passant au fallback de ce dernier le skeleton à afficher avant que le chargement du <RevenueChart />
 * ne se termine. ce qui fait que les autre composant vont rapidement s'afficher(parce qu'ils ont un temps de 
 * chargement un peu plus petit) et on continue à voir le skeleton du composant <RevenueChart /> jusqu'à ce que 
 * celui ci soit aussi complement chargé..
 * 
 * C'est le meme cas avec le composant <LatestInvoices />
 * 
 * Vue que dans le dashboard, on a 4 card identique, du coup on les a regroupé dans un wrapper puuis créer un skeleton
 * unique <CardsSkeleton /> qui retourne aussi 4 fois le skeleton d'un seul Card.
*/}