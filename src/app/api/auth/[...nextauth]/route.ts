/*
archivo especial que interceptará cualquier intento de inicio de sesión.
[...nextauth] atrapará cualquier ruta de autenticación
*/ 

import NextAuth, { NextAuthOptions } from "next-auth"; // maneja las sesiones, las cookies y la seguridad.
import CredentialsProvider from "next-auth/providers/credentials"; // permite iniciar sesión con Google, GitHub, etc.
import { PrismaClient } from "@prisma/client"; // permite que tu código de JavaScript/TypeScript hable con tu base de datos PostgreSQL.
import bcrypt from "bcryptjs"; // para encriptar contraseñas y compararlas

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Configuramos el Pool de conexiones con tu URL
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:michimiau@localhost:5432/job_tracker_db?schema=public" 
});

// 2. Creamos el adaptador
const adapter = new PrismaPg(pool);

// 3. Inicializamos PrismaClient con el adaptador
const prisma = new PrismaClient({ adapter });

// Separamos la configuración en una constante exportable
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Faltan datos");
        
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) throw new Error("Usuario no encontrado");

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) throw new Error("Contraseña incorrecta");

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  session: { strategy: "jwt" }, // Define cómo NextAuth va a recordar al usuario mientras navega. Usamos JSON Web Tokens para la sesión 
  pages: { signIn: '/login' }, // Le decimos que use nuestra página visual en lugar de la que trae por defecto
  
  // ¡AQUÍ ESTÁ LA MAGIA NUEVA! Los callbacks
  callbacks: {
    // 1. Metemos el ID del usuario en el token interno
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // 2. Pasamos ese ID del token a la sesión pública
    async session({ session, token }) {
      if (session.user) {
        // Usamos 'as any' temporalmente para evitar que TypeScript se queje de que 'id' no existe en el tipo estándar
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions); 
export { handler as GET, handler as POST }; // exige que los archivos de API exporten específicamente los métodos de internet

