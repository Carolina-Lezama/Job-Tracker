"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Nuestro diccionario visual: Base de Datos -> Interfaz
const statusMap = {
  WISHLIST: "Deseado",
  APPLIED: "Aplicado",
  INTERVIEW: "En Entrevista",
  OFFER: "Oferta",
  REJECTED: "Rechazado",
};

// Estilos dinámicos usando Tailwind
const statusStyles: Record<string, string> = {
  WISHLIST: "bg-gray-100 text-gray-800",
  APPLIED: "bg-blue-100 text-blue-800",
  INTERVIEW: "bg-yellow-100 text-yellow-800",
  OFFER: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function StatusDropdown({ jobId, currentStatus }: { jobId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus); // Actualizamos visualmente al instante
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh(); // Le decimos a Next.js que recargue los datos del servidor de fondo
      } else {
        // Si el backend falla, regresamos el visual al estado original
        setStatus(currentStatus); 
        alert("Error al actualizar el estado");
      }
    } catch (error) {
      setStatus(currentStatus);
      alert("Error de conexión");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      title="Seleccionar estado"
      value={status}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`px-2 py-1 rounded-full text-xs font-semibold border border-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-center ${statusStyles[status]} ${isUpdating ? "opacity-50" : ""}`}
    >
      {Object.entries(statusMap).map(([key, label]) => (
        <option key={key} value={key} className="bg-white text-black font-normal">
          {label}
        </option>
      ))}
    </select>
  );
}