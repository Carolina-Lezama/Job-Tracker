/*
Una pantalla dedicada exclusivamente al formulario para registrar una nueva postulación (empresa, puesto, salario, link, etc.).
*/

import AddJobForm from "@/components/jobs/AddJobForm";

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <AddJobForm />
      </div>
    </div>
  );
}