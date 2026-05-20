/*
Es la página de inicio (/).
cada carpeta que crees dentro de src/app/ se convierte en una ruta (URL), pero solo si dentro de esa carpeta existe un archivo llamado exactamente page.tsx.

equivalente a index.php o index.html
*/

/*
Landing Page
*/
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* SECCIÓN HERO (La parte principal) */}
      <section className="relative bg-gray-50 pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Toma el control de tu <br className="hidden sm:block" />
            <span className="text-blue-600">búsqueda de empleo</span>
          </h1>
          
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-500 mx-auto mb-10">
            Una plataforma diseñada para organizar tus postulaciones, analizar tus tasas de respuesta y tomar decisiones basadas en datos para conseguir el trabajo de tus sueños.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all"
            >
              Comenzar ahora
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg shadow-sm transition-all"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CARACTERÍSTICAS (Por qué usar la app) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Todo lo que necesitas en un solo lugar</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Tarjeta 1 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Panel Analítico</h3>
            <p className="text-gray-500">
              Visualiza tu rendimiento con gráficas claras. Descubre cuántas aplicaciones se convierten en entrevistas reales.
            </p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              📂
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión Ordenada</h3>
            <p className="text-gray-500">
              Dile adiós al caos de Excel. Registra empresas, salarios, fechas y notas de cada vacante en una base de datos segura.
            </p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seguimiento de Estados</h3>
            <p className="text-gray-500">
              Actualiza el progreso de tus postulaciones desde "Deseado" hasta "Oferta" con un solo clic.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER BÁSICO */}
      <footer className="bg-gray-50 py-8 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Job Tracker. Creado para dominar el proceso de contratación.</p>
        </div>
      </footer>

    </div>
  );
}