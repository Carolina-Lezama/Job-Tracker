/*
Debo usar "use client" cada vez que el usuario introduce información, para enviar algun componente al navegador y este vivo
No es necesario (ni recomendable) que conviertas toda la página en un Client Component.
*/

// Ya no necesitamos 'use client' aquí. Esto ahora es un Server Component puro.
import RegisterForm from "@/components/auth/RegisterForm"; // @ es un atajo automático que apunta a la carpeta src/

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* 
        El contenedor visual y el layout se procesan en el servidor.
        Solo el componente <RegisterForm /> maneja la interactividad del cliente.
      */}
      <RegisterForm />
    </div>
  );
}

// iniciar el servicio: net start postgresql-x64-18
// consultar la conexion con la db: npx prisma studio
// correr servidor: npm run dev