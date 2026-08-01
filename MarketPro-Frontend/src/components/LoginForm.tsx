/**
 * FORMULARIO DE INICIO DE SESIÓN (LoginForm.tsx)
 * 
 * Este componente contiene el formulario donde el usuario escribe
 * su nombre de usuario y contraseña para entrar al sistema.
 * 
 * ¿QUÉ HACE ESTE COMPONENTE?
 * - Muestra campos para usuario y contraseña
 * - Valida que los datos estén correctos antes de enviarlos
 * - Muestra mensajes de error si algo está mal
 * - Tiene un enlace para recuperar contraseña olvidada
 * - Muestra los requisitos de contraseña segura
 * 
 * PIENSA EN ESTO COMO:
 * Un formulario de papel donde escribes tus datos, pero que te dice
 * inmediatamente si algo está mal antes de enviarlo
 */

// IMPORTACIONES - Traemos las herramientas que necesitamos
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<{ exito: boolean; error?: string } | void>;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onForgotPassword }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await onSubmit({ username, password });
      
      // Si el login retorna un error, lo mostramos en pantalla sin usar alert()
      if (result && !result.exito) {
        setErrorMsg(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setErrorMsg('Ocurrió un error al intentar conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Mensaje de error integrado en la vista */}
      {errorMsg && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 rounded">
          <p>{errorMsg}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario / Email
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ingresa tu usuario"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-primary hover:underline focus:outline-none"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-opacity-90 transition duration-200 disabled:opacity-50"
      >
        {loading ? 'Verificando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
};

export default LoginForm;