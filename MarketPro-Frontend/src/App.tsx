/**
 * COMPONENTE PRINCIPAL DE LA APLICACIÓN (App.tsx)
 */

import { useState } from 'react';
import { useEffect } from 'react';

// IMPORTAMOS TODAS LAS PÁGINAS DE NUESTRA APLICACIÓN
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import RegisterEntry from './pages/RegisterEntry';
import EntriesList from './pages/EntriesList';
import RegisterExit from './pages/RegisterExit';
import ExitsList from './pages/ExitsList';
import RegisterReturn from './pages/RegisterReturn';
import ReturnsList from './pages/ReturnsList';
import Users from './pages/Users';
import StockAlerts from './pages/StockAlerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

// IMPORTAMOS COMPONENTES
import Layout from './components/Layout';

// IMPORTAMOS LOS SERVICIOS DE BASE DE DATOS
// @ts-ignore
import authService from './services/authService.js';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    createdAt: new Date()
  });

  // EFECTO PARA CARGAR SESIÓN GUARDADA
  useEffect(() => {
    console.log('🚀 Iniciando aplicación MarketPro...');
    const usuarioGuardado = authService.recuperarSesion();
    if (usuarioGuardado) {
      console.log('✅ Sesión recuperada:', usuarioGuardado);
      setCurrentUser(usuarioGuardado);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      console.log('ℹ️ No hay sesión activa, mostrando login');
      setIsAuthenticated(false);
      setCurrentView('login');
    }
  }, []);

  // FUNCIÓN: NAVEGAR ENTRE PÁGINAS
  const handleNavigate = (view: string) => {
    if (view === 'logout') {
      authService.cerrarSesion();
      setIsAuthenticated(false);
      setCurrentView('login');
      setCurrentUser({
        id: '',
        username: '',
        email: '',
        role: '',
        createdAt: new Date()
      });
      console.log('✅ Sesión cerrada correctamente');
      return;
    }

    if (view === 'login') {
      setCurrentView('login');
      return;
    }

    setCurrentView(view);
    if (view !== 'edit') {
      setSelectedProductId(null);
    }
  };

  // FUNCIÓN: INICIAR SESIÓN CONECTADA AL BACKEND (Sin alertas molestas)
  const handleLogin = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        authService.guardarSesion(data);
        setCurrentUser(data);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        // Eliminado el alert() nativo para una entrada limpia
        return { exito: true };
      } else {
        return { 
          exito: false, 
          error: data.error || 'Credenciales incorrectas' 
        };
      }

    } catch (error) {
      console.error(error);
      return { 
        exito: false, 
        error: 'Error conectando con el backend de Spring Boot.' 
      };
    }
  };

  // FUNCIÓN: ACTUALIZAR PERFIL DEL USUARIO
  const handleUpdateProfile = (userData: any) => {
    setCurrentUser(userData);
    authService.guardarSesion(userData);
    console.log('Perfil actualizado:', userData);
  };

  const handleForgotPassword = () => {
    console.log('🔐 Navegando a la página de recuperación de contraseña...');
    setCurrentView('forgot-password');
  };

  // MOSTRAR PÁGINA DE RECUPERAR CONTRASEÑA
  if (currentView === 'forgot-password') {
    return (
      <ForgotPassword 
        onBackToLogin={() => handleNavigate('login')}
        onNavigate={handleNavigate}
      />
    );
  }

  // MOSTRAR PÁGINA DE LOGIN
  if (!isAuthenticated || currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin} 
        onNavigate={handleNavigate}
        onForgotPassword={handleForgotPassword}
      />
    );
  }

  // DECIDIR QUÉ PÁGINA MOSTRAR
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'list':
        return (
          <ProductList
            onEdit={(id: any) => {
              setSelectedProductId(id);
              setCurrentView('edit');
            }}
            {...({ currentView, onNavigate: handleNavigate } as any)}
          />
        );
      case 'create':
        return <CreateProduct {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'categories':
        return <Categories {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'edit':
        return (
          <EditProduct
            productId={selectedProductId}
            {...({ onBack: () => handleNavigate('list'), currentView, onNavigate: handleNavigate } as any)}
          />
        );
      case 'register-entry':
        return <RegisterEntry {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'entries-list':
        return <EntriesList {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'register-exit':
        return <RegisterExit {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'exits-list':
        return <ExitsList {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'register-return':
        return <RegisterReturn {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'returns-list':
        return <ReturnsList {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'users':
        return <Users {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'alerts':
        return <StockAlerts {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'reports':
        return <Reports {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'settings':
        return <Settings {...({ currentView, onNavigate: handleNavigate } as any)} />;
      case 'profile':
        return (
          <Profile 
            currentView={currentView}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <Dashboard {...({ currentView, onNavigate: handleNavigate } as any)} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={handleNavigate}
      isAuthenticated={isAuthenticated}
      currentUser={currentUser}
    >
      {renderView()}
    </Layout>
  );
}

export default App;