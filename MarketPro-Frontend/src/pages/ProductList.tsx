import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, PackageSearch } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import productService from '../services/productService';

interface Product {
  id: number;
  nombre: string;
  sku: string;
  stock: number;
  precioCompra: number;
  precioVenta: number;
  fechaVencimiento?: string;
  categoria: {
    id: number;
    nombre: string;
  };
}

interface ProductListProps {
  onNavigate: (view: string) => void;
  onEdit?: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onNavigate, onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const cargarProductos = async () => {
    try {
      const data = await productService.listarProductos();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;

    try {
      await productService.eliminarProducto(id);
      setToast({ message: 'Producto eliminado correctamente', type: 'success' });
      cargarProductos();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      setToast({ message: 'No se pudo eliminar el producto', type: 'error' });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando productos...</p>;
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Button onClick={() => onNavigate('create')}>
          <Plus size={18} />
          Nuevo Producto
        </Button>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Compra</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Venta</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{product.nombre}</div>
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {product.categoria.nombre}
                    </span>
                  </td>

                  <td className="px-6 py-4">{product.stock}</td>

                  <td className="px-6 py-4">
                    ${product.precioCompra.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    ${product.precioVenta.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(product.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Edit size={16} /> Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <PackageSearch size={24} className="text-gray-400" />
                    <span>No hay productos registrados</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
