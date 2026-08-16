import clsx from "clsx"


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    children:React.ReactNode;
}

export  function Button({children, className, ...res} : ButtonProps){
    return(
        <button
            {...res}
            className={clsx('flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
                className
            )}
        >
            {children}
        </button>
    )
}





/**
 * COMPOSANT BUTTON RÉUTILISABLE :
 *
 * ButtonProps définit les propriétés (props) acceptées par notre Button.
 *
 * extends React.ButtonHTMLAttributes<HTMLButtonElement>
 * → récupère toutes les props d'un bouton HTML classique :
 *   onClick, disabled, type, className, id, etc.
 *
 * children: React.ReactNode
 * → représente le contenu placé entre <Button>...</Button>.
 *
 * Dans :
 * { children, className, ...res }
 *
 * → children  : contenu du bouton
 * → className : classes CSS ajoutées lors de l'utilisation du Button
 * → ...res    : récupère toutes les autres props (type, onClick, disabled...)
 *
 * {...res} transmet ensuite ces props au vrai <button>.
 *
 * clsx(classesParDefaut, className)
 * → combine les classes Tailwind par défaut du composant avec
 *   les classes supplémentaires fournies lors de son utilisation.
 *
 * Exemple :
 *
 * <Button type="submit" className="mt-4 w-full">
 *     Se connecter
 * </Button>
 *
 * → children  = "Se connecter"
 * → className = "mt-4 w-full"
 * → res       = { type: "submit" }
 *
 * En résumé : notre <Button> est une enveloppe réutilisable autour
 * du <button> HTML avec style + typage déjà préparés.
 */