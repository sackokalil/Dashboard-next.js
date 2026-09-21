# Next.js Dashboard

A full-stack dashboard application built by following the official **Next.js Learn** course.

This project was created as a hands-on learning project to explore and practice modern Next.js concepts, including Server Components, Server Actions, data fetching, form validation, authentication, search, pagination, and database operations.

The application provides a dashboard for managing customers and invoices while demonstrating how Next.js can be used to build a modern full-stack web application.

## 🎯 Project Purpose

This project is based on the official Next.js Dashboard tutorial and was completed as part of my Next.js learning journey.

The main goal was to understand and practice the architecture and features provided by Next.js in a real-world application.

## 🧠 Concepts Practiced

This project was built as a practical way to explore important concepts in Next.js and React, including:

### Next.js

- App Router
- Server Components
- Client Components
- Server Actions
- SQL database queries
- Dynamic Rendering
- Route navigation
- Data fetching
- Forms and validation with Zod
- TypeScript
- Authentication
- Cache and revalidation
- `revalidatePath()`
- `connection()`
- Loading UI
- Error handling
- Search parameters
- Dynamic route segments
- Pagination

### React

- `useActionState`
- `useFormStatus`
- Component state
- Event handling
- Forms
- Conditional rendering
- ...

### Forms & Validation

Forms are handled using **Server Actions** and validated with **Zod**.

The project explores concepts such as:

- `FormData`
- `formData.get()`
- `Object.fromEntries()`
- Zod schemas
- `parse()`
- `safeParse()`
- Form validation errors
- Pending form states

### Database

The application uses a SQL database to store and retrieve:

- Customers
- Invoices
- Revenue data

The project also practices:

- SQL queries
- Server-side database access
- Creating records
- Updating records
- Deleting records
- Fetching individual records
- Filtering and searching data

## 🛠️ Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **SQL**
- **Zod**
- **Tailwind CSS**

## 📂 Project Structure

The project follows the Next.js App Router architecture.

```text
app/
├── dashboard/
│   ├── customers/
│   ├── invoices/
│   └── page.tsx
├── lib/
│   ├── actions.ts
│   ├── data.ts
│   └── definitions.ts
├── ui/
└── page.tsx
...
```

- `dashboard/` contains the main dashboard pages.
- `lib/data.ts` contains database queries and data-fetching logic.
- `lib/actions.ts` contains Server Actions used for mutations.
- `lib/definitions.ts` contains TypeScript type definitions.
- `ui/` contains reusable UI components.

## ⚡ Server Actions

One of the main concepts explored in this project is **Server Actions**.

They are used to perform server-side mutations directly from forms, such as:

```tsx
<form action={createInvoice}>
  ...
</form>
```

Server Actions handle operations such as:

- Creating invoices
- Updating invoices
- Deleting invoices
- Validating form data
- Revalidating pages after database changes

After a mutation, the affected pages can be refreshed using:

```tsx
revalidatePath('/dashboard/invoices');
```

## 🔎 Search & Pagination

The invoice section supports searching and pagination.

Search values are passed through URL search parameters, allowing the server to retrieve only the relevant database records.

Example:

```text
/dashboard/invoices?query=customer&page=2
```

This project therefore demonstrates how URL state, Server Components, and database queries can work together.

## ▶️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

## 📚 What I Learned

Through this project, I practiced how to build a full-stack application with Next.js instead of treating Next.js only as a frontend framework.

In particular, I learned how to:

- Separate Server and Client Components
- Fetch data directly from the server
- Perform database mutations with Server Actions
- Validate user input with Zod
- Manage form states with React hooks
- Implement search and pagination
- Revalidate data after mutations
- Handle loading and error states
- Structure a larger Next.js application

## 🎯 Purpose

This project was created for **learning and practicing Next.js**.

It is part of my journey toward understanding modern full-stack development with React, Next.js, TypeScript, and databases.

## 📖 Resources

- Next.js Documentation
- React Documentation
- Zod Documentation

## 🌐 Live Demo

The application is deployed on Vercel and can be accessed here:

👉 [View the Acme Dashboard](https://dashboard-next-kw8w6rf12-sacko-dev.vercel.app/)

### 🔐 Demo Credentials

Use the following credentials to explore the dashboard:

- **Email:** `user@gmail.com`
- **Password:** `123456`

> **Note:** These credentials are provided for demonstration purposes only and can be used to access and explore the deployed project.
