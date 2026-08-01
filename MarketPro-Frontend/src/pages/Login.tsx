import React from 'react';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

interface LoginProps {
  onLogin: (credentials: { username: string; password: string }) => void;
  onNavigate: (view: string) => void;
  onForgotPassword: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate, onForgotPassword }) => {
  
  const handleForgotPassword = () => {
    console.log('🔐 Navegando a recuperación de contraseña...');
    onNavigate('forgot-password');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(0, 51, 102, 0.1), 0 8px 10px -6px rgba(0, 51, 102, 0.05)'
        }}
      >
        <div className="bg-primary p-6 text-center flex justify-center">
          {/* Aquí cargamos específicamente el logo del login */}
          <Logo imageSrc="/MarketPro_logo.png" />
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Iniciar Sesión</h2>
          
          <LoginForm 
            onSubmit={onLogin}
            onForgotPassword={handleForgotPassword}
          />
        </div>

        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} MarketPro • Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default Login;