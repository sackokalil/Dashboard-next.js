import  NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'
import Credentials from "next-auth/providers/credentials"
import {z} from 'zod'
import { User } from '@/app/lib/definitions'
import { sql } from '@/app/lib/db'
import bcrypt from 'bcrypt'

async function getUser(email:string):Promise<User|undefined>{

    try{

        const user = (await sql`SELECT * FROM users WHERE email=${email}`) as User[]

        return user[0]// oubien return user[0] as User si on a pas utiliser as User[] à la fin de la requete

    }catch(error){
        console.error("Echec de la recuperation de l'utilisateur ", error)
        throw new Error("Echec de la recuperation de l'utilisateur ")
    }
}



//si quoi que ce soit comme erreur dans se passe ici, l'erreur est recupéré dans notre server action 
//fonction authenticate() lié à notre formulaire de connexion, dans la quel on a appélé la fonction 
//signIn ci-dessous dans un try.
export const {auth, signIn, signOut} = NextAuth({ // toutes ces fonction retourne Promise(donc await à l'appel)
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials){

                //credentials ici n'est pas le formData d'origine, mais plutot déja transformé en objet js
                //Auth.js
                const parsedCredentials = z.object({email: z.string().email(), password: z.string().min(6)})
                .safeParse(credentials);

                if(parsedCredentials.success){
                    const {email, password} = parsedCredentials.data
                    const user = await getUser(email)
                    if(!user) return null

                    const passwordMatch = await bcrypt.compare(password, user.password)
                    if(passwordMatch) return user
                }

                console.log('Identifiant invalides')
                return null
            }
        }), 

     //si on avait d'autre moyen d'authentification(comme google par exemple) on les aurait ajouter ici

    ]
})

//NB: pour le provider Credentials(), la convention c'est :
/**
 * return user
    → authentification réussie : c'est à dire lors que les credentials correspondent

    return null
    → authentification refusée: lors que les infos entrées et celles de la base sont differentes 

    => une fois que l'authentification réussie, Auth.js peut ensuite construire son état de session/token 
    correspondant
 */

//cette fonction authorize() de providers[Credentials({..})] ci-haut est automatiquement appélé
// par Auth.js(le gestionaire de l'authentificaiton en Next-auth) dès que l'on appèle dans notre 
// fonction server (authenticate()) la fonction await signIn('credentials', formData) exporté ci-haut et le param
// formData lui est fourni(qui represente son parm credentials). Sans oublier que formData a la fome : 
//  FormData {email: 'user@gmail.com', password: '123456', ... }. donc vue que formData n'est pas un objet
//javascript ordinaire alors c'est Auth.js qui se charge d'extraire les  valeur et le transformer 
// sous la forme : {email: 'user@gmail.com', password: '123456' } 
// d'ou : credentials={email: 'user@gmail.com', password: '123456' }. Pour provider google, le signIn serait:
// await signIn('google')

//C’est une fonction qu’Auth.js appellera automatiquement au moment d’une tentative de connexion avec 
// le provider Credentials


/**
 *  middleware.ts
    NextAuth(authConfig)
    → version légère
    → utilisée pour contrôler les requêtes


    auth.ts
    NextAuth({...authConfig, Credentials})
    → version complète
    → utilisée pour authentifier/connecter/déconnecter
 * 
 * NextAuth() est encore appélé ici pour recupérer les fonction auth, signIn, signOut qu'on pourra ensuite
 * utiliser dans notre code.
 * on a passé à NextAuth ici avec un objet contenant le contenu de l'objet authConfig(qui est  pages, callbacks, providers)
 * plus un providers[] encore.donc en gros on lui a passé : {pages{}, callbacks{}, providers[], providers[]}, 
 * le {pages{}, callbacks{}, providers[]} = authConfig, sauf qu'on a ajouté encore le providers[]
 * ({pages{}, callbacks{}, providers[], providers[]}) qui va écrasé le premier providers[], 
 * donc ({pages{}, callbacks{}, providers[]}), et cela correspond à NextAuth(authConfig) comme dans le fichier
 * middleware. mais ici on l'a fait de cette façons parce qu'on voulait passé un providers[], parce que 
 * celui ci était vide dans le middleware.ts
 * 
 * Le role des constante exportées : 
 *    export const {
 *       auth,
 *      signIn,
 *     signOut
 *    } = NextAuth(...)
 * 
 * signIn: => connecter
 * signOut: => deconnecter
 * 
 * auth : => lire/vérifier la session actuelle. => Par exemple, dans un Server Component, on pourrai faire :
 * 
 * import { auth } from '@/auth'

    export default async function Page() {
    const session = await auth()

    console.log(session)

    return ...
    }


    SCENARIO COMPLET : 

                 UTILISATEUR
                 │
                 │ GET /dashboard
                 ▼
           middleware.ts
                 │
                 ▼
         NextAuth(authConfig).auth
                 │
                 ▼
            authorized()
                 │
          ┌──────┴──────┐
       connecté       non connecté
          │                │
          ▼                ▼
      dashboard          /login
                             │
                             │ formulaire
                             ▼
                         Server Action
                             │
                             ▼
                          signIn()
                             │
                             ▼
                           auth.ts=>provider Credentials()=>authorize()
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
           getUser()                  bcrypt.compare()
              │                             │
              └──────────────┬──────────────┘
                             ▼
                       utilisateur validé
                             │
                             ▼
                      session Auth.js



                      authorize()

 * 
*/