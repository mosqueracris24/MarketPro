/**
 * COMPONENTE CAMPO DE TEXTO PERSONALIZADO (Input.tsx)
 * 
 * Este es un componente reutilizable para crear campos de texto en toda la aplicación.
 * En lugar de usar inputs HTML normales, usamos este componente personalizado
 * para que todos los campos se vean iguales y tengan las mismas funcionalidades.
 * 
 * ¿QUÉ HACE ESTE COMPONENTE?
 * - Crea campos de texto con etiquetas y mensajes de error
 * - Puede mostrar iconos dentro del campo
 * - Maneja campos de contraseña con botón para mostrar/ocultar
 * - Tiene estilos consistentes en toda la aplicación
 * - Muestra mensajes de error cuando algo está mal
 * 
 * PIENSA EN ESTO COMO:
 * Un molde para hacer campos de texto. En lugar de crear cada campo desde cero,
 * usamos este molde y solo cambiamos la etiqueta, el tipo y el contenido.
 */

// IMPORTACIONES
import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * ⚠️ CAMBIO CLAVE:
 * Usamos forwardRef para que react-hook-form pueda leer el input
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  icon,
  type = 'text',
  ...props
}, ref) => {

  // ESTADO PARA CONTRASEÑA
  const [showPassword, setShowPassword] = useState(false);

  // TIPO DINÁMICO
  const inputType = type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`mb-4 ${widthClass}`}>

      {/* ETIQUETA */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">

        {/* ICONO IZQUIERDO */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* INPUT PRINCIPAL */}
        <input
          ref={ref} // 🔥 ESTE ES EL ARREGLO IMPORTANTE
          type={inputType}
          className={`
            py-2 px-4 
            ${icon ? 'pl-10' : ''} 
            border border-gray-300 rounded-md
            bg-white text-gray-900
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${widthClass}
            ${className}
          `}
          {...props}
        />

        {/* BOTÓN PASSWORD */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* ERROR */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

// 👇 NECESARIO para evitar warning en consola
Input.displayName = 'Input';

export default Input;