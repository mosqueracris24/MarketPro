import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Save, X, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { Product } from '../types/product';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  categoryId: z.number().min(1, 'Seleccione una categoría'),
  purchasePrice: z.number().min(0),
  salePrice: z.number().min(0),
  stock: z.number().min(0),
  expiryDate: z.string().nullable(),
  image: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Props {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<Props> = ({ product, onSubmit, onDelete, onCancel }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; nombre: string }[]>([]);

  const defaultValues = product
    ? {
        name: product.nombre || product.name || '',
        sku: product.sku || '',
        categoryId: product.categoria?.id ?? product.categoryId ?? product.categoriaId ?? 0,
        purchasePrice: product.precioCompra ?? product.purchasePrice ?? 0,
        salePrice: product.precioVenta ?? product.salePrice ?? 0,
        stock: product.stock ?? 0,
        expiryDate: (product.fechaVencimiento || product.expiryDate)
          ? format(new Date(product.fechaVencimiento || product.expiryDate), 'yyyy-MM-dd')
          : null,
        image: product.image || '',
      }
    : {
        name: '',
        sku: '',
        categoryId: 0,
        purchasePrice: 0,
        salePrice: 0,
        stock: 0,
        expiryDate: null,
        image: '',
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const watchedSalePrice = watch('salePrice');
  const watchedPurchasePrice = watch('purchasePrice');

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categorias');
        const data = await response.json();
        setCategories(data);
        if (!product && data.length > 0) {
          setValue('categoryId', data[0].id);
        }
      } catch (error) {
        console.error('Error cargando categorías', error);
      }
    };

    cargarCategorias();
  }, [product, setValue]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Archivo inválido');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setValue('image', result);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    if (data.salePrice < data.purchasePrice) {
      alert('El precio de venta no puede ser menor');
      return;
    }

    setIsSubmitting(true);
    await onSubmit(data);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* FORMULARIO */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">

          <Input
            label="Nombre"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="SKU"
            {...register('sku')}
            error={errors.sku?.message}
          />

          <div>
            <label className="text-sm font-medium">Categoría</label>
            <select
              {...register('categoryId', { valueAsNumber: true })}
              className="w-full mt-1 rounded-md border border-gray-300 bg-white p-2.5 text-sm shadow-sm focus:border-primary focus:outline-none"
            >
              <option value={0}>Seleccione una categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.categoryId?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <Input
            label="Precio Compra"
            type="number"
            {...register('purchasePrice', { valueAsNumber: true })}
          />

          <Input
            label="Precio Venta"
            type="number"
            {...register('salePrice', { valueAsNumber: true })}
          />

          <Input
            label="Stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
          />

          <Input
            label="Fecha Vencimiento"
            type="date"
            {...register('expiryDate')}
            className="md:col-span-2"
          />

        </div>

        {/* IMAGEN */}
        <div className="border rounded-lg p-4 flex flex-col items-center justify-center">

          <p className="text-sm font-medium mb-3">Imagen</p>

          {imagePreview ? (
            <img
              src={imagePreview}
              className="w-32 h-32 object-cover rounded-md mb-3"
            />
          ) : (
            <div className="w-32 h-32 border-2 border-dashed flex items-center justify-center rounded-md mb-3">
              <ImageIcon />
            </div>
          )}

          <label className="cursor-pointer text-sm text-blue-600 flex items-center gap-2">
            <Upload size={16} />
            Subir
            <input type="file" hidden onChange={handleImageUpload} />
          </label>

        </div>

      </div>

      {/* ALERTA */}
      {watchedSalePrice < watchedPurchasePrice && (
        <div className="text-yellow-600 text-sm">
          ⚠️ Estás vendiendo por debajo del costo
        </div>
      )}

      {/* BOTONES */}
      <div className="flex justify-end gap-3 border-t pt-4">

        <Button variant="ghost" onClick={onCancel}>
          <X size={16} /> Cancelar
        </Button>

        {product && onDelete && (
          <Button variant="outline" onClick={onDelete}>
            <Trash2 size={16} /> Eliminar
          </Button>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          <Save size={16} /> Guardar
        </Button>

      </div>

    </form>
  );
};

export default ProductForm;