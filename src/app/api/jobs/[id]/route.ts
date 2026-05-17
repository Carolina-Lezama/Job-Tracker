import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. La nueva configuración de Prisma que ya dominamos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:michimiau@localhost:5432/job_tracker_db?schema=public"
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


// 2. El método PATCH para recibir la actualización del Dropdown
export async function PATCH(
  request: Request,
  // 1. Le decimos a TypeScript que params ahora es una Promesa
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 2. AWAITEAMOS los params para desempaquetar el ID correctamente
    const { id } = await params; 

    // Extraemos el nuevo estado
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ message: "El estado es requerido" }, { status: 400 });
    }

    // Le decimos a PostgreSQL que actualice específicamente esta vacante
    const updatedJob = await prisma.job.update({
      where: { 
        id: id // 3. Usamos el ID que ya desempaquetamos arriba
      },
      data: { 
        status: status 
      },
    });

    return NextResponse.json(updatedJob, { status: 200 });

  } catch (error) {
    console.error("Error en el backend al actualizar:", error);
    return NextResponse.json({ message: "Error interno al actualizar la vacante" }, { status: 500 });
  }
}