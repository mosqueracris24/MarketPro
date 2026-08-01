import ProductForm from '../components/ProductForm';

export default function EditProduct({ product, onNavigate }) {

  const actualizar = async (data) => {
    await fetch(`http://localhost:8080/api/productos/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    onNavigate('list');
  };

  return (
    <ProductForm
      product={product}
      onSubmit={actualizar}
      onCancel={() => onNavigate('list')}
    />
  );
}
