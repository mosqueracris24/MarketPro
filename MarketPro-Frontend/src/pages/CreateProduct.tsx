import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import Toast from '../components/ui/Toast';

interface CreateProductProps {
  onNavigate: (view: string) => void;
}

export default function CreateProduct({ onNavigate }: CreateProductProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const mostrarToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const guardar = async (data: any) => {
    try {
      const productoBackend = {
        nombre: data.name,
        sku: data.sku,
        precioCompra: data.purchasePrice,
        precioVenta: data.salePrice,
        stock: data.stock,
        fechaVencimiento: data.expiryDate || null,
        categoria: {
          id: data.categoryId
        }
      };

      const response = await fetch('http://localhost:8080/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoBackend)
      });

      if (!response.ok) {
        throw new Error('Error al guardar en el servidor');
      }

      mostrarToast('¡Producto creado exitosamente!', 'success');
      setTimeout(() => {
        onNavigate('list');
      }, 1200);

    } catch (error) {
      console.error(error);
      mostrarToast('Error al guardar el producto. Intente nuevamente.', 'error');
    }
  };

  return (
    <div className="relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ProductForm onSubmit={guardar} onCancel={() => onNavigate('list')} />
    </div>
  );
}