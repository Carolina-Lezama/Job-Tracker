import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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

// Método POST para CREAR una vacante
export async function POST(request: Request) {
  try {
    // 1. Verificamos quién está haciendo la petición 
    const session = await getServerSession(authOptions);
    
    if (!session || !(session.user as any).id) {
      return NextResponse.json({ message: "No autorizado. Inicia sesión primero." }, { status: 401 });
    }

    // 2. Extraemos el ID del usuario
    const userId = (session.user as any).id;

    // 3. Extraemos los datos que nos enviará el frontend
    const body = await request.json();
    const { company, position, salary, link, notes } = body;

    // Validación básica: Empresa y Puesto son obligatorios en nuestro esquema
    if (!company || !position) {
      return NextResponse.json({ message: "La empresa y el puesto son obligatorios" }, { status: 400 });
    }

    // 4. Guardamos en PostgreSQL usando Prisma
    const newJob = await prisma.job.create({
      data: {
        company: company,
        position: position,
        // Convertimos el salario a número si existe, si no, lo dejamos null
        salary: salary ? parseFloat(salary) : null,
        link: link || null,
        notes: notes || null,
        user: {
          connect: { id: userId }
        }
      }
    });

    return NextResponse.json({ message: "Vacante guardada con éxito", job: newJob }, { status: 201 });

  } catch (error) {
    console.error("Error al crear vacante:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}