/*
Componente visual que no es una pagina completa
*/

"use client"; // Le dice a Next.js que este componente usa interactividad en el navegador

import { useState } from "react"; // para que el componente recuerde cosas mientras el usuario interactúa, sin recargar la página.
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); // permite mover al usuario de una pantalla a otra de manera automática
  
  // Variables de estado para guardar lo que el usuario escribe
  const [name, setName] = useState(""); // caja de memoria
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función que se ejecuta al darle clic al boton
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    setError("");

    try {
      // Enviamos los datos a nuestra Ruta API
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // Si todo sale bien, lo mandamos a la página de Login
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h1>
        
        {/* Si hay un error, lo mostramos aquí */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre/s</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

