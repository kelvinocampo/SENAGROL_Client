import { motion } from "framer-motion";
import { useState, useContext } from "react";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { ProductManagementContext } from "@/contexts/ProductsManagement";

export const ProductCard = ({ product }: any) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const { setProducts }: any = useContext(ProductManagementContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAvailable = !product.despublicado;

  const precioConDescuento = product.descuento
    ? (product.precio_unidad * (1 - product.descuento / 100)).toFixed(0)
    : product.precio_unidad;

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await ProductManagementService.deleteProduct(product.id_producto);

      // Eliminar producto del contexto
      setProducts((prev: any[]) =>
        prev.filter((p) => p.id_producto !== product.id_producto)
      );

      // Mostrar mensaje de éxito
      setIsMessageOpen(true);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <motion.div
        className="w-[220px] h-[350px] bg-white rounded-xl shadow-md flex flex-col overflow-hidden transition-all"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Imagen */}
        <div className="relative w-full h-[140px]">
          <img
            src={product.imagen}
            alt={product.descripcion}
            className="w-full h-full object-cover rounded-t-xl"
          />
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-md ${
              isAvailable ? "bg-[#00A650] text-white" : "bg-[#CE0000] text-white"
            }`}
          >
            {isAvailable ? "Disponible" : "No disponible"}
          </motion.span>
        </div>

        {/* Contenido */}
        <div className="px-4 py-3 flex flex-col items-center text-center gap-1 flex-1">
          <p className="text-base font-bold text-gray-800 line-clamp-1">
            {product.nombre}
          </p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.descripcion}
          </p>
          <p className="font-semibold text-[#FF0000] mt-1 text-sm">
            Antes: <span>${product.precio_unidad}</span> <br />
            Ahora: <span>${precioConDescuento}</span>
          </p>

          {/* Botones */}
          <div className="flex gap-2 mt-auto w-full justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#5ABA41] hover:bg-green-600 text-white px-4 py-1 rounded-md font-semibold text-sm shadow-sm"
              onClick={() =>
                window.location.assign(`/MisProductos/Editar/${product.id_producto}`)
              }
            >
              Editar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FF0000] hover:bg-red-600 text-white px-4 py-1 rounded-md font-semibold text-sm shadow-sm"
              onClick={() => setIsConfirmOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Confirmación */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar producto"
        message="¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
      />

      {/* Mensaje de éxito */}
      <MessageDialog
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        message="El producto fue eliminado correctamente."
      />
    </>
  );
};
