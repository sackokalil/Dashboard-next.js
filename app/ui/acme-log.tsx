import {GlobeAltIcon} from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'

//console.log(lusitana)

export default function AcmeLogo(){
    return(
        <div className='flex flex-row items-center loading-none text-white'>
            <GlobeAltIcon className={`${lusitana.className} h-12 w-12 rotate-[15deg]`} />
            <p className={`${lusitana.className} text-[44px]`} >Acme</p>
        </div>
    )
}

/**
 * pour pouvoir utiliser GlobeAltIcon, il faudrait d'abord installer heroicons
 * npm install @heroicons/react
 */