"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

// Recibimos la sesión como una propiedad (prop) desde el servidor
export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h2 className="font-bold text-xl tracking-tight hover:text-gray-200">
          Job Tracker 
        </h2>
        <ul className="flex space-x-6 items-center">
          {/* Si el usuario HA INICIADO SESIÓN, mostramos herramientas de gestión */}
          {session ? (
            <>
              <li><Link href="/dashboard" className="hover:text-gray-300 transition">Dashboard</Link></li>
              <li><Link href="/jobs" className="hover:text-gray-300 transition">Vacantes</Link></li>
              <li>
                <Link href="/jobs/new" className="text-yellow-400 font-semibold hover:text-yellow-300 transition">
                  + Agregar Vacante
                </Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })} // Destruye sesión y manda a Inicio
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            /* Si el usuario NO HA INICIADO SESIÓN, solo mostramos opciones de acceso */
            <>
               <li><Link href="/" className="hover:text-gray-300 transition">Página de bienvenida</Link></li>
              <li><Link href="/login" className="hover:text-gray-300 transition">Login</Link></li>
              <li><Link href="/register" className="hover:text-gray-300 transition">Registro</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}