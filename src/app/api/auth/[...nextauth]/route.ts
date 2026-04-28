/*
archivo especial que interceptará cualquier intento de inicio de sesión.
[...nextauth] atrapará cualquier ruta de autenticación
*/ 

import NextAuth from "next-auth"; // maneja las sesiones, las cookies y la seguridad.
import CredentialsProvider from "next-auth/providers/credentials"; // permite iniciar sesión con Google, GitHub, etc.
import { PrismaClient } from "@prisma/client"; // permite que tu código de JavaScript/TypeScript hable con tu base de datos PostgreSQL.
import bcrypt from "bcryptjs"; // para encriptar contraseñas y compararlas

const prisma = new PrismaClient(); //puente de comunicación

const handler = NextAuth({ // inicializamos la configuración
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { // campos a esperar
        email: { label: "Email", type: "text", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) { // Es la función que se ejecuta cuando el usuario le da clic al boton
        // 1. Verificamos que el usuario haya enviado datos
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan datos");
        }

        // 2. Buscamos al usuario en nuestra base de datos PostgreSQL
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // 3. Comparamos la contraseña enviada con la contraseña encriptada de la BD
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          throw new Error("Contraseña incorrecta");
        }

        // 4. Si todo está bien, le devolvemos los datos del usuario al "guardia"
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  session: {
    strategy: "jwt", // Define cómo NextAuth va a recordar al usuario mientras navega. Usamos JSON Web Tokens para la sesión 
  },
  pages: {
    signIn: '/login', // Le decimos que use nuestra página visual en lugar de la que trae por defecto
  }
});

export { handler as GET, handler as POST }; // exige que los archivos de API exporten específicamente los métodos de internet