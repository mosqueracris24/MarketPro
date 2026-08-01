import React, { useEffect, useState } from 'react';
import { Ban, CheckCircle2, Trash2, PencilLine, UserPlus, ShieldAlert } from 'lucide-react';
import userService from '../services/userService';

interface UsersProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Users: React.FC<UsersProps> = ({ currentView, onNavigate }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Cajero',
    isActive: true,
  });

  const loadUsers = async () => {
    try {
      const data = await userService.obtenerUsuarios();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
      setAlert({ type: 'error', message: 'Completa todos los campos obligatorios.' });
      return;
    }

    setLoading(true);
    try {
      await userService.crearUsuario(form);
      setAlert({ type: 'success', message: 'Usuario creado correctamente.' });
      setShowForm(false);
      setForm({ username: '', email: '', password: '', role: 'Cajero', isActive: true });
      await loadUsers();
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'No se pudo crear el usuario.' });
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = async (user: any) => {
    if (user.role === 'Administrador' && user.username === 'admin') {
      setAlert({ type: 'error', message: 'El superusuario no puede ser suspendido.' });
      return;
    }

    try {
      await userService.actualizarUsuario(user.id, {
        ...user,
        isActive: !user.isActive,
      });
      setAlert({ type: 'success', message: user.isActive ? 'Usuario suspendido.' : 'Usuario activado.' });
      await loadUsers();
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'No se pudo actualizar el estado del usuario.' });
    }
  };

  const deleteUser = async (user: any) => {
    if (user.role === 'Administrador' && user.username === 'admin') {
      setAlert({ type: 'error', message: 'El superusuario no puede ser eliminado.' });
      return;
    }

    try {
      await userService.eliminarUsuario(user.id);
      setAlert({ type: 'success', message: 'Usuario eliminado.' });
      await loadUsers();
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'No se pudo eliminar el usuario.' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de usuarios</h1>
          <p className="text-sm text-gray-500">Administra accesos, estados y permisos del sistema.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          <UserPlus size={16} />
          {showForm ? 'Cancelar' : 'Crear usuario'}
        </button>
      </div>

      {alert && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {alert.message}
        </div>
      )}

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              placeholder="Nombre de usuario"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              placeholder="Correo electrónico"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Contraseña"
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Administrador</option>
              <option>Bodega</option>
              <option>Cajero</option>
            </select>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            <span>Estado inicial: activo</span>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2 font-semibold text-white hover:bg-accent/90 disabled:opacity-70"
            >
              {loading ? 'Guardando...' : 'Guardar usuario'}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => {
              const isProtected = u.role === 'Administrador' && u.username === 'admin';
              return (
                <tr key={u.id} className="text-sm text-gray-700">
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.isActive ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toggleUser(u)}
                        className={`rounded-lg p-2 ${u.isActive ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        title={u.isActive ? 'Suspender' : 'Activar'}
                      >
                        {u.isActive ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                      </button>

                      <button
                        onClick={() => onNavigate('profile')}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                        title="Actualizar"
                      >
                        <PencilLine size={16} />
                      </button>

                      <button
                        onClick={() => deleteUser(u)}
                        disabled={isProtected}
                        className={`rounded-lg p-2 ${isProtected ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                        title={isProtected ? 'No se puede eliminar' : 'Eliminar'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;