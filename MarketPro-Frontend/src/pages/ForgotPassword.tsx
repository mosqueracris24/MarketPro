import React, { useState } from 'react';
import { ArrowLeft, Mail, Lock, Key, CheckCircle, XCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/Logo';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
  onNavigate?: (view: string) => void;
}

type Step = 'email' | 'code' | 'password' | 'success';

interface StatusMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showMessage = (type: StatusMessage['type'], text: string, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const generateSecurityCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // PASO 1: VERIFICAR EMAIL EN LA BASE DE DATOS REAL
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!email.trim()) {
      setErrors({ email: 'El email es requerido' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Ingrese un email válido' });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ email: data.error || 'No existe una cuenta asociada a este email' });
        setIsLoading(false);
        return;
      }

      // Si el correo existe en PostgreSQL, generamos el código de seguridad
      const code = generateSecurityCode();
      setGeneratedCode(code);
      
      console.log(`🔐 Código de seguridad para ${email}: ${code}`);
      alert(`🔐 Código de seguridad (Pruebas): ${code}`);

      setCurrentStep('code');
      showMessage('success', `Código de seguridad enviado a ${email}`, 7000);
      
    } catch (error) {
      console.error('Error conectando con el servidor:', error);
      showMessage('error', 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  // PASO 2: VERIFICAR CÓDIGO
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!securityCode.trim() || securityCode.length !== 6) {
      setErrors({ code: 'Ingrese un código válido de 6 dígitos' });
      return;
    }
    
    if (securityCode !== generatedCode) {
      setErrors({ code: 'Código de seguridad incorrecto' });
      return;
    }
    
    setCurrentStep('password');
    showMessage('success', 'Código verificado correctamente');
  };

  // PASO 3: ACTUALIZAR CONTRASEÑA EN LA BASE DE DATOS
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('success');
      } else {
        showMessage('error', data.error || 'Error al actualizar la contraseña');
      }
      
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      showMessage('error', 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    const newCode = generateSecurityCode();
    setGeneratedCode(newCode);
    alert(`🔐 Nuevo código de seguridad: ${newCode}`);
    showMessage('info', 'Nuevo código generado y enviado');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Recuperar Contraseña</h2>
              <p className="text-gray-500 text-sm">Ingrese su email registrado para recibir un código</p>
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              error={errors.email}
              placeholder="cristinaisabelmosquerac@gmail.com"
              icon={<Mail size={18} />}
              required
              autoFocus
            />

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
              Enviar Código de Seguridad
            </Button>
          </form>
        );

      case 'code':
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Verificar Código</h2>
              <p className="text-gray-500 text-sm">Ingrese el código de 6 dígitos</p>
              <p className="text-primary text-sm font-medium mt-1">{email}</p>
            </div>

            <Input
              label="Código de Seguridad"
              type="text"
              value={securityCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setSecurityCode(value);
                clearError('code');
              }}
              error={errors.code}
              placeholder="123456"
              icon={<Key size={18} />}
              maxLength={6}
              required
              autoFocus
            />

            <div className="flex justify-between items-center">
              <button type="button" onClick={handleResendCode} className="text-sm text-primary hover:underline">
                Reenviar código
              </button>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
              Verificar Código
            </Button>
          </form>
        );

      case 'password':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Nueva Contraseña</h2>
              <p className="text-gray-500 text-sm">Establezca una nueva contraseña para su cuenta</p>
            </div>

            <Input
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); clearError('newPassword'); }}
              error={errors.newPassword}
              placeholder="Nueva contraseña"
              icon={<Lock size={18} />}
              required
              autoFocus
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
              error={errors.confirmPassword}
              placeholder="Confirme la contraseña"
              icon={<Lock size={18} />}
              required
            />

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-6">
              Actualizar Contraseña
            </Button>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">¡Contraseña Actualizada!</h2>
              <p className="text-gray-500 text-sm">Ya puede iniciar sesión con su nueva contraseña en la base de datos.</p>
            </div>
            <Button onClick={onBackToLogin} fullWidth className="mt-6">
              Ir al Inicio de Sesión
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Aquí se carga exclusivamente MarketPro_logo.png como lo pediste */}
        <div className="bg-primary p-6 flex flex-col items-center justify-center border-b border-gray-200">
          <Logo imageSrc="/MarketPro_logo.png" />
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          {renderStepContent()}

          {currentStep !== 'success' && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button onClick={onBackToLogin} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                <ArrowLeft size={16} /> Regresar al inicio de sesión
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          © {new Date().getFullYear()} MarketPro • Todos los derechos reservados
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;