import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("La variable DATABASE_URL est manquante");
}

export const sql = neon(process.env.DATABASE_URL);//celle ci va lire les variable d'environnement
//dans le fichier .env(ou se trouve l'acces à la base de données) et établir une connexion vers la base