import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import Footer from "@components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { MessageDialog } from "@/components/admin/common/MessageDialog";

export const DeleteProduct = () => {
  const { id_delete_product } = useParams();
  const navigate = useNavigate();
  const { products }: any = useContext(ProductManagementContext);

  const [productExists, setProductExists] = useState<boolean | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // ✅

  useEffect(() => {
    const checkProductExistence = () => {
      if (!id_delete_product) {
        setProductExists(false);
        return;
      }

      const productId = Number(id_delete_product);
      const exists = products.some((p: any) => p.id_producto === productId);
      setProductExists(exists);

      if (!exists) {
        setError("El producto que intentas eliminar no existe");
        const timer = setTimeout(() => {
          navigate("/MisProductos");
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    checkProductExistence();
  }, [id_delete_product, products, navigate]);

  const handleCancel = () => {
    navigate("/MisProductos");
  };

  const handleDelete = async () => {
    if (!id_delete_product || !productExists) return;

    setIsDeleting(true);
    setError(null);

    try {
      await ProductManagementService.deleteProduct(Number(id_delete_product));
      setShowSuccessMessage(true); // ✅ Mostrar mensaje
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Ocurrió un error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  const sectionVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
  };

  const renderContent = () => (
    <AnimatePresence mode="wait">
      {productExists === false && (
        <motion.section
          key="not-found"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1 items-center justify-center"
        >
          <h2 className="sm:text-4xl text-2xl font-lightbold text-red-500">Producto no encontrado</h2>
          <p className="text-lg">{error}</p>
          <p>Redirigiendo a la lista de productos...</p>
        </motion.section>
      )}

      {productExists === null && (
        <motion.section
          key="checking"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1 items-center justify-center"
        >
          <motion.div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48BD28]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          />
          <p>Verificando producto...</p>
        </motion.section>
      )}

      {productExists === true && (
        <motion.section
          key="confirm-delete"
          variants={sectionVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1"
        >
          <h2 className="sm:text-4xl text-2xl font-lightbold">Eliminar Producto</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex flex-col gap-4">
            <p className="text-lg">¿Estás seguro que deseas eliminar este producto?</p>
            <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <motion.button
                onClick={handleDelete}
                disabled={isDeleting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-2 border rounded-xl border-gray-300 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-medium ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isDeleting ? "Eliminando..." : "Confirmar Eliminación"}
              </motion.button>

              <motion.button
                onClick={handleCancel}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="p-2 border rounded-xl border-black bg-white hover:bg-gray-100 cursor-pointer text-black font-medium"
              >
                Cancelar
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{renderContent()}</main>
      <Footer />

      {/* ✅ Mostrar mensaje de éxito */}
      <MessageDialog
        isOpen={showSuccessMessage}
        onClose={() => navigate("/MisProductos")}
        message="Producto eliminado correctamente"
      />
    </div>
  );
};
