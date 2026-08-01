import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Tags,
  Percent,
  Bell,
  Users,
  Globe,
  Shield,
  Database,
  Palette,
  ChevronRight,
  Save,
  Check,
  Plus,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { USER_ROLES } from '../types/user';

interface SettingsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  background: string;
  preview: {
    primary: string;
    accent: string;
    background: string;
  };
  isCustom?: boolean;
}

const DEFAULT_THEMES: ColorTheme[] = [
  {
    id: 'default',
    name: 'Azul Corporativo (Por defecto)',
    primary: '#003366',
    accent: '#0E8B83',
    background: '#F5F5F5',
    preview: { primary: '#003366', accent: '#0E8B83', background: '#F5F5F5' }
  },
  {
    id: 'forest',
    name: 'Verde Bosque',
    primary: '#1B4332',
    accent: '#52B788',
    background: '#F8F9FA',
    preview: { primary: '#1B4332', accent: '#52B788', background: '#F8F9FA' }
  }
];

const Settings: React.FC<SettingsProps> = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>(DEFAULT_THEMES);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      setSelectedTheme(savedTheme);
    }
  }, []);

  const renderContent = () => {
    switch (activeSection) {

      case 'appearance':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Apariencia</h2>
            <p className="text-sm text-gray-600">
              Configuración visual del sistema.
            </p>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categorías de Productos</h2>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Las categorías se gestionan desde el módulo de Categorías.
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Esta sección no utiliza datos quemados y se conecta al backend.
              </p>
            </div>
          </div>
        );

      case 'taxes':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Impuestos</h2>
            <Input label="IVA General (%)" type="number" defaultValue="19" />
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        );

      case 'alerts':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Alertas</h2>
            <Input label="Stock mínimo" type="number" defaultValue="50" />
            <Button className="mt-4">
              <Save size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        );

      case 'roles':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Roles</h2>
            {USER_ROLES.map(role => (
              <div key={role} className="p-2 bg-gray-50 rounded mb-2">
                {role}
              </div>
            ))}
          </div>
        );

      case 'global':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Parámetros Globales</h2>
            <Input label="Nombre del negocio" defaultValue="MarketPro" />
          </div>
        );

      case 'security':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
            <p className="text-sm text-gray-600">
              Configuración de seguridad del sistema.
            </p>
          </div>
        );

      case 'backup':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Backup</h2>
            <Button variant="outline">Crear backup</Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <SettingsIcon size={24} />
        <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          {[
            ['appearance', 'Apariencia', Palette],
            ['categories', 'Categorías', Tags],
            ['taxes', 'Impuestos', Percent],
            ['alerts', 'Alertas', Bell],
            ['roles', 'Roles', Users],
            ['global', 'Global', Globe],
            ['security', 'Seguridad', Shield],
            ['backup', 'Backup', Database],
          ].map(([key, label, Icon]: any) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full flex items-center gap-2 p-3 rounded ${
                activeSection === key ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Settings;
