"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobActions({ job }: { job: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Función para eliminar
  const handleDelete = async () => {
    const confirmDelete = confirm(`¿Estás segura de eliminar la vacante en ${job.company}?`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh(); // Actualiza la tabla en tiempo real
      } else {
        alert("No se pudo eliminar la vacante.");
      }
    } catch (error) {
      alert("Error de red al intentar eliminar.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex space-x-3 items-center">
      {/* Botón Ver Más (Notas) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver más
      </button>

      {/* Enlace para Editar (Apuntará a una pantalla de edición que crearemos) */}
      <Link
        href={`/jobs/edit/${job.id}`}
        className="text-yellow-600 hover:text-yellow-800 font-medium"
      >
        Editar
      </Link>

      {/* Botón Eliminar */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
      >
        {isDeleting ? "Borrando..." : "Eliminar"}
      </button>

      {/* MODAL EMERGENTE (Solo se ve si isModalOpen es true) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{job.position}</h3>
            <p className="text-sm text-gray-500 mb-4">{job.company}</p>
            
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 min-h-[100px] mb-6">
              <h4 className="text-xs uppercase font-bold text-gray-400 mb-1">Notas Adicionales</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {job.notes ? job.notes : "Sin notas adicionales registradas para esta aplicación."}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded text-sm transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}