'use client'


import {lusitana} from '@/app/ui/fonts'
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon} from '@heroicons/react/24/outline'
import {ArrowRightIcon} from '@heroicons/react/20/solid'
import {Button} from './button'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '../lib/actions'
import { useSearchParams } from 'next/navigation'


export default function LoginForm(){

    //si le use veut se rendre dans /dashboard/invoices par exemple et qu'il n'est pas connecter
    //le middleware le redirige vers le login(/login?callbackUrl=/dashboard/invoices), donc le callbackUrl represente l'url sur le quel
    //il doit se rendre après la connection, parce que c'est cet url qu'il avait demandé, sauf que
    //l'authentification est requi d'avance.
    //on envoit ce callback dans le formData à travers un champs hidden donc avec la valeur
    // NB: les fonctions signOut() et signIn() d’Auth.js ont défini une option appelée redirectTo.
    // ce qui fait que qu'on crée un champs hidden avec name 'redirectTo' qui sera envoyer dans
    //formData au fonction signIn(), et pour la fonction signOut({redirectTo:'/redirect_url'}), on 
    // peut le definir directement un objet contenant cette option.
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return(
        <form className="space-y-3" action={dispatch}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                Connexion
                </h1>
                <div className="w-full">
                    <div>
                        <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="email"
                        >
                        Email
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Entrez votre adresse e-mail"
                            required
                        />
                        <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="password"
                        >
                        Mot de passe
                        </label>
                        <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Entrez votre mot de passe"
                            required
                            minLength={6}
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                <input type="hidden" name="redirectTo" value={callbackUrl} />

                <LoginButton />

                {/**Affichage d'erreur lié à la connection */}
                <div 
                    className='flex h-8 items-end space-x-1 '
                    aria-live='polite'
                    aria-atomic='true'
                >
                    {
                        errorMessage && (
                            <>
                                <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
                                <p className='text-sm text-red-500'>{errorMessage}</p>
                            </>
                        )
                    }
                </div>
                
            </div>
        </form>
    )
}



function LoginButton(){
    const {pending} = useFormStatus();
    return (
        <Button className='mt-4 w-full' aria-disabled = {pending} >
           Se connecter <ArrowRightIcon className='ml-auto h-5 w-5 text-gray-50' />
        </Button>
    )
}