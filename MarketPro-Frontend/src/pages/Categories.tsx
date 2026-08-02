import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tags } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toast from '../components/ui/Toast';

interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

const API_URL = 'http://localhost:8080/api/categorias';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mostrarToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const cargarCategorias = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const crearCategoria = async () => {
    if (!nombre.trim()) {
      mostrarToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      });
      if (!res.ok) throw new Error('No se pudo crear la categoría');
      mostrarToast('Categoría creada correctamente', 'success');
      limpiarFormulario();
      await cargarCategorias();
    } catch {
      mostrarToast('No se pudo crear la categoría', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualizarCategoria = async () => {
    if (!nombre.trim()) {
      mostrarToast('El nombre de la categoría es obligatorio', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar la categoría');
      mostrarToast('Categoría actualizada correctamente', 'success');
      limpiarFormulario();
      await cargarCategorias();
    } catch {
      mostrarToast('No se pudo actualizar la categoría', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminarCategoria = async (id: number) => {
    const confirmar = window.confirm('¿Deseas eliminar esta categoría? Solo será posible si no tiene productos asociados.');
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const mensaje = errorData.message || 'No se pudo eliminar la categoría';
        throw new Error(
          mensaje.includes('producto') || mensaje.includes('productos')
            ? 'No se puede eliminar la categoría porque tiene productos asociados.'
            : mensaje
        );
      }
      mostrarToast('Categoría eliminada correctamente', 'success');
      await cargarCategorias();
    } catch (error: any) {
      mostrarToast(error.message || 'No se pudo eliminar la categoría', 'error');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Tags /> Categorías
        </h1>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Nueva
        </Button>
      </div>

      {(isAdding || editingId !== null) && (
        <div className="bg-gray-50 p-4 rounded mb-4">
          <Input label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <Input label="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <div className="flex gap-2 mt-2">
            <Button onClick={editingId ? actualizarCategoria : crearCategoria} isLoading={isSubmitting}>
              <Save size={16} /> Guardar
            </Button>
            <Button variant="ghost" onClick={limpiarFormulario}>
              <X size={16} /> Cancelar
            </Button>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Nombre</th>
            <th className="text-left py-3">Descripción</th>
            <th className="text-right py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-b">
              <td className="py-3">{cat.nombre}</td>
              <td className="py-3">{cat.descripcion || '—'}</td>
              <td className="py-3 text-right flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(cat.id);
                    setNombre(cat.nombre);
                    setDescripcion(cat.descripcion || '');
                    setIsAdding(false);
                  }}
                >
                  <Edit2 size={16} />
                </Button>
                <Button variant="ghost" onClick={() => eliminarCategoria(cat.id)}>
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
