/**
 * COMPONENTE LAYOUT (ESTRUCTURA GENERAL) (Layout.tsx)
 * 
 * Este componente define la estructura general de todas las páginas de la aplicación.
 * Es como el "marco" o "esqueleto" que contiene el menú lateral, el header superior
 * y el área donde se muestra el contenido de cada página.
 * 
 * ¿QUÉ HACE ESTE COMPONENTE?
 * - Proporciona la estructura básica de la aplicación
 * - Incluye el menú lateral (Sidebar) para navegación
 * - Incluye el header superior con información del usuario
 * - Define el área principal donde se muestra el contenido de cada página
 * - Mantiene la consistencia visual en toda la aplicación
 * 
 * PIENSA EN ESTO COMO:
 * El marco de una casa que define dónde van las habitaciones, puertas y ventanas.
 * Todas las páginas de la aplicación usan este mismo marco.
 */

// IMPORTACIONES
import React from 'react'; // React para crear el componente
import Header from './Header'; // Componente del header superior
import Sidebar from './Sidebar'; // Componente del menú lateral

/**
 * INTERFAZ: ¿QUÉ INFORMACIÓN NECESITA EL LAYOUT?
 * 
 * Define todas las propiedades que necesita este componente para funcionar
 */
interface LayoutProps {
  // CONTENIDO: Las páginas que se mostrarán dentro del layout
  children: React.ReactNode;
  
  // VISTA ACTUAL: Qué página estamos viendo actualmente
  currentView: string;
  
  // FUNCIÓN DE NAVEGACIÓN: Para cambiar entre páginas
  onNavigate: (view: string) => void;
  
  // ¿ESTÁ AUTENTICADO?: Si el usuario ya inició sesión
  isAuthenticated?: boolean;
  
  // USUARIO ACTUAL: Información del usuario logueado
  currentUser?: {
    username: string; // Nombre del usuario
    email: string; // Email del usuario
    role: string; // Rol del usuario (Administrador, Cajero, etc.)
  };
}

/**
 * COMPONENTE LAYOUT PRINCIPAL
 * 
 * @param children - El contenido de la página actual que se mostrará
 * @param currentView - Nombre de la página actual
 * @param onNavigate - Función para cambiar de página
 * @param isAuthenticated - Si el usuario está logueado (por defecto false)
 * @param currentUser - Información del usuario actual
 */
const Layout: React.FC<LayoutProps> = ({ 
  children, // Contenido de la página
  currentView, // Página actual
  onNavigate, // Función de navegación
  isAuthenticated = false, // Por defecto no está autenticado
  currentUser // Información del usuario
}) => {
  return (
    // CONTENEDOR PRINCIPAL
    // Ocupa toda la pantalla y tiene el color de fondo de la aplicación
    <div className="min-h-screen bg-background">
      
      {/* MENÚ LATERAL (SIDEBAR) */}
      {/* Este componente muestra el menú de navegación en el lado izquierdo */}
      <Sidebar 
        currentView={currentView} // Le decimos qué página está activa
        onNavigate={onNavigate} // Le pasamos la función para cambiar páginas
      />
      
      {/* ÁREA PRINCIPAL DE CONTENIDO */}
      {/* Esta div se ajusta para dejar espacio al menú lateral (pl-64 = padding-left de 256px) */}
      <div className="pl-64">
        
        {/* HEADER SUPERIOR */}
        {/* Barra superior que muestra información del usuario y controles */}
        <Header 
          onNavigate={onNavigate} // Función para navegar
          isAuthenticated={isAuthenticated} // Si está logueado
          currentUser={currentUser} // Información del usuario
        />
        
        {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
        {/* Aquí se muestra el contenido específico de cada página */}
        <main className="container mx-auto px-8 py-8">
          {children} {/* Aquí se renderiza la página actual */}
        </main>
      </div>
    </div>
  );
};

// EXPORTAMOS EL COMPONENTE PARA QUE PUEDA SER USADO EN OTROS ARCHIVOS
export default Layout;