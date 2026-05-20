import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// 1. La nueva configuración de Prisma que ya dominamos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:michimiau@localhost:5432/job_tracker_db?schema=public"
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


// 1. El método PATCH para recibir la actualización del Dropdown
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const body = await request.json();
    const { status } = body;

    const updatedJob = await prisma.job.update({
      where: { id: params.id, userId: (session.user as any).id },
      data: { status },
    });
    return NextResponse.json(updatedJob);
  } catch (error) {
    return NextResponse.json({ message: "Error del servidor" }, { status: 500 });
  }
}

// 2. PUT (Editar Vacante Completa)
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // AQUÍ ESTÁ LA MAGIA
    const { id } = await props.params;
    
    const body = await request.json();
    const { company, position, salary, link, notes } = body;

    const updatedJob = await prisma.job.update({
      where: { id: id, userId: (session.user as any).id },
      data: {
        company,
        position,
        salary: salary ? parseFloat(salary) : null,
        link: link || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ message: "Vacante actualizada", job: updatedJob });
  } catch (error) {
    return NextResponse.json({ message: "Error al actualizar la vacante" }, { status: 500 });
  }
}

// 3. DELETE (Eliminar Vacante)
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any).id) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // AQUÍ ESTÁ LA MAGIA
    const { id } = await props.params;

    await prisma.job.delete({
      where: {
        id: id,
        userId: (session.user as any).id, // Seguridad: Solo el dueño puede borrarla
      },
    });

    return NextResponse.json({ message: "Vacante eliminada con éxito" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al eliminar la vacante" }, { status: 500 });
  }
}