import React, { useState } from 'react';
import ProductForm from '../components/ProductForm';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface CreateProductProps {
  onNavigate: (view: string) => void;
}

export default function CreateProduct({ onNavigate }: CreateProductProps) {
  // Estado para la notificación flotante (Toast)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const mostrarToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    // Ocultar automáticamente la notificación después de 3.5 segundos
    setTimeout(() => {
      setToast(null);
    }, 3500);
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
          id: 4 // ID de categoría existente en tu base de datos
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

      // Notificación moderna de éxito en la esquina superior derecha
      mostrarToast('¡Producto creado exitosamente!', 'success');
      
      // Esperar un breve instante para que el usuario alcance a ver el aviso antes de cambiar de vista
      setTimeout(() => {
        onNavigate('list');
      }, 1500);

    } catch (error) {
      console.error(error);
      mostrarToast('Error al guardar el producto. Intente nuevamente.', 'error');
    }
  };

  return (
    <div className="relative">
      {/* NOTIFICACIÓN FLOTANTE (TOAST) PROFESIONAL EN LA ESQUINA SUPERIOR DERECHA */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 animate-bounce-short">
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle size={20} />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {toast.type === 'success' ? '¡Éxito!' : 'Atención'}
            </p>
            <p className="text-xs text-gray-500">{toast.message}</p>
          </div>
        </div>
      )}

      {/* FORMULARIO DE PRODUCTOS */}
      <ProductForm
        onSubmit={guardar}
        onCancel={() => onNavigate('list')}
      />
    </div>
  );
}