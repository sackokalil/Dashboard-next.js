import type {NextAuthConfig} from 'next-auth'

/**
    * auth.config.ts
    → définit les règles

    middleware.ts
    → décide sur quelles requêtes ces règles vont être appliquées
*/

export const authConfig = {

    pages:{
        signIn: '/login',
        
    },

    callbacks : {

        //authorized() est appelé pour les requêtes qui passent par le middleware(defini dans middleware.ts=>matcher)
        authorized({auth, request:{nextUrl}}){ //nextUrl est l'url demandé:on a fait de la destructuration profonde ici
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnLogin = nextUrl.pathname === '/login';

            if(isOnDashboard){
                if(isLoggedIn) return true; // true = autoriser l'acces à l'url demandé(url commançant par '/dashboard/...')
                return false; // false = refuser l'acces, et le rediriger vers login(cette redirection 
                            // est implicitement fait par NextAuth une fois que false est retourné)
            }

            //s'il demande la page login alors qu'il est connecté, on l'envoit vers dashboard
            if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl)); //new URL(url, base)
            }
            

            return true;// s'il n'a pas demandé une url commançant par '/dashboard/..' ni url 
                        // de login('/login) , alors pour toute autre demande on le laisse tout
                        //simplement acceder à la page(url) qu'il a demandé(ce sont donc les route publique)

            /**QUICK SUMMARY : 
             *  dashboard + non connecté → login
                dashboard + connecté     → autorisé

                login + connecté         → /dashboard
                login + non connecté     → autorisé

                blablabla + connecté     → autorisé à continuer
                                            ↓
                                        Next.js peut afficher 404
             */
        },
        
    },

    providers: []

} satisfies NextAuthConfig;

