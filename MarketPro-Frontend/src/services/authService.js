import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.sessionKey = 'marketpro_session';
  }

  async iniciarSesion(username, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password
      });

      const usuario = response.data;
      this.currentUser = usuario;
      this.guardarSesion(usuario);

      return {
        exito: true,
        usuario
      };

    } catch (error) {
      return {
        exito: false,
        error: error.response?.data?.error || error.response?.data || 'Error en login'
      };
    }
  }

  async registrarUsuario(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return {
        exito: true,
        usuario: response.data
      };
    } catch (error) {
      return {
        exito: false,
        error: error.response?.data?.error || 'Error registrando usuario'
      };
    }
  }

  cerrarSesion() {
    this.currentUser = null;
    localStorage.removeItem(this.sessionKey);
  }

  guardarSesion(usuario) {
    localStorage.setItem(this.sessionKey, JSON.stringify(usuario));
  }

  recuperarSesion() {
    const data = localStorage.getItem(this.sessionKey);
    if (!data) return null;

    this.currentUser = JSON.parse(data);
    return this.currentUser;
  }

  obtenerUsuarioActual() {
    return this.currentUser || this.recuperarSesion();
  }
}

export default new AuthService();