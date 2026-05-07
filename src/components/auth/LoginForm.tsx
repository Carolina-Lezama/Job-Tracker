"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Usamos la función nativa de Auth.js para iniciar sesión
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Evita que recargue la página automáticamente si hay error
    });

    if (res?.error) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      router.push("/dashboard");
      router.refresh(); 
    }
  };

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido de nuevo
          </h2>
          <p className="text-sm text-gray-500">
            Ingresa tus credenciales para acceder a tu Job Tracker
          </p>
        </div>

        {/* EL FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* CAMPO DE EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* CAMPO DE CONTRASEÑA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* BOTÓN DE INICIO DE SESIÓN */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md mt-2"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* ENLACE DE REGISTRO */}
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>

      </div>
    </div>
  );
}