/*
Es la página de inicio (/).
cada carpeta que crees dentro de src/app/ se convierte en una ruta (URL), pero solo si dentro de esa carpeta existe un archivo llamado exactamente page.tsx.

equivalente a index.php o index.html
*/

/*
Landing Page
*/
export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenida a Job Tracker</h1>
      <p>La mejor herramienta para gestionar tu búsqueda de empleo.</p>
    </div>
  );
}