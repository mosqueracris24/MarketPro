import React, { useEffect, useState } from 'react';
import {
  Package,
  AlertTriangle,
  UserCheck,
  UserX,
  PlusCircle,
  Search,
  FileText,
  Settings,
  BarChart3,
  PieChart,
} from 'lucide-react';
import productService from '../services/productService';
import userService from '../services/userService';

interface DashboardProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-sm border border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value.toLocaleString()}</p>
      </div>
      <div className={`${color} opacity-80`}>
        {icon}
      </div>
    </div>
  </div>
);

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${color} rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left w-full`}
  >
    <div className="flex flex-col items-center text-center">
      <div className="text-primary mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ currentView, onNavigate }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [productData, userData] = await Promise.all([
          productService.listarProductos(),
          userService.obtenerUsuarios(),
        ]);

        setProducts(Array.isArray(productData) ? productData : []);
        setUsers(Array.isArray(userData) ? userData : []);
      } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
        setProducts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => Number(p.stock ?? 0) < 50).length;
  const activeUsers = users.filter((u) => u.isActive !== false).length;
  const inactiveUsers = users.filter((u) => u.isActive === false).length;

  const categoryMap = new Map<string, number>();
  products.forEach((product) => {
    const categoryName = product.categoria?.nombre || product.categoria || 'Sin categoría';
    categoryMap.set(categoryName, (categoryMap.get(categoryName) ?? 0) + 1);
  });

  const categoryData = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
  }));

  const maxCategoryCount = Math.max(...categoryData.map((item) => item.count), 1);

  const userStatusData = [
    { label: 'Activos', value: activeUsers, color: 'bg-accent' },
    { label: 'Inactivos', value: inactiveUsers, color: 'bg-primary' },
  ];

  const totalUsers = Math.max(activeUsers + inactiveUsers, 1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Resumen general del sistema de inventarios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Total de Productos"
          value={loading ? 0 : totalProducts}
          icon={<Package size={32} />}
          color="text-primary"
          bgColor="bg-white"
        />
        <MetricCard
          title="Stock Bajo"
          value={loading ? 0 : lowStockProducts}
          icon={<AlertTriangle size={32} />}
          color="text-error-500"
          bgColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Usuarios Activos"
          value={loading ? 0 : activeUsers}
          icon={<UserCheck size={32} />}
          color="text-accent"
          bgColor="bg-white"
        />
        <MetricCard
          title="Usuarios Inactivos"
          value={loading ? 0 : inactiveUsers}
          icon={<UserX size={32} />}
          color="text-primary"
          bgColor="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Inventario por Categoría</h2>
          </div>
          {categoryData.length === 0 ? (
            <p className="text-sm text-gray-500">No hay productos cargados desde el backend.</p>
          ) : (
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    <span className="text-sm text-gray-500">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Estado de Usuarios</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#003366 0deg ${(activeUsers / totalUsers) * 360}deg, #0E8B83 ${(activeUsers / totalUsers) * 360}deg 360deg)`,
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-sm">
                  <span className="text-lg font-bold text-gray-700">{totalUsers}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 w-full">
              {userStatusData.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-accent' : 'bg-primary'}`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          title="Registrar Producto"
          icon={<PlusCircle size={32} />}
          onClick={() => onNavigate('create')}
          color="bg-white hover:bg-primary/5"
        />
        <QuickAction
          title="Buscar Producto"
          icon={<Search size={32} />}
          onClick={() => onNavigate('list')}
          color="bg-white hover:bg-accent/5"
        />
        <QuickAction
          title="Generar Reporte"
          icon={<FileText size={32} />}
          onClick={() => onNavigate('reports')}
          color="bg-white hover:bg-primary/5"
        />
        <QuickAction
          title="Configuración"
          icon={<Settings size={32} />}
          onClick={() => onNavigate('settings')}
          color="bg-white hover:bg-accent/5"
        />
      </div>
    </div>
  );
};

export default Dashboard;