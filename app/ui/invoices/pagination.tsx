'use client'
import { useSearchParams } from "next/navigation"
import { generatePagination } from "@/app/lib/utils"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"


export default function Pagination({totalPages}:{totalPages: number}){
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const currentPage = Number(searchParams.get('page'))  || 1
    //en Nextjs 15+ on ferait la même chose


    //au clique sur une page il faut que l'url change, precisement le param page, par exemple on doit setter
    // le param page à au numero de page sur la quel on a cliquer(page), et ainsi on est de nouveau rediriger
    //vers la route (/dashboard/invoices/?page=new_value&query=...) et le fichier (app/dashboard/invoices/page.tsx)
    //se charge de nouveau de recuperer les params et leur passer au composant dedier pour la recuperation des 
    // données et la pagination à nouveau.
    const createPageUrl = (page:number|string)=>{
        //dashboard/invoices?page=..
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())

        return (`${pathname}?${params.toString()}`)
    }



    const allPages = generatePagination(currentPage, totalPages)
    //console.log(allPages)


    return(
        <>
            <div className="inline-flex">

                {/* au clique du arrow de gauche la page doit etre la page acutelle - 1
                et on desactive l'arrow lors que currentPage est inferieur ou egal à 1
                NB: l'url du href n'est créer au clique du lien, du coup si désactivé ça ne se crée pas et 
                l'url dans ce cas dans le navigateur ne vas pas changer.*/ }
                <PaginationArrow 
                    href = {createPageUrl(currentPage - 1)}
                    direction="left"
                    isDisabled = {currentPage <=1}

                />


                <div className="flex -space-x-px">
                    {
                        allPages.map((page, index)=>{

                            let position : 'first'|'last'|'middle'|'single'|undefined; //declaration sans initialisation, tout en definissnt le type

                            if(index === 0) position = 'first'
                            if(index === allPages.length - 1) position ='last'
                            if(allPages.length === 1) position = 'single'
                            if(page==='...') position = 'middle'

                            return(
                                <PaginationNumber 
                                    key={page}
                                    page={page}
                                    href={createPageUrl(page)}
                                    isActive={currentPage===page}
                                    position={position}
                                />
                            )
                        })
                    }
                </div>

                <PaginationArrow 
                    href = {createPageUrl(currentPage + 1)}
                    direction="right"
                    isDisabled = {currentPage >= totalPages }

                />

            </div>
        </>
    )

}

function PaginationNumber({page, href, isActive, position}: 
    {page:number|string,  href:string, isActive:boolean, position? : 'first'|'last'|'middle'|'single'}){

        const className = clsx('flex h-10 w-10 items-center justify-center text-sm border',
            {
                'rounded-l-md': position==='first' || position==='single',
                'rounded-r-md': position==='last' || position==='single',
                'z-10 bg-blue-600 border-blue-600 text-white': isActive,
                'hover:bg-gray-100': !isActive && position !=='middle',
                'text-gray-300': position ==='middle'
            }
        )

        return isActive || position==='middle'?(
            <div className={`${className}`}>{page}</div>
        ) : (
            <Link 
                href={href}
                className={className}
            >
                {page}
            </Link>
        )
        //pour la page actuelle  et les page du milieux de la pagination(representé par [...]) on retourne 
        //un div sans lien et pour les autre pages on retourne avec lien: c'est justement comme ça une pagination
        //est: on a pas besoin de lien pour la page actuelle ni pour les pages du milieurs(elles sont masqué [...])
        //mais pour les autre pages(de fin et debut) on a besoin de lien, elles doivent etre cliquable.

    }

    function PaginationArrow({href, direction, isDisabled}:
        {href:string, direction : 'left'|'right', isDisabled: boolean}
    ){


        const className = clsx('flex h-10 w-10 items-center justify-center rounded-md border',
            {
                'pointer-events-none text-gray-300': isDisabled,
                'hover:bg-gray-100': !isDisabled,
                'mr-2 md:mr-4': direction === 'left',
                'ml-2 md:ml-4': direction === 'right',
            }
        )


        const icon = direction === 'left'? (
            <ArrowLeftIcon className="w-4" />
        ):(
            <ArrowRightIcon className="w-4" />
        )

        
        return isDisabled ? (
            <div className={className}>{icon}</div>
        ):(
            <Link 
                href={href}
                className={className}
            >
                {icon}
            </Link>
        )
    }