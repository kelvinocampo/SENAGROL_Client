import { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { LocationPicker } from "@/components/ProductsManagement/LocationPicker";
import { Input } from "@/components/Input";
import Footer from "@components/footer";

import { motion } from "framer-motion";

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

  const productEdit = useMemo(() => {
    return products.find((p: any) => p.id_producto == id_edit_product);
  }, [id_edit_product, products]);

  const handleCancel = () => {
    navigate('/MisProductos');
  }

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

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

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 }
    }),
  };

  return (
    <motion.section
        className="font-[Fredoka] min-h-screen w-full py-8 px-16 flex flex-col gap-8 items-center justify-center bg-white"
  initial="hidden"
  animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="sm:text-4xl text-2xl font-lightbold"
        variants={inputVariants}
        custom={0}
      >
        {isEditMode ? 'Editar' : 'Crear'} Producto
      </motion.h2>

      {errors.general && (
        <motion.div
          className="text-red-500 text-sm"
          variants={inputVariants}
          custom={1}
        >
          {errors.general}
        </motion.div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 max-w-[600px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={inputVariants} custom={2}>
          <Input
            label="Nombre del producto*"
            type="text"
            name="name"
            placeholder="Ingrese el nombre del producto"
            value={product.nombre}
            onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
            error={errors.nombre}
          />
        </motion.div>

        <motion.div variants={inputVariants} custom={3} className="w-full">
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
        </motion.div>

        <motion.div
          variants={inputVariants}
          custom={4}
          className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap"
        >
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
        </motion.div>

        <motion.div variants={inputVariants} custom={5} className="flex flex-col gap-2">
          <label className="block text-sm font-medium">Ubicación*</label>
          <LocationPicker
            setLocation={setLocation}
            initialLocation={location}
            required
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </motion.div>

        <motion.div
          variants={inputVariants}
          custom={6}
          className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap"
        >
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
            label="Descuento (opcional)"
            type="text"
            name="discount"
            placeholder="Ingrese descuento"
            value={product.descuento?.toString() || ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^\d+$/.test(val)) {
                setProduct({ ...product, descuento: val === '' ? undefined : parseInt(val, 10) });
              }
            }}
            error={errors.descuento}
          />
        </motion.div>

        <motion.div variants={inputVariants} custom={7}>
          <label className="block mb-2 font-medium">Imagen (PNG, JPG)*</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-[#48BD28] file:text-white
              hover:file:bg-[#379e1b]"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Vista previa"
              className="mt-4 max-h-40 rounded-lg object-contain border"
            />
          )}
        </motion.div>

        <motion.div variants={inputVariants} custom={8} className="flex gap-4">
          <button
            type="submit"
            className="rounded-xl bg-[#48BD28] px-6 py-3 text-white hover:bg-[#379e1b] transition"
          >
            {isEditMode ? 'Guardar cambios' : 'Crear producto'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-gray-400 px-6 py-3 text-gray-700 hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
        </motion.div>
 <div className="max-w-[600px] mx-auto">
  <Footer/> 
</div>
      </motion.form>
    </motion.section>
        
  );
  
};
