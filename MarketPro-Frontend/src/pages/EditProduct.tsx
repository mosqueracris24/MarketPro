import React, { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import Toast from '../components/ui/Toast';
import productService from '../services/productService';

export default function EditProduct({ productId, onNavigate }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    const cargarProducto = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const data = await productService.obtenerProductoPorId(productId);
        setProduct(data);
      } catch (error) {
        console.error('Error cargando producto para editar:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [productId]);

  const actualizar = async (data) => {
    if (!product?.id) return;

    try {
      await productService.actualizarProducto(product.id, {
        nombre: data.name,
        sku: data.sku,
        stock: data.stock,
        precioCompra: data.purchasePrice,
        precioVenta: data.salePrice,
        fechaVencimiento: data.expiryDate || null,
        categoriaId: data.categoryId,
      });

      setToast({ message: 'Producto actualizado correctamente', type: 'success' });
      setTimeout(() => {
        onNavigate('list');
      }, 1200);
    } catch (error) {
      console.error(error);
      setToast({ message: 'No se pudo actualizar el producto', type: 'error' });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Cargando producto...</p>;
  }

  if (!product) {
    return <p className="text-center text-gray-500">No se pudo cargar el producto.</p>;
  }

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ProductForm
        product={product}
        onSubmit={actualizar}
        onCancel={() => onNavigate('list')}
      />
    </div>
  );
}
