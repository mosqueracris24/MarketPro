// ===============================
// TIPOS DE CATEGORÍA
// ===============================
export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

// ===============================
// TIPO DE PRODUCTO (alineado 100% con backend)
// ===============================
export interface Product {
  id?: number;

  nombre: string;
  sku: string;

  precioCompra: number;
  precioVenta: number;
  stock: number;

  fechaVencimiento?: string;

  categoria: Category;
  categoriaId: number;
}

// ===============================
// CATEGORÍAS TEMPORALES (UI)
// ⚠️ SOLO PARA DASHBOARD / REPORTES
// ⚠️ NO afecta backend
// ===============================
export const PRODUCT_CATEGORIES: string[] = [
  'Alimentos',
  'Aseo',
  'Tecnología',
  'Bebidas',
  'Hogar',
];
