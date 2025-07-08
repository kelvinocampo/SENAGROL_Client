import { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { LocationPicker } from "@/components/ProductsManagement/LocationPicker";
import { Input } from "@/components/Input";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { motion } from "framer-motion";
import { MessageDialog } from "@/components/admin/common/MessageDialog";

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
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [product, setProduct] = useState<ProductFormData>({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    cantidad_minima_compra: 0,
    precio_unidad: 0,
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const productEdit = useMemo(
    () => products.find((p: any) => p.id_producto == id_edit_product),
    [id_edit_product, products]
  );

  useEffect(() => {
    if (isEditMode && productEdit) {
      setProduct({
        nombre: productEdit.nombre || "",
        descripcion: productEdit.descripcion || "",
        cantidad: Number(productEdit.cantidad) || 0,
        cantidad_minima_compra: Number(productEdit.cantidad_minima_compra) || 0,
        precio_unidad: Number(productEdit.precio_unidad) || 0,
        descuento: productEdit.descuento
          ? Number(productEdit.descuento)
          : undefined,
        imagen: productEdit.imagen || "",
      });
      if (productEdit.latitud && productEdit.longitud) {
        setLocation({
          lat: Number(productEdit.latitud),
          lng: Number(productEdit.longitud),
        });
      }
      setIsLoading(false);
    } else if (!isEditMode) {
      setIsLoading(false);
    }
  }, [isEditMode, productEdit]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const imageURL = URL.createObjectURL(file);
      setProduct((prev) => ({ ...prev, imagen: imageURL }));
    }
  };

  const handleIntegerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProductFormData
  ) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setProduct({
        ...product,
        [field]: value === "" ? 0 : parseInt(value, 10),
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!product.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!product.descripcion.trim())
      newErrors.descripcion = "Descripción es requerida";
    if (product.cantidad <= 0)
      newErrors.cantidad = "Cantidad debe ser mayor a 0";
    if (product.cantidad_minima_compra <= 0)
      newErrors.cantidad_minima_compra = "Cantidad mínima inválida";
    if (product.cantidad_minima_compra > product.cantidad)
      newErrors.cantidad_minima_compra =
        "No puede ser mayor que la cantidad total";
    if (product.precio_unidad <= 0)
      newErrors.precio_unidad = "Precio debe ser mayor a 0";
    if (
      product.descuento !== undefined &&
      (isNaN(product.descuento) ||
        product.descuento < 0 ||
        product.descuento > 100)
    ) {
      newErrors.descuento =
        "El descuento debe estar entre 0 y 100 (se permiten decimales)";
    }
    if (!location) newErrors.location = "Debes seleccionar una ubicación";
    if (!isEditMode && !imageFile) newErrors.imagen = "La imagen es requerida";
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
          imageFile
        );
        setDialogMessage("El producto fue actualizado exitosamente.");
      } else {
        await ProductManagementService.createProduct(productData, imageFile!);
        setDialogMessage("El producto fue creado exitosamente.");
      }
      setIsDialogOpen(true);
    } catch {
      setErrors({
        general: "Error al guardar el producto. Intente nuevamente.",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    navigate("/MisProductos");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  if (isLoading) return <div className="text-center p-6">Cargando...</div>;

  return (
    <>
      <motion.section
        className="font-[Fredoka] min-h-screen w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl p-6 sm:p-10 flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Imagen + Nombre + Descripción */}
          <motion.div
            variants={inputVariants}
            custom={1}
            className="w-full flex flex-col sm:flex-row gap-6"
          >
            <div className="relative w-full sm:w-[420px] h-[200px] bg-[#f4fcf1] border-2 border-dashed border-[#48BD28] rounded-xl flex items-center justify-center overflow-hidden">
              {product.imagen ? (
                <>
                  <img
                    src={product.imagen}
                    alt="Vista previa"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <label
                    className="absolute bottom-3 bg-[#48BD28] hover:bg-[#379e1b] text-white font-medium px-4 py-2 rounded-xl cursor-pointer z-10"
                    title="Cambiar imagen"
                  >
                    Seleccionar archivo
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <>
                  <MdOutlinePhotoSizeSelectActual className="absolute text-[100px] text-[#48BD28] opacity-20" />
                  <label className="z-10 cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#48BD28] hover:bg-[#379e1b] text-white font-semibold rounded-md">
                    Seleccionar archivo
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </>
              )}
              {errors.imagen && (
                <p className="absolute bottom-2 text-red-500 text-sm mt-1">
                  {errors.imagen}
                </p>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <Input
                label="Nombre del producto*"
                type="text"
                name="nombre"
                value={product.nombre}
                onChange={(e) =>
                  setProduct({ ...product, nombre: e.target.value })
                }
                error={errors.nombre}
              />
              <div>
                <label className="block text-sm font-medium mb-1 text-[#2E7D32]">
                  Descripción*
                </label>
                <textarea
                  className={`w-full h-[100px] p-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#48BD28] ${
                    errors.descripcion ? "border-red-500" : "border-gray-300"
                  }`}
                  value={product.descripcion}
                  onChange={(e) =>
                    setProduct({ ...product, descripcion: e.target.value })
                  }
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.descripcion}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Otros campos */}
          <motion.div
            variants={inputVariants}
            custom={2}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          >
            <Input
              label="Cantidad (kg)*"
              type="text"
              name="cantidad"
              value={product.cantidad.toString()}
              onChange={(e) => handleIntegerChange(e, "cantidad")}
              error={errors.cantidad}
            />
            <Input
              label="Cantidad mínima de compra (kg)*"
              type="text"
              name="cantidad_minima_compra"
              value={product.cantidad_minima_compra.toString()}
              onChange={(e) => handleIntegerChange(e, "cantidad_minima_compra")}
              error={errors.cantidad_minima_compra}
            />
            <Input
              label="Precio por unidad*"
              type="text"
              name="precio_unidad"
              value={product.precio_unidad.toString()}
              onChange={(e) => handleIntegerChange(e, "precio_unidad")}
              error={errors.precio_unidad}
            />
            <Input
              label="Descuento (opcional)"
              type="text"
              name="descuento"
              value={product.descuento?.toString() || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d*\.?\d*$/.test(val)) {
                  setProduct({
                    ...product,
                    descuento: val === "" ? undefined : parseFloat(val),
                  });
                }
              }}
              error={errors.descuento}
            />
          </motion.div>

          {/* Ubicación */}
          <motion.div variants={inputVariants} custom={3} className="w-full">
            <label className="block text-sm font-medium mb-2 text-[#2E7D32]">
              Ubicación*
            </label>
            <LocationPicker
              className="h-50"
              setLocation={setLocation}
              initialLocation={location}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </motion.div>

          {/* Botones */}
          <motion.div
            variants={inputVariants}
            custom={4}
            className="flex flex-col sm:flex-row gap-4 justify-end w-full"
          >
            <button
              type="button"
              onClick={() => navigate("/MisProductos")}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#D9D9D9] hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-[#48BD28] hover:bg-[#379e1b] text-white font-semibold"
            >
              {isEditMode ? "Guardar cambios" : "Crear producto"}
            </button>
          </motion.div>

          {errors.general && <p className="text-red-500">{errors.general}</p>}
        </motion.form>
      </motion.section>

      <MessageDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        message={dialogMessage}
      />
    </>
  );
};
