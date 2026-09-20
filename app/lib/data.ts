import {sql} from '@/app/lib/db'
import { formatCurrency } from './utils';
import { Revenue, LatestInvoiceRaw, InvoicesTable, CustomerField, InvoiceForm, CustomersTableType } from './definitions';
import { unstable_noStore as noStore } from 'next/cache'




export async function fetchRevenue(){
    noStore() // prerendering stops here
  // the following code only runs at request time
    try{

        //console.log('Recuperation des données de revenus ...')
        //await new Promise((resolve)=> setTimeout(resolve, 3000)) //pour les besoin de l'illustration du concept <Suspense></Suspense>

        const data = await sql`SELECT * from revenue`
        //console.log('Recupération de données terminée après 3 seconde')

        return data as Revenue[] 

    }catch(error){
        console.error('database Error : ', error)
        throw new Error('Echec de la récupération des données de revenue')
    }
}



export async function fetchLatestInvoices(){
    noStore()
    try{

        //await new Promise((resolve)=> setTimeout(resolve, 5000))//pour les besoin du concept <Suspense></Suspense>
        const data = (await sql`
        SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
        FROM invoices
        JOIN customers ON invoices.customer_id=customers.id
        ORDER BY invoices.date DESC
        LIMIT 5`) as LatestInvoiceRaw[]

        /*data = [
            { amount: .. , name: ..., image_url:...., email:..., id:.... },
            { amount: .. , name: ..., image_url:...., email:..., id:.... },
            { amount: .. , name: ..., image_url:...., email:..., id:.... },
            { amount: .. , name: ..., image_url:...., email:..., id:.... },
            { amount: .. , name: ..., image_url:...., email:..., id:.... },
        ]*/

        const latestInvoices = data.map((invoice)=>({
            ...invoice,
            amount: formatCurrency(invoice.amount ?? '0')
        }))
        
        return latestInvoices

    }catch(error){
        console.error('Database error', error)
        throw new Error('Echec lors de la récupération des données de Card')
    }
}




export async function fetchCardData(){
    noStore()
    try{
        const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
        const customerCountPromise = sql`SELECT COUNT(*) FROM customers`
        const invoicesStatusPromise = sql`SELECT
        SUM(CASE WHEN status='paid' THEN amount ELSE 0 END) as "paid",
        SUM(CASE WHEN status='pending' THEN amount ELSE 0 END) as "pending"
        FROM invoices`;

        //[count: 15, count: 10, [paid: 118516, pending: 125632]]
        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoicesStatusPromise
        ])
        const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
        const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0')
        const totalCustomers = Number(data[1][0].count ?? '0') //le [0] est la ligne retourné par la requettes
        // et le .count est la colone de l'element qu'on veut(qui est biensure la seule aussi ici)
        //NB: si le nom de la colonne n'est pas explicitement indiqué(avec as 'total' par exemple), le nom 
        //de la fonction est utilisé automatiquement comme nom de colonne, exemple : 
        //const total = await sql`SELECT COUNT(*) FROM invoices`; renvoit une colonne appélé 'count' 
        // avec la valeur de la requettes accessible sur : total[0].count
        //total[0] étant la ligne retourné
        const totalInvoices = Number(data[0][0].count)

        return{
            totalPaidInvoices,
            totalPendingInvoices,
            totalCustomers,
            totalInvoices
        }


    }catch(error){
        console.error('Database error', error)
        throw new Error('Echec lors de la récupération des données de Card')
    }
}



const ITEMS_PER_PAGE = 6
export async function fetchFilteredInvoices({query, currentPage}:{query: string, currentPage: number}){
    noStore() //rendu dynamique
    const offset = (currentPage -1) * ITEMS_PER_PAGE // le nombre d'item à sauter avant d'arriver sur la page courante
    
    try{

        const invoices = (await sql`
        SELECT
            invoices.id,
            invoices.amount,
            invoices.date,
            invoices.status,
            customers.name,
            customers.email,
            customers.image_url
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        WHERE 
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`} OR
            invoices.amount::text ILIKE ${`%${query}%`} OR
            invoices.date::text ILIKE ${`%${query}%`} OR
            invoices.status ILIKE ${`%${query}%`}
        ORDER BY invoices.date DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `) as InvoicesTable[] // pour neons postgres
        /*avec ancien posgres de vercel on ferait
        const data = await sql<InvoicesTable>`...` */

        /*Si query = '', alors la condition devient ILIKE '%%'. Or % en SQL veut dire "n'importe quelle suite 
        de caractères" — donc '%%' matche absolument tout, y compris les chaînes vides ou pleines. Résultat : 
        aucun filtre n'est appliqué, et la requête retourne toutes les factures */

        return invoices

    }catch(error){
        console.error('Database error', error)
        throw new Error('Echec lors de la récupération des données des factures')
    }
}



export async function fetchInvoicesPages(query:string) {
    noStore()
    try{
        //la requete recupere le nombre de factures d'un client donné, puis on le divise par 6
        //vue qu'on veut afficher 6 facture par page(voir la fonction ci-haut fetchFilteredInvoices() )
        //NB: si query est vide, alors le nombre de facture ne sera plus pour un client donné plutot toutes les factures
        //Et le nombre de page sera calculé en fonction de ça
        const count = await sql`
        SELECT COUNT(*)
        FROM invoices
        JOIN customers ON invoices.customer_id = customers.id
        WHERE
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`} OR
            invoices.amount::text ILIKE ${`%${query}%`} OR
            invoices.date::text ILIKE ${`%${query}%`} OR
            invoices.status ILIKE ${`%${query}%`}
            `;
        const totalPages = Math.ceil(Number(count[0].count)/ITEMS_PER_PAGE) //le nombre de page total par customer
        //vue que dans le champs de recherche la recherche ne peux conserner qu'un customer à la fois, et sachant qu'on
        //affiche 6 Items par pages(ITEMS_PER_PAGE defini dans la fonction fetchFilteredInvoices() ci-haut)

        return totalPages

    }catch(error){
        console.error('Database error', error)
        throw new Error('Echec de la récupération du total de la factures')
    }
    
}

export async function fetchCustomers(){
    noStore()
    try{
        const customers = (await sql`
        SELECT id, name 
        FROM customers
        ORDER BY name ASC`) as CustomerField[]

        return customers

    }catch(error){
        console.error('Database Error', error)
        throw new Error('Echec de la recuperation des customers')
    }
}


export async function fetchInvoiceById(id:string) {
    noStore()//await connection() en react 15+

    try{

        const invoiceArray = (await sql`
        SELECT invoices.id, invoices.customer_id, invoices.amount, invoices.status
        From invoices 
        WHERE invoices.id=${id}
       `) as InvoiceForm[] // le resultat retourne un tableau contenant un seul element

        //lors de l'enregistrement, le amount a ete multiplié par 100, donc on le divise par 100
        //ici aussi pour obtenir la valeur reelle.
        const invoice = invoiceArray.map((invoice)=>({...invoice, amount:invoice.amount/100}))[0]
        
        return invoice
        
    }catch(error){
        console.error('Database Error', error)
        throw new Error('Echec de la recuperation de la facture avec identifiant donné')
    }
}



export async function fetchFilteredCustomers(query:string) {
    noStore()

    try {

        const data = (await sql `
        SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC `) as CustomersTableType[]

        const customers = data.map((customer)=>({
            ...customer, 
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid)
        }))

        return customers
        
    } catch (error) {
        console.error('Database error', error)
        throw new Error('Echec de la récupération des customers')
    }
}


