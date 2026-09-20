'use client'

import {CheckIcon,ClockIcon, CurrencyDollarIcon, UserCircleIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import { CustomerField } from '@/app/lib/definitions'
import { createInvoice } from '@/app/lib/actions'
import { useActionState } from 'react';
import { State } from '@/app/lib/actions'

function Form({customers}:{customers:CustomerField[]}) {


    const initialState : State = {
        message : null,
        errors : {}
    }
    //en next 15+ / const [state, dispatch, isPending] = useActionState(createInvoice, initialState)
    const [state, dispatch] = useActionState(createInvoice, initialState)
    //const [state, dispatch] = useFormState(createInvoice.bind(null, id), initialState); si l'on voulait fournir d'autre param au server action function 

    return (
     <form action={dispatch}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">

            {/* Nom du client */}
            <div className="mb-4">
                <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                    Select a customer
                </label>
                <div className="relative">
                    <select
                        id="customer"
                        name="customerId"
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        defaultValue=""
                        aria-describedby='customer-error'
                    >
                        <option value="" disabled>
                            Choose a customer
                        </option>
                        {/* MAP CUSTOMERS */}
                        {
                            customers.map((customer: CustomerField )=>(
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))
                        }
                    </select>
                    <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                </div>

                {/** Affichage de l'erreur lié au customer*/}
                <div id ="customer-error" aria-live='polite' aria-atomic='true'>
                    {state.errors?.customerId && state.errors.customerId.map((err)=>(
                        <p key={err} className='mt-2 text-sm text-red-500'>
                            {err}
                        </p>
                    ))}
                </div>

            </div>


            {/* Montant de la facture */}
            <div className="mb-4">
                <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                    Choose an amount
                </label>
                <div className="relative mt-2 rounded-md">    
                    <div className="relative">
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            step="0.01"
                            placeholder="Give an amout in USD"
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            aria-describedby='amount-error'
                            
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                    </div>
                </div>

                {/**Affichage de l'erreur lié au montant */}
                <div id ="amount-error" aria-live='polite' aria-atomic='true'>
                    {state.errors?.amount && state.errors.amount.map((err)=>(
                        <p key={err} className='mt-2 text-sm text-red-500'>
                            {err}
                        </p>
                    ))}
                </div>

            </div>


            {/* Statut de la facture */}
            <fieldset>
                <legend className="mb-2 block text-sm font-medium">
                    Set the status of the invoice
                </legend>
                <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                    <div className="flex gap-4">
                        <div className="flex items-center">
                            <input
                                id="pending"
                                name="status"
                                type="radio"
                                value="pending"
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                aria-describedby='status-error'
                            />
                            <label
                                htmlFor="pending"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                            >
                                Pending <ClockIcon className="h-4 w-4" />
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="paid"
                                name="status"
                                type="radio"
                                value="paid"
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                aria-describedby='status-error'
                            />
                            <label
                                htmlFor="paid"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                            >
                                Paid <CheckIcon className="h-4 w-4" />
                            </label>
                        </div>
                    </div>
                </div>

                {/**Affichage de l'erreur lié au status de la facture */}
                <div id ="status-error" aria-live='polite' aria-atomic='true'>
                    {state.errors?.status && state.errors.status.map((err)=>(
                        <p key={err} className='mt-2 text-sm text-red-500'>
                            {err}
                        </p>
                    ))}
                </div>

            </fieldset>

            {/**Affichage du message lors que la création de la facture echoue */}
            <div aria-live='polite' aria-atomic='true'>
                {state.message && (
                    <p  className='mt-2 text-sm text-red-500'>{state.message}</p>
                )}
            </div>
        </div>


        <div className="mt-6 flex justify-end gap-4">
            <Link
                href="/dashboard/invoices"
                className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
                Cancel
            </Link>
            <Button type="submit">Create an invoice</Button>
        </div>
    </form>
  )
}

export default Form
