/*
Este archivo se conoce como el Root Layout (diseño raíz) y es obligatorio. 
Lo que pongas aquí se verá en todas las páginas.
*/
'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";

import Link from "next/link"; // Importamos el componente de navegación

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* BARRA DE NAVEGACIÓN RESPONSIVA */}
        <nav className="bg-gray-800 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            {/* Logo o Título (Siempre visible) */}
            <div className="font-bold text-xl">
              <Link href="/">JobTracker</Link>
            </div>

            {/* BOTÓN DE MENÚ MÓVIL (Solo visible en pantallas pequeñas) */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* ENLACES DE ESCRITORIO (Ocultos en móviles, visibles en 'md' hacia arriba) */}
            <ul className="hidden md:flex space-x-6">
              <li><Link href="/" className="hover:text-gray-300 transition">Inicio</Link></li>
              <li><Link href="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link></li>
              <li><Link href="/jobs" className="hover:text-gray-300 transition">Vacantes</Link></li>
              <li><Link href="/login" className="hover:text-gray-300 transition">Login</Link></li>
              <li><Link href="/register" className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition">Registro</Link></li>
              <li><Link href="/jobs/new" className="hover:text-gray-300 text-yellow-400 font-semibold">+ Agregar Vacante</Link></li>
            </ul>
          </div>

          {/* MENÚ DESPLEGABLE MÓVIL */}
          {menuAbierto && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Link href="/" className="block px-4 py-2 hover:bg-gray-700 rounded transition" onClick={() => setMenuAbierto(false)}>Inicio</Link>
              <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded transition" onClick={() => setMenuAbierto(false)}>Dashboard</Link>
              <Link href="/jobs" className="block px-4 py-2 hover:bg-gray-700 rounded transition" onClick={() => setMenuAbierto(false)}>Vacantes</Link>
              <Link href="/login" className="block px-4 py-2 hover:bg-gray-700 rounded transition" onClick={() => setMenuAbierto(false)}>Login</Link>
              <Link href="/register" className="block px-4 py-2 bg-blue-600 rounded text-center transition" onClick={() => setMenuAbierto(false)}>Registro</Link>
            </div>
          )}
        </nav>

        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
// Encender servidor: npm run dev