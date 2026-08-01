import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, Download, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { sampleProducts } from '../data/products';
import { formatDate } from '../utils/formatDate';

const Reports: React.FC = () => {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 🔹 categorías únicas a partir de productos
  const categories = useMemo(() => {
    return Array.from(new Set(sampleProducts.map(p => p.category)));
  }, []);

  const filteredProducts = useMemo(() => {
    return sampleProducts.filter(product => {
      const matchCategory = !selectedCategory || product.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileSpreadsheet size={24} />
          <h1 className="text-2xl font-bold">Reportes de Inventario</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            label="Buscar"
            placeholder="Nombre del producto"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline">
            <Download size={18} /> PDF
          </Button>
          <Button>
            <Download size={18} /> Excel
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Producto</th>
              <th className="p-2 text-left">Categoría</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Compra</th>
              <th className="p-2 text-left">Venta</th>
              <th className="p-2 text-left">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">${p.purchasePrice}</td>
                <td className="p-2">${p.salePrice}</td>
                <td className="p-2">
                  {p.expiryDate ? formatDate(p.expiryDate) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Reports;
