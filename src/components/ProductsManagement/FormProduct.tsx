import { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { LocationPicker } from "@/components/ProductsManagement/LocationPicker";
import { Input } from "@/components/Input";

type ProductFormData = {
  id_producto?: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  cantidad_minima_compra: number;
  precio_unidad: number;
  descuento?: number;
  imagen?: string;
  latitud?: number;
  longitud?: number;
};

export const Form = () => {
  const { id_edit_product } = useParams();
  const navigate = useNavigate();
  const { products }: any = useContext(ProductManagementContext);

  const isEditMode = Boolean(id_edit_product);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Memoizar la búsqueda del producto a editar
  const productEdit = useMemo(() => {
    return products.find((p: any) => p.id_producto == id_edit_product);
  }, [id_edit_product, products]);

  const handleCancel = () => {
    navigate('/MisProductos');
  }

  // Redirigir a creación si en modo edición pero el producto no existe
  useEffect(() => {
    if (isEditMode && !productEdit && products.length > 0) {
      navigate('/MisProductos/Crear', { replace: true });
    }
  }, [isEditMode, productEdit, products, navigate]);

  const [product, setProduct] = useState<ProductFormData>({
    nombre: '',
    descripcion: '',
    cantidad: 0,
    cantidad_minima_compra: 0,
    precio_unidad: 0,
  });

  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Inicialización del formulario
  useEffect(() => {
    if (!isEditMode) {
      setIsLoading(false);
      return;
    }

    if (productEdit) {
      const initialLocation = productEdit.latitud && productEdit.longitud
        ? {
          lat: Number(productEdit.latitud),
          lng: Number(productEdit.longitud)
        }
        : null;

      setProduct({
        nombre: productEdit.nombre || '',
        descripcion: productEdit.descripcion || '',
        cantidad: Number(productEdit.cantidad) || 0,
        cantidad_minima_compra: Number(productEdit.cantidad_minima_compra) || 0,
        precio_unidad: Number(productEdit.precio_unidad) || 0,
        descuento: productEdit.descuento ? Number(productEdit.descuento) : undefined,
        imagen: productEdit.imagen || ''
      });

      // Establecer la imagen del producto como vista previa
      if (productEdit.imagen) {
        setImagePreview(productEdit.imagen);
      }

      setLocation(initialLocation);
      setIsLoading(false);
    }
  }, [isEditMode, productEdit]);

  const handleIntegerChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ProductFormData) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setProduct({
        ...product,
        [field]: value === '' ? 0 : parseInt(value, 10)
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // Crear URL para la vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Actualizar el estado del producto
      setProduct(prev => ({ ...prev, imagen: URL.createObjectURL(file) }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
    if (!product.descripcion.trim()) newErrors.descripcion = 'Descripción es requerida';
    if (product.cantidad <= 0) newErrors.cantidad = 'Cantidad debe ser mayor a 0';
    if (product.cantidad_minima_compra <= 0) newErrors.cantidad_minima_compra = 'Cantidad mínima inválida';
    if (product.precio_unidad <= 0) newErrors.precio_unidad = 'Precio debe ser mayor a 0';
    if (!location) newErrors.location = 'Debes seleccionar una ubicación';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const productData = {
        ...product,
        latitud: location?.lat,
        longitud: location?.lng,
        // No incluimos la propiedad imagen aquí, se manejará en el servicio
      };

      if (isEditMode && id_edit_product) {
        await ProductManagementService.updateProduct(
          Number(id_edit_product),
          productData,
          imageFile || undefined
        );
      } else {
        if (!imageFile) {
          throw new Error('La imagen es requerida para crear un producto');
        }
        await ProductManagementService.createProduct(
          productData,
          imageFile
        );
      }

      navigate('/MisProductos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setErrors({ ...errors, general: 'Error al guardar el producto' });
    }
  };

  if (isLoading) {
    return (
      <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48BD28]"></div>
        <p>Cargando producto...</p>
      </section>
    );
  }

  return (
    <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
      <h2 className="sm:text-4xl text-2xl font-lightbold">
        {isEditMode ? 'Editar' : 'Crear'} Producto
      </h2>

      {errors.general && (
        <div className="text-red-500 text-sm">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-[600px]">
        <Input
          label="Nombre del producto*"
          type="text"
          name="name"
          placeholder="Ingrese el nombre del producto"
          value={product.nombre}
          onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
          error={errors.nombre}
        />

        <div className="w-full">
          <label className="block text-sm font-medium">Descripción*</label>
          <textarea
            name="description"
            className={`w-full mt-1 p-2 border rounded-xl focus:border-[#48BD28] focus:outline-none ${errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
            value={product.descripcion}
            onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
          )}
        </div>

        <div className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap">
          <Input
            label="Cantidad (kg)*"
            type="text"
            name="quantity"
            placeholder="Ingrese la cantidad del producto"
            value={product.cantidad.toString()}
            onChange={(e) => handleIntegerChange(e, 'cantidad')}
            error={errors.cantidad}
          />

          <Input
            label="Cantidad mínima de compra (kg)*"
            type="text"
            name="minimun_quantity"
            placeholder="Ingrese la cantidad mínima de compra"
            value={product.cantidad_minima_compra.toString()}
            onChange={(e) => handleIntegerChange(e, 'cantidad_minima_compra')}
            error={errors.cantidad_minima_compra}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium">Ubicación*</label>
          <LocationPicker
            setLocation={setLocation}
            initialLocation={location}
            required
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap">
          <Input
            label="Precio por unidad*"
            type="text"
            name="price"
            placeholder="Ingrese el precio por unidad"
            value={product.precio_unidad.toString()}
            onChange={(e) => handleIntegerChange(e, 'precio_unidad')}
            error={errors.precio_unidad}
          />

          <Input
            label="Descuento porcentual (Opcional)"
            type="number"
            name="discount"
            placeholder="Ingrese el descuento porcentual"
            value={product.descuento || ''}
            onChange={(e) => setProduct({
              ...product,
              descuento: e.target.value === '' ? undefined : Number(e.target.value)
            })}
            min="0"
            max="100"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium">Imagen{!isEditMode && '*'}</label>

          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="flex items-center gap-4 mt-2">
            <label
              htmlFor="image-upload"
              className="px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50"
            >
              {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </label>

            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="h-20 w-20 object-cover rounded"
                />
                {isEditMode && productEdit?.imagen === imagePreview && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Original
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full p-2 border rounded-xl border-gray-300 bg-[#48BD28] hover:bg-[#3da023] cursor-pointer text-black font-medium"
        >
          {isEditMode ? 'Actualizar' : 'Crear'} Producto
        </button>
        <button
          onClick={handleCancel}
          className="w-full p-2 border rounded-xl border-black bg-white cursor-pointer text-black font-medium"
        >Cancelar</button>
      </form>
    </section>
  );
};