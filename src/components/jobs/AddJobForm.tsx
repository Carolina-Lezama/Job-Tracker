"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddJobForm() {
  const router = useRouter();
  
  // Estados para nuestros campos
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  
  // Estados para el manejo de la interfaz
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, position, salary, link, notes }),
      });

      if (res.ok) {
        // Si se guarda correctamente, mandamos al usuario a ver su lista de vacantes
        router.push("/jobs");
        router.refresh(); // Refrescamos para que la nueva base de datos se lea
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Error al guardar la vacante");
      }
    } catch (error) {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Agregar Nueva Vacante</h2>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Empresa */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Empresa *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ej. Google, Microsoft"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          {/* Puesto */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Puesto *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ej. Junior Data Analyst"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salario */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Salario (Opcional)</label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ej. 30000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Link de la Vacante (Opcional)</label>
            <input
              type="url"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
              placeholder="https://..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Notas Adicionales</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black h-24"
            placeholder="¿Algún detalle importante de la vacante?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-3 px-4 rounded transition duration-200 ${
              isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Guardando..." : "Guardar Vacante"}
          </button>
        </div>
      </form>
    </div>
  );
}