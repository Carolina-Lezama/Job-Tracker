'use client'
// las gráficas interactivas requieren acceso al navegador para dibujarse.
// app/dashboard/DashboardClient.tsx

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const NOMBRES_MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// Definimos la estructura de datos que recibe el componente
interface DashboardClientProps {
  nombreUsuario: string;
  datosIniciales: { month: number; count: number }[];
  totalPostulaciones: number;
  enEntrevista: number;
  tasaRespuesta: string;
}

export default function DashboardClient({ 
  nombreUsuario, 
  datosIniciales, 
  totalPostulaciones, 
  enEntrevista, 
  tasaRespuesta 
}: DashboardClientProps) {
  
  const [datosCrudos] = useState(datosIniciales);

  // Tu algoritmo de continuidad cronológica e inyección de ceros
  const procesarDatosParaGrafica = () => {
    const añoActual = new Date().getFullYear();
    const mesActual = new Date().getMonth();
    const datosProcesados = [];

    for (let i = 5; i >= 0; i--) {
      const fechaObjetivo = new Date(añoActual, mesActual - i, 1);
      const numeroMes = fechaObjetivo.getMonth();
      const nombreMes = NOMBRES_MESES[numeroMes];

      const registroExistente = datosCrudos.find(d => d.month === numeroMes);

      datosProcesados.push({
        name: nombreMes,
        Postulaciones: registroExistente ? registroExistente.count : 0,
      });
    }

    return datosProcesados;
  };

  const datosGrafica = procesarDatosParaGrafica();

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">¡Hola de nuevo, {nombreUsuario}!</h1>
          <p className="text-gray-500 text-sm mt-1">
            Analiza el rendimiento y progreso de tu búsqueda activa de empleo.
          </p>
        </div>

        {/* TARJETAS DE MÉTRICAS (Valores reales de la DB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-400 uppercase">Total de Postulaciones</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalPostulaciones}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-400 uppercase">En Entrevista</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{enEntrevista}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-400 uppercase">Tasa de Respuesta</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{tasaRespuesta}%</p>
          </div>
        </div>

        {/* SECCIÓN DE LA GRÁFICA */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Volumen de Postulaciones Mensuales</h3>
            <p className="text-xs text-gray-400 mt-1">Historial continuo de los últimos 6 meses</p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosGrafica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Legend />
                <Bar dataKey="Postulaciones" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}