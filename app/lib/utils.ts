import { Revenue } from "./definitions"

export const formatCurrency = (amount:number)=>{
    return (amount / 100).toLocaleString('en-US', {
        style : 'currency',
        currency: 'USD'
    })
}

export const generateYAxis = (revenue: Revenue[])=>{
    const highestRecord = Math.max(...revenue.map((month)=> month.revenue))
    const topLabel = Math.ceil(highestRecord/1000)*1000

    return topLabel
}

export const formatDateToLocale = (dateStr: string, locale: string='fr-FR')=>{

    const options : Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month : 'short',
        year : 'numeric'
    }
    const date = new Date(dateStr)
    const formater = new Intl.DateTimeFormat(locale, options)
    return formater.format(date)
}


export const generatePagination = (currentPage:number, totalPages:number )=>{
    if(totalPages <=7){
        return Array.from({length: totalPages}, (_,i)=>i + 1)
        //crée un tableau de totalPages element et pour chaque element la valeur est son index + 1
        //du coup on obtient : [1, 2, 3, 4, 5, 6, 7] si totalPages = 7 par exemple
        /**
         * let myArray:Array = []
         * for(let i=1; i<=totalPages; i++){
         * myArray.push(i)
         * }
         * return myArray
         */

    }
    //[1][2][3][...][5][6]
    if(currentPage <= 3){
        return [1, 2, 3, '...', totalPages-1, totalPages]
    }

    //[1][2][...][4][5][6]
    if(currentPage >= totalPages-2){
        return [1, 2, '...', totalPages-2,  totalPages-1, totalPages]
    }

    //[1][...][voisine - 1][page actuelle][voisine + 1][...][6]
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages

    ]

    /**ZUSAMMENFASSUNG: 
     * Y a-t-il 7 pages ou moins ?
        → Afficher toutes les pages.

        Sommes-nous près du début ?
        → Afficher 1, 2, 3, ..., les deux dernières.

        Sommes-nous près de la fin ?
        → Afficher 1, 2, ..., les trois dernières.

        Sinon, sommes-nous au milieu ?
        → Afficher première, ..., précédente, actuelle, suivante, ..., dernière.
     */
}