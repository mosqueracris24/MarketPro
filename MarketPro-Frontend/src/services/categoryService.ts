const API_URL = 'http://localhost:8080/api/categorias';

const categoryService = {

  async listar() {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al cargar categorías');
    }
    return await response.json();
  }

};

export default categoryService;