/**
 * COMPONENTE LOGO DE LA EMPRESA (Logo.tsx)
 * 
 * Este componente muestra el logo de MarketPro en diferentes partes de la aplicación.
 * Es un componente simple pero importante porque representa la identidad visual
 * de la empresa.
 * 
 * ¿QUÉ HACE ESTE COMPONENTE?
 * - Muestra la imagen del logo de MarketPro
 * - Se puede personalizar el tamaño y las clases CSS
 * - Mantiene la consistencia visual en toda la aplicación
 * - Es reutilizable en diferentes páginas y componentes
 * 
 * PIENSA EN ESTO COMO:
 * El sello o firma de la empresa que aparece en diferentes documentos
 * y lugares para identificar que pertenece a MarketPro.
 */

// IMPORTACIONES
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  imageSrc?: string; // Nueva prop opcional para cambiar la imagen
}

const Logo: React.FC<LogoProps> = ({ className = '', imageSrc = '/MarketPro.png' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={imageSrc} // Usa la imagen que se le pase o por defecto MarketPro.png
        alt="MarketPro Logo" 
        className="h-10 w-auto" 
      />
    </div>
  );
};

export default Logo;