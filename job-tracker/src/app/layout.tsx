/*
Este archivo se conoce como el Root Layout (diseño raíz) y es obligatorio. 
Lo que pongas aquí se verá en todas las páginas.
*/

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

import Link from "next/link"; // Importamos el componente de navegación

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Gestiona tus aplicaciones laborales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* BARRA DE NAVEGACIÓN GLOBAL */}
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-6">
            <li><Link href="/" className="hover:text-gray-300">Inicio</Link></li>
            <li><Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
            <li><Link href="/jobs" className="hover:text-gray-300">Vacantes</Link></li>
            <li><Link href="/login" className="hover:text-gray-300">Login</Link></li>
            <li><Link href="/register" className="hover:text-gray-300">Registro</Link></li>
          </ul>
        </nav>

        {/* AQUÍ SE RENDERIZA LA PÁGINA ACTUAL (page.tsx) */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

// Encender servidor: npm run dev