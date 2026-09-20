import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";


export default NextAuth(authConfig).auth;

export const config={
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$).*)'],
}



//NB : en nextjs 16 le fichier middleware.ts(ici proxy.ts, après le upgrade, ce fichier est devenu proxy.ts) a été renommé en proxy.ts, c'est tout ce qui change,
//le code reste le meme 

/**
 * Le fichier middleware.ts est un fichier special nextjs, nextjs detecte automatiquement que le middleware est auth
 * parce qu'il est exporté par defaut(c'est la même logique qu'un fichier page.tsx)
 * on export le auth, et Auth.js le prend comme middleware, ça veut dire : 
   La fonction middleware de ce fichier sera la fonction auth générée par Auth.js avec ma configuration.
   authConfig
   donc à chaque requette nextjs regarde si l'url fait parti des url defini dans le matcher
   (c'est une convention si nextjs voit seuelement export const config = {}, il sait automatiquement que
   c'est la configuration du middleware, il regarde donc le matcher de cet objet 
   et sait automatiquement qu'il s'agit des regle defini pour les url qui doivent ou ne doivent pas passer
   par le middleware), si oui il appelle
   automatiquement le middleware, qui a déja accès au pages, callbacks et providers defini dans la authConfig

   LE ROLE DE middleware : 
   intercepter certaines requêtes et vérifier l'état d'authentification.

   middleware.ts
    NextAuth(authConfig)
    → version légère
    → utilisée pour contrôler les requêtes


    auth.ts
    NextAuth({...authConfig, Credentials})
    → version complète
    → utilisée pour authentifier/connecter/déconnecter

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
                           auth.ts
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
*/


//  .*\\.png$ = n'importe quelle suite de character(.*)  + un point(\\.) + png comme fin de la chaine(png$)


/**
     * auth.config.ts
    ────────────────────────────────
    "Quelles sont mes règles ?"

    Exemple :
    - /dashboard nécessite une connexion
    - /login + déjà connecté → dashboard
    - page de connexion = /login


    middleware.ts
    ────────────────────────────────
    "Sur quelles requêtes dois-je
    appliquer ces règles ?"

    Exemple :
    - /dashboard → oui
    - /login → oui
    - /about → oui
    - /_next/static → non
    - images PNG → non
 */