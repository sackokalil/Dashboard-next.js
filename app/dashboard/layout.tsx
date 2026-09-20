import SideNav from "@/app/ui/dashboard/sidenav"
import IdleLogout from "@/app/dashboard/IdleLogout"

export default function DashboardLayout(
    {children}: {children: React.ReactNode}
){
    return(
        <>
            <IdleLogout /> {/*deconnecter le user après un certain temps d'inactivité */}

            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-64 ">
                    <SideNav/>
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
        </>
    )

}





/**
 * LAYOUTS IMBRIQUÉS - APP ROUTER :
 *
 * - Un layout s'applique à toutes les routes situées en dessous de lui.
 * - Si une route enfant possède son propre layout, celui-ci ne remplace
 *   pas le layout parent : il s'imbrique à l'intérieur.
 *
 * Exemple pour /dashboard/settings/profile :
 *
 * RootLayout
 *   └── DashboardLayout
 *        └── SettingsLayout
 *             └── ProfilePage
 *
 * Conceptuellement :
 * <DashboardLayout>
 *   <SettingsLayout>
 *     <ProfilePage />
 *   </SettingsLayout>
 * </DashboardLayout>
 *
 * Chaque niveau est injecté dans le {children} de son layout parent.
 */