// ruta: tusitio.com/jobs/new, solo si agrego una carpeta mas entre dashboard y page.tsx
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import Image from "next/image"; // para consumir imagenes
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

  // Variables de control de estado
  let jobs: any[] = [];
  let databaseError = false;

  // Intentamos conectar con PostgreSQL de forma segura
  try {
    jobs = await prisma.job.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    // Si la conexión falla, evitamos que la app colapse e indicamos el error
    console.error("Error crítico de conexión a PostgreSQL: ", error);
    databaseError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Applications Tracker</h1>
            <p className="text-gray-500 text-sm mt-1">Monitorea y gestiona tus procesos de selección activos.</p>
          </div>
          {!databaseError && (
            <Link
              href="/jobs/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200"
            >
              + New Application
            </Link>
          )}
        </div>

        {/* CASO A: Hubo un fallo de conexión estable con la Base de Datos */}
        {databaseError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center shadow-sm">
            <span className="text-3xl">
              <Image 
                src="/images/alerta.png"  // La ruta SIEMPRE empieza con / (Next asume que la raíz es la carpeta 'public')
                alt="Señal de alerta" // Texto descriptivo obligatorio
                width={36}                // Ancho en píxeles (Obligatorio)
                height={36}               // Alto en píxeles (Obligatorio)
                className="block mx-auto" 
              />
            </span>
            <h3 className="text-lg font-bold text-red-800 mt-2">Error de Sincronización</h3>
            <p className="text-red-600 text-sm mt-1">
              No se pudo establecer una conexión estable con el servidor de datos. Las vacantes no se pueden mostrar en este momento.
            </p>
          </div>
        ) : jobs.length === 0 ? (
          /* CASO B: Conexión exitosa pero no hay datos creados */
          <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay vacantes registradas</h3>
            <p className="text-gray-500 mb-6">Comienza tu búsqueda agregando tu primera postulación laboral.</p>
            <Link href="/jobs/new" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              Agregar vacante ahora &rarr;
            </Link>
          </div>
        ) : (
          /* CASO C: Todo funciona e imprimimos la tabla */
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            {/* ... (Todo tu código existente de la tabla con el <tbody> y el map de jobs sigue exactamente igual aquí adentro) ... */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold border-b border-gray-200">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Salary</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-900">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 font-semibold">{job.company}</td>
                      <td className="px-6 py-4 text-gray-600">{job.position}</td>
                      <td className="px-6 py-4 font-mono">{job.salary ? `$${job.salary.toLocaleString()}` : "—"}</td>
                      <td className="px-6 py-4"><StatusDropdown jobId={job.id} currentStatus={job.status} /></td>
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