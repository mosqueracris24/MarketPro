import React, { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import userService from '../services/userService';

interface UsersProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Users: React.FC<UsersProps> = ({ currentView, onNavigate }) => {

  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Cajero',
    isActive: true
  });

  // 🔹 CARGAR USUARIOS
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

  // 🔹 CREAR USUARIO
  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
      alert('Completa todos los campos');
      return;
    }

    try {
      await userService.crearUsuario(form);

      alert('✅ Usuario creado');

      setShowForm(false);
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'Cajero',
        isActive: true
      });

      loadUsers();

    } catch (error) {
      console.error(error);
      alert('❌ Error al crear usuario');
    }
  };

  // 🔹 ACTIVAR / DESACTIVAR
  const toggleUser = async (user: any) => {
    try {
      await userService.actualizarUsuario(user.id, {
        ...user,
        isActive: !user.isActive
      });

      loadUsers();

    } catch (error) {
      console.error(error);
      alert('❌ Error actualizando usuario');
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Crear Usuario'}
        </Button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded mb-6 space-y-2">

          <input
            placeholder="Nombre"
            className="w-full p-2 border"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            placeholder="Email"
            className="w-full p-2 border"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Contraseña"
            type="password"
            className="w-full p-2 border"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="w-full p-2 border"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option>Administrador</option>
            <option>Bodega</option>
            <option>Cajero</option>
          </select>

          <Button onClick={handleCreate}>
            Guardar Usuario
          </Button>

        </div>
      )}

      {/* TABLA */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-center border-t">

              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isActive ? 'Activo' : 'Inactivo'}</td>

              <td>
                <Button onClick={() => toggleUser(u)}>
                  {u.isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Users;