/**
 * COMPONENTE BOTÓN PERSONALIZADO (Button.tsx)
 * 
 * Este es un componente reutilizable para crear botones en toda la aplicación.
 * En lugar de usar botones HTML normales, usamos este componente personalizado
 * para que todos los botones se vean iguales y tengan las mismas funcionalidades.
 * 
 * ¿QUÉ HACE ESTE COMPONENTE?
 * - Crea botones con diferentes estilos (primario, secundario, etc.)
 * - Permite diferentes tamaños (pequeño, mediano, grande)
 * - Puede mostrar un spinner de carga
 * - Se puede deshabilitar cuando es necesario
 * - Mantiene un diseño consistente en toda la aplicación
 * 
 * PIENSA EN ESTO COMO:
 * Un molde para hacer botones. En lugar de crear cada botón desde cero,
 * usamos este molde y solo cambiamos el color, tamaño y texto.
 */

// IMPORTACIONES
import React from 'react'; // React para crear el componente

/**
 * INTERFAZ: ¿QUÉ OPCIONES PUEDE TENER UN BOTÓN?
 * 
 * Esta interfaz define todas las propiedades que podemos personalizar
 * en nuestro botón personalizado.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // VARIANTE: ¿Qué tipo de botón es?
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  // TAMAÑO: ¿Qué tan grande debe ser?
  size?: 'sm' | 'md' | 'lg';
  
  // ANCHO COMPLETO: ¿Debe ocupar todo el ancho disponible?
  fullWidth?: boolean;
  
  // CARGANDO: ¿Debe mostrar un spinner de carga?
  isLoading?: boolean;
  
  // CONTENIDO: ¿Qué texto o elementos debe mostrar?
  children: React.ReactNode;
}

/**
 * COMPONENTE BOTÓN PERSONALIZADO
 * 
 * @param variant - Tipo de botón (primary, secondary, outline, ghost)
 * @param size - Tamaño del botón (sm, md, lg)
 * @param fullWidth - Si debe ocupar todo el ancho
 * @param isLoading - Si debe mostrar spinner de carga
 * @param children - Contenido del botón (texto, iconos, etc.)
 * @param className - Clases CSS adicionales
 * @param disabled - Si el botón está deshabilitado
 * @param props - Cualquier otra propiedad de botón HTML
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary', // Por defecto es un botón primario (azul)
  size = 'md', // Por defecto es tamaño mediano
  fullWidth = false, // Por defecto no ocupa todo el ancho
  isLoading = false, // Por defecto no está cargando
  children, // El contenido del botón
  className = '', // Clases CSS adicionales (vacío por defecto)
  disabled, // Si está deshabilitado
  ...props // Cualquier otra propiedad
}) => {
  
  // CLASES CSS BASE
  // Estas son las clases que todos los botones tendrán
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // CLASES SEGÚN LA VARIANTE
  // Cada tipo de botón tiene colores diferentes
  const variantClasses = {
    // BOTÓN PRIMARIO: Azul, para acciones principales
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50',
    
    // BOTÓN SECUNDARIO: Verde, para acciones secundarias
    secondary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50',
    
    // BOTÓN CON BORDE: Transparente con borde azul
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary/30',
    
    // BOTÓN FANTASMA: Transparente, solo se ve al pasar el mouse
    ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary/30',
  };
  
  // CLASES SEGÚN EL TAMAÑO
  // Cada tamaño tiene padding y texto diferente
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm', // Pequeño
    md: 'py-2 px-4 text-base', // Mediano
    lg: 'py-3 px-6 text-lg', // Grande
  };
  
  // CLASE PARA ANCHO COMPLETO
  const widthClass = fullWidth ? 'w-full' : '';
  
  // CLASE CUANDO ESTÁ CARGANDO
  const loadingClass = isLoading ? 'opacity-70 cursor-not-allowed' : '';
  
  // CLASE CUANDO ESTÁ DESHABILITADO
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    // ELEMENTO BOTÓN CON TODAS LAS CLASES APLICADAS
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={isLoading || disabled} // Se deshabilita si está cargando o deshabilitado
      {...props} // Aplicamos cualquier otra propiedad
    >
      {/* CONTENIDO DEL BOTÓN */}
      {isLoading ? (
        // SI ESTÁ CARGANDO, MOSTRAMOS UN SPINNER
        <div className="flex items-center justify-center">
          {/* SPINNER ANIMADO */}
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciando... {/* Texto que aparece mientras carga */}
        </div>
      ) : (
        // SI NO ESTÁ CARGANDO, MOSTRAMOS EL CONTENIDO NORMAL
        children
      )}
    </button>
  );
};

// EXPORTAMOS EL COMPONENTE PARA QUE PUEDA SER USADO EN OTROS ARCHIVOS
export default Button;