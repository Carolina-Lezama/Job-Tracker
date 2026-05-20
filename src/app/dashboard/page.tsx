// tusitio.com/dashboard
// Un componente marcado con 'use client' nunca puede ser async ni usar getServerSession
// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import DashboardClient from "./DashboardClient";

// Configuración obligatoria de Prisma 7 con el adaptador de Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:michimiau@localhost:5432/job_tracker_db?schema=public"
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default async function DashboardPage() {
  // 1. Validamos la sesión en el servidor
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const emailUsuario = session.user.email;

  // 2. CONSULTAS A POSTGRESQL (Métricas para los KPIs)
  
  // Total de aplicaciones de este usuario
  const totalPostulaciones = await prisma.job.count({
    where: { user: { email: emailUsuario } }
  });

  // Cuántas están en estado de entrevista
  const enEntrevista = await prisma.job.count({
    where: { 
      user: { email: emailUsuario },
      status: "INTERVIEW"
    }
  });

  // Tasa de respuesta: (Entrevistas + Ofertas + Rechazos) / Total * 100
  const conRespuesta = await prisma.job.count({
    where: {
      user: { email: emailUsuario },
      status: { in: ["INTERVIEW", "OFFER", "REJECTED"] }
    }
  });

  const tasaRespuesta = totalPostulaciones > 0 
    ? ((conRespuesta / totalPostulaciones) * 100).toFixed(1) 
    : "0.0";

  // 3. CONSULTA PARA LA GRÁFICA (Últimos 6 meses)
  // Calculamos la fecha de hace 6 meses para no traer todo el historial histórico
  const haceSeisMeses = new Date();
  haceSeisMeses.setMonth(haceSeisMeses.getMonth() - 5);
  haceSeisMeses.setDate(1); // Empezamos desde el día 1 de ese mes

  const vacantesRecientes = await prisma.job.findMany({
    where: {
      user: { email: emailUsuario },
      applicationDate: { gte: haceSeisMeses }
    },
    select: {
      applicationDate: true
    }
  });

  // Procesamos los registros en el servidor para agruparlos por mes numérico (0-11)
  const conteoPorMes: { [key: number]: number } = {};
  vacantesRecientes.forEach(vacante => {
    const mes = new Date(vacante.applicationDate).getMonth();
    conteoPorMes[mes] = (conteoPorMes[mes] || 0) + 1;
  });

  // Formateamos el arreglo tal como lo espera nuestro algoritmo del cliente
  const datosIniciales = Object.entries(conteoPorMes).map(([mes, conteo]) => ({
    month: parseInt(mes),
    count: conteo
  }));

  // 4. Enviamos todo al componente visual del cliente
  return (
    <DashboardClient 
      nombreUsuario={session.user.name || "Usuario"} 
      datosIniciales={datosIniciales}
      totalPostulaciones={totalPostulaciones}
      enEntrevista={enEntrevista}
      tasaRespuesta={tasaRespuesta}
    />
  );
}