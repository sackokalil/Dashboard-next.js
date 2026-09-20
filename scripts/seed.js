
//import {db} from '@vercel/postgres'
import {sql} from '../app/lib/db.js'


import {
    users,
    customers,
    invoices,
    revenue} from '../app/lib/placeholder-data.js'

import bcrypt from 'bcrypt'



//SEED INVOICE TABLE
async function seedInvoices(){
    try{

        await sql `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
        const createTable = await sql `
        CREATE TABLE IF NOT EXISTS invoices(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
        );
        `;

        console.log('Created "invoices" table ')

        //insertion dans la table invoices
        const insertedInvoices = await Promise.all(
            invoices.map(async(invoice)=>{
                return(
                    sql `INSERT INTO invoices(customer_id, amount, status, date)
                    VALUES(${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
                    ON CONFLICT (id) DO NOTHING;`
                )
            })
        )

        console.log(`Seed ${insertedInvoices.length} invoices`)

        return {
            createTable,
            invoices : insertedInvoices
        }

    }catch(error){
        console.log('Error seeding invoices : ', error)
        throw error
    }
}




//SEED CUSTOMERS TABLE
async function seedCustomers(){
    try{

        await sql `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
            const createTable = await sql `CREATE TABLE IF NOT EXISTS customers(
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email TEXT NOT NULL UNIQUE,
            image_url TEXT NOT NULL
            );
            `;

        console.log("Create customers table")

        //inserting into the table
        const insertedCustomers = await Promise.all(
            customers.map(
                (customer) => sql `INSERT INTO customers (id, name, email, image_url)
                VALUES(${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
                ON CONFLICT (id) DO NOTHING;`
            )
        )

        console.log(`Seeded ${insertedCustomers.length} customers`)

        return {
            createTable,
            customers: insertedCustomers
        }

    }catch(error){
        console.log('Error seeding cuctomers: ', error)
        throw error
    }
}




//SEED USER TABLE
async function seedUsers(){
    try{
        await sql `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
        const createTable = await sql `
        CREATE TABLE IF NOT EXISTS users(
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(2255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
        );`

        console.log('Created "users" table')

        //inserting into table
        const insertedUsers = await Promise.all(
            users.map(async(user)=>{
                const hsahedPassword = await bcrypt.hash(user.password, 10)
                return(
                    sql `
                    INSERT INTO users (id, name, email, password) 
                    VALUES(${user.id}, ${user.name}, ${user.email}, ${hsahedPassword})
                    ON CONFLICT (id) DO NOTHING;
                    `
                )
            })
        )

        console.log(`Seeded ${insertedUsers.length} users`)

        return {
            createTable,
            users: insertedUsers
        }

    }catch(error){
        console.error('Error seeding users : ', error)
        throw error;
    }

}


async function seedRevenue(){
    try{

        const createTable = await sql `
        CREATE TABLE IF NOT EXISTS revenue(
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
        );`

        console.log('Created "revenue" table')

        //inserting into the table
        const insertedRevenue = await Promise.all(
            revenue.map(
                (rev)=> sql `INSERT INTO revenue (month, revenue)
                VALUES(${rev.month}, ${rev.revenue})
                ON CONFLICT (month) DO NOTHING;`
            )
        )

        console.log(`Seeded ${insertedRevenue.length} revenue`)

        return {
            createTable,
            revenue: insertedRevenue
        }

    }catch(error){
        console.log('Error seeding revenue : ', error)
        throw error
    }
}





//THE MAIN FUNCITON
async function main(){
    await seedUsers()
    await seedCustomers()
    await seedInvoices()
    await seedRevenue()

}
main().catch((error)=>{
    console.error(
        "Une erreur s'est produite",
        error
    )
})