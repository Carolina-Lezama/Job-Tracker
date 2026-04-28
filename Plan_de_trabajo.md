# Plan de trabajo

## Objetivo
Crear una aplicación web real, funcional y con buena experiencia de usuario (UX) para gestionar aplicaciones laborales, culminando en un simulacro de despliegue en la nube.

## El Stack Tecnológico
- Next.js
- Tailwind CSS
- PostgreSQL + Prisma
- Auth.js

## Funcionalidades Principales (MVP)
1. Autenticación: Registro y acceso de usuarios.

2. Gestor de Vacantes (CRUD): Crear, leer, actualizar y eliminar aplicaciones con detalles clave (empresa, sueldo, estatus de la aplicación, fechas).

3. Dashboard: Un panel de métricas con el total de aplicaciones, entrevistas, tasas de respuesta y gráficos.

# Plan de Desarrollo
#### Fase 1: Los Cimientos (Completado)
- Definir el modelo de datos.
- Conectar la base de datos (PostgreSQL + Prisma).

### Fase 2: El Esqueleto y Enrutamiento (Structure & Screens) (Completado)
- Crear las carpetas en Next.js para nuestras páginas principales (/login, /register, /dashboard, /jobs).
- Crear un Layout global (por ejemplo, una barra de navegación sencilla que se vea en todas las pantallas).

### Fase 3: Autenticación (El Guardia de Seguridad)
- Instalar y configurar Auth.js. (específicamente la versión para Next.js llamada next-auth)
- Hacer que el registro y el inicio de sesión funcionen realmente contra tu base de datos.
- Proteger la ruta del /dashboard para que nadie entre sin iniciar sesión.

### Fase 4: El Corazón (Funcionalidad CRUD + Diseño Mobile-First)
- Construir el formulario para agregar una vacante.
- Construir la tabla/lista para ver las vacantes.
- Diseñaremos todo mientras los programamos, asegurándonos desde el primer segundo de que se vean bien en celular (Mobile-First) y luego en escritorio.

### Fase 5: El Cerebro (Métricas y Dashboard)
- Usaremos Prisma para hacer las consultas a la base de datos (como agrupar las vacantes por estado o contar cuántas enviaste en el mes) y mostraremos esos números en el panel principal.

### Fase 6: Pulido Final (UX)
- Agregar alertas de éxito o error (ej. "¡Vacante guardada!").
- Asegurar que la aplicación se sienta rápida y profesional.




