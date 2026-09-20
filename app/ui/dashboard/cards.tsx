import { 
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon
} from "@heroicons/react/24/outline"
import { lusitana } from "@/app/ui/fonts"
import { fetchCardData } from "@/app/lib/data"


export default async function CardWrapper() {

    const {totalPaidInvoices, totalPendingInvoices, totalCustomers, totalInvoices} = await fetchCardData()

    return(
        <>
            <Cards title="Collected" value={totalPaidInvoices} type="collected"/>
            <Cards title="Pending" value={totalPendingInvoices} type="pending"/>
            <Cards title="Total invoices" value={totalInvoices} type="invoices"/>
            <Cards title="Total customers" value={totalCustomers} type="customers"/>
        </>
    )
    
}


const iconMap = {
    collected: BanknotesIcon,
    customers:UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon
}

export  function Cards({title, value, type}: {
    title:string,
    value: string | number,
    type: 'invoices' | 'customers' | 'pending' | 'collected'
}) {
    const Icon = iconMap[type]
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
        <div className="flex p-4">
            {Icon ? <Icon className="h-5 w-5 text-gray-700"/> : null}
            <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
            {value}
        </p>
    </div>
  )
}
