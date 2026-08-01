import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

const productService = {
  async listarProductos() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  async crearProducto(producto) {
    const payload = {
      nombre: producto.nombre,
      sku: producto.sku,
      stock: producto.stock,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      fechaVencimiento: producto.fechaVencimiento || null,
      categoriaId: producto.categoriaId,
    };

    const response = await axios.post(API_URL, payload);
    return response.data;
  },

  async eliminarProducto(id) {
    await axios.delete(`${API_URL}/${id}`);
  },

  async obtenerProductoPorId(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  async actualizarProducto(id, producto) {
    const payload = {
      nombre: producto.nombre,
      sku: producto.sku,
      stock: producto.stock,
      precioCompra: producto.precioCompra,
      precioVenta: producto.precioVenta,
      fechaVencimiento: producto.fechaVencimiento || null,
      categoriaId: producto.categoriaId,
    };

    const response = await axios.put(`${API_URL}/${id}`, payload);
    return response.data;
  },
};

export default productService;
