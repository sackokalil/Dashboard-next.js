'use server'

import {z} from 'zod'
import { sql } from '@/app/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'





/**==========================================DATA VALIDATION============================== */

//definition du type de prevState : 
export type State = {
    errors?:{
        customerId?:string[],
        amount?:string[],
        status?: string[]
    },
    message?:string | null
}

//definir le schema des données
//NB: dans la version v4 de zod, toutes les API(comme: invalid_type_error, message, required_error )
//sont unifié avec le parametre 'error', c'est a dire que toutes les fonctions et méthodes de schéma 
// acceptent maintenant un paramètre error, soit sous forme de chaîne, soit sous forme de fonction.
// exemple : customerId: z.string({error:'The field customerId should be a string'})
//amount: z.coerce.number().gt(0, {error:'Please give an amount greater than $0.'})
const formSchema = z.object({
    id: z.string(),
    customerId: z.string({invalid_type_error:'Please select a customer'}),
    amount: z.coerce.number().gt(0, {message:'Please give an amount greater than $0.'}), //convertir en number
    status: z.enum(['pending','paid'], {
        invalid_type_error : 'Please select the invoice status'
    }),
    date: z.string()

})
//CreateInvoice est le second et final schema, sans les element id et date
const CreateInvoice = formSchema.omit({id:true, date:true})
const UpdateInvoice = formSchema.omit({id:true, date:true})








/**==========================================CREATE FUNCTION ======================================== */

export async function createInvoice(prevState:State, formData : FormData){

    //const rawFormData = Object.fromEntries(formData.entries())

    //NB: avec parse les clés attendues par le schéma doivent correspondre aux clés de l’objet qu'on 
    // envoit au schema pour valider(parser)

    // const {customerId, amount, status} = CreateInvoice.parse({
    //     customerId: formData.get('customerId'),
    //     amount : formData.get('amount'),
    //     status: formData.get('status')
    // })



    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount : formData.get('amount'),
        status: formData.get('status')
    })

    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,//en zod v4: errors: z.flattenError(validatedFields.error).fieldErrors 
            message: 'Lacking fields. Failed to create invoice'
        }
    }

    const {customerId, amount, status} = validatedFields.data

    const amountInCents = amount * 100
    const date = new Date().toISOString().split('T')[0]

    try {
        //Enregistrer la facture en base de données
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date) 
        VALUES(${customerId}, ${amountInCents},${status}, ${date})`
        
    } catch (error) {
        return {message : 'Erreur base de données: échec lors de la création de la facture'}
    }

    //Revalider le path(vider le cache de route coté client et le mettre à jour)
    revalidatePath('/dashboard/invoices/')

    //Redirection vers /dashboard/invoices/ après l'enregistrement
    redirect('/dashboard/invoices/')

    
}








/**==========================================UPDATE FUNCTION=================================================== */

export async function updateInvoice(id: string, prevState:State, formData: FormData){

    const validatedFields = UpdateInvoice.safeParse({
        customerId : formData.get('customerId'),
        amount : formData.get('amount'),
        status: formData.get('status')
    })

    if(!validatedFields.success){
        return {
            message : 'Lacking fields! failed to update the invoice',
            errors : validatedFields.error.flatten().fieldErrors
        }
    }

    const {customerId, amount, status} = validatedFields.data

    const amountInCents = amount * 100
   
    try {
        //Modifier la facture en base de données avec un ID specifique
        await sql`
        UPDATE invoices 
        SET 
            customer_id=${customerId},
            amount=${amountInCents},
            status=${status}
        WHERE id=${id}`

    } catch (error) {
        return {message : 'Erreur base de données: échec lors de la mise à jour de la facture'}
    }
        
    //revalidation du path
    revalidatePath('/dashboard/invoices')

    //Redirection
    redirect('/dashboard/invoices')

}





/**==========================================DELETE FUNCTION============================================= */

export async function deleteInvoice(id:string) {

    //throw new Error("Echec de la suppression de la facture")
    
    try {
        await sql`
        DELETE FROM invoices
        WHERE id=${id}
        `
        //revalidation du path
        revalidatePath('/dashboard/invoices')

    } catch (error) {
        return {message : 'Erreur base de données: échec lors de la suppression de la facture'}
    }
    

}





/**=============================================AUTHENTICATION============================================= */

export async function authenticate(prevState:string|undefined, formData:FormData) {
    // console.log(formData)
    try {

        await signIn('credentials', formData)
        


    } catch (error) {
        if(error instanceof AuthError){

            switch(error.type){
                case 'CredentialsSignin':
                    return 'Identifiant invalides.';
                default:
                    return "Quelque chose s'est mal passé";
            }
        }
        throw error;
    }
}






/**==========================================DECONNECTION=============================================== */

export async function logout() {
  await signOut({
    redirectTo: '/login'
  })
}









//const schema = z.object({....}) permet de regrouper plusieur element de definir leur schema 
// ensemble 
//sans z.object({...}), on peut definir un schema pour chaque element
// const idSchema = z.string()
// const customerIdSchema = z.string()
// const amountSchema = z.coerce.number()
// const statusSchema = z.enum(['pending', 'paid'])
// const dateSchema = z.string()

// const id = idSchema.parse(formData.get('id'))
// const customerId = customerIdSchema.parse(formData.get('customerId'))
// const amount = amountSchema.parse(formData.get('amount'))
// const status = statusSchema.parse(formData.get('status'))
// const date = dateSchema.parse(formData.get('date'))