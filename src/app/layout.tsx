/*
Este archivo se conoce como el Root Layout (diseño raíz) y es obligatorio. 
Lo que pongas aquí se verá en todas las páginas.
*/
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Navbar from "@/components/bars/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Gestiona tus aplicaciones laborales",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Leemos la sesión una sola vez aquí arriba
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Pasamos la sesión al componente Navbar */}
        <Navbar session={session} />
        <main>{children}</main>
      </body>
    </html>
  );
}
// Encender servidor: npm run dev