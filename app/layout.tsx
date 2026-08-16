import type { Metadata } from "next";
import {inter} from '@/app/ui/fonts'
import "./globals.css";

//console.log(inter)

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Exercice app Next.js Dashboard avec App Router",
};

export default function RootLayout({children,}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${inter.className}`}>{children}</body>
    </html>
  );
}
