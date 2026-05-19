// tusitio.com/dashboard
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Validamos si hay una sesión activa en el servidor
  const session = await getServerSession(authOptions);

  // 2. Si no hay sesión, rebota al usuario al login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-500 mt-2">Bienvenida a tu panel de control analítico.</p>
        
        {/* Aquí colocaremos las tarjetas de métricas más adelante */}
        <div className="mt-6 p-6 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-600">Próximamente: Gráficos mensuales y tasas de respuesta.</p>
        </div>
      </div>
    </div>
  );
}