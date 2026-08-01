const API_URL = 'http://localhost:8080/api/usuarios';

// OBTENER USUARIOS
const obtenerUsuarios = async () => {
  const response = await fetch(API_URL);
  return await response.json();
};

// CREAR USUARIO
const crearUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    throw new Error('Error al crear usuario');
  }

  return await response.json();
};

// ACTUALIZAR
const actualizarUsuario = async (id, usuario) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(usuario),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar usuario');
  }

  return await response.json();
};

// ELIMINAR
const eliminarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }

  return true;
};

// EXPORT
export default {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};