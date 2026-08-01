const API_URL = "http://localhost:8080/api";

export async function obtenerProductos() {
  const response = await fetch(`${API_URL}/productos`);
  return response.json();
}

export async function crearProducto(producto: any) {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(producto)
  });

  return response.json();
}
