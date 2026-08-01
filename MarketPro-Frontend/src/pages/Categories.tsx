import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tags } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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

  // 🔹 Cargar categorías desde backend
  const cargarCategorias = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // 🔹 Crear categoría
  const crearCategoria = async () => {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion }),
    });
    limpiarFormulario();
    cargarCategorias();
  };

  // 🔹 Actualizar categoría
  const actualizarCategoria = async () => {
    await fetch(`${API_URL}/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion }),
    });
    limpiarFormulario();
    cargarCategorias();
  };

  // 🔹 Eliminar categoría
  const eliminarCategoria = async (id: number) => {
    if (confirm('¿Eliminar esta categoría?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      cargarCategorias();
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
            <Button onClick={editingId ? actualizarCategoria : crearCategoria}>
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
            <th>Nombre</th>
            <th>Descripción</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} className="border-b">
              <td>{cat.nombre}</td>
              <td>{cat.descripcion || '—'}</td>
              <td className="text-right flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingId(cat.id);
                    setNombre(cat.nombre);
                    setDescripcion(cat.descripcion || '');
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
