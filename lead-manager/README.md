# LeadX CRM - Gestión de Clientes Potenciales

Una aplicación web completa y moderna para gestionar leads, pensada en la conversión, con interfaz Drag & Drop (Kanban) y reportes en tiempo real. 

## 🛠️ Tecnologías

- **Frontend:** React (Vite, TS) + TailwindCSS v4 + React Router
- **Backend:** Supabase (PostgreSQL DB, Storage, Auth opcional)
- **UI/UX:** Framer Motion (Opcional en tu extensión), Lucide React, @hello-pangea/dnd

## 🚀 Instalación y Uso

1. **Configurar Supabase:**
   - Crear un nuevo proyecto en [Supabase](https://supabase.com/).
   - Ve al "SQL Editor" en Supabase y copia el contenido del archivo `supabase_schema.sql` y ejecútalo.
   - Ve a "Storage", crea un nuevo Bucket que **debe llamarse** `archivos`, y marca la opción "Public" para el bucket.

2. **Variables de Entorno:**
   - Copia el archivo `.env.example` o crea uno llamado `.env`.
   - Rellena `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con las credenciales de la sección "Project Settings -> API" de tu Supabase.

3. **Instalar y Ejecutar:**
   Asegurate de estar en la carpeta del proyecto.
   ```bash
   npm install
   npm run dev
   ```

4. **Probar el CSV:**
   Puedes crear un pequeño CSV que tenga columnas como:
   `nombre, negocio, telefono, email, ciudad`
   e importarlo en la pestaña de Leads. Te sorprenderás cómo aparece y puedes mover a tus clientes de fase.
