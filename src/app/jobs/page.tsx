// ruta: tusitio.com/jobs/new, solo si agrego una carpeta mas entre dashboard y page.tsx
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import StatusDropdown from "@/components/jobs/StatusDropdown";

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:michimiau@localhost:5432/job_tracker_db?schema=public" 
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Mapeo de colores para los badges de estado (UI Moderna)
const statusStyles: Record<string, string> = {
  WISHLIST: "bg-gray-100 text-gray-800 border-gray-300",
  APPLIED: "bg-blue-100 text-blue-800 border-blue-300",
  INTERVIEW: "bg-yellow-100 text-yellow-800 border-yellow-300",
  OFFER: "bg-green-100 text-green-800 border-green-300",
  REJECTED: "bg-red-100 text-red-800 border-red-300",
};

export default async function JobsPage() {
  // 1. Verificamos la sesión en el servidor
  const session = await getServerSession(authOptions);

  // Si no está logueado, lo redirigimos al login inmediatamente
  if (!session || !(session.user as any).id) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // 2. Consulta a la base de datos (SELECT * FROM "Job" WHERE "userId" = ... ORDER BY "createdAt" DESC)
  const jobs = await prisma.job.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications Tracker</h1>
            <p className="text-gray-500 text-sm mt-1">Monitorea y gestiona tus procesos de selección activos.</p>
          </div>
          <Link
            href="/jobs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
          >
            + New Application
          </Link>
        </div>

        {/* 3. Validación de datos existentes (Manejo de estado vacío) */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vacantes registradas</h3>
            <p className="text-gray-500 mb-6">Comienza tu búsqueda agregando tu primera postulación laboral.</p>
            <Link
              href="/jobs/new"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Agregar vacante ahora &rarr;
            </Link>
          </div>
        ) : (
          /* 4. Tabla de Visualización de Datos */
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Applied</th>
                    <th className="px-6 py-4">Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-900">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                      {/* Empresa */}
                      <td className="px-6 py-4 font-semibold text-gray-900">{job.company}</td>
                      
                      {/* Puesto */}
                      <td className="px-6 py-4 text-gray-600">{job.position}</td>
                      
                      {/* Salario formatado */}
                      <td className="px-6 py-4 font-mono text-gray-600">
                        {job.salary ? `$${job.salary.toLocaleString()}` : "—"}
                      </td>
                      
                      {/* Badge de Estado Interactivo */}
                      <td className="px-6 py-4">
                        <StatusDropdown jobId={job.id} currentStatus={job.status} />
                      </td>
                      
                      {/* Fecha de aplicación formateada */}
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(job.applicationDate).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      
                      {/* Enlace */}
                      <td className="px-6 py-4">
                        {job.link ? (
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Post
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}