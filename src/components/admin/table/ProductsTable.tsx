import { useState, useContext, useEffect } from "react";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { ActionButton } from "@/components/admin/table/ActionButton";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { FaTrash } from "react-icons/fa";
import { MiniMap } from "@/components/admin/common/MiniMap";
import { ProductManagementContext } from "@/contexts/admin/ProductsManagement";
import { motion, AnimatePresence } from "framer-motion";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// ...importaciones omitidas para brevedad

export const ProductTable = () => {
  const context = useContext(ProductManagementContext);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>(
    () => async () => {}
  );

  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleConfirm = (message: string, action: () => Promise<void>) => {
    setConfirmMessage(message);
    setOnConfirm(() => async () => {
      await action();
    });
    setConfirmOpen(true);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setMessageOpen(true);
  };

  // Flujo Interno 1: Contexto no disponible
  useEffect(() => {
    if (!context) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [context]);

  if (!context) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        Error: contexto no disponible. Reintentando cargar...
      </div>
    );
  }

  const { products, unpublishProduct, publish, deleteProduct, fetchProducts } =
    context;

  // Flujo Interno 2: Lista de productos vacía
  if (!products || products.length === 0) {
    return (
      <div className="text-yellow-600 font-semibold text-center mt-4">
        No hay productos disponibles en este momento. Por favor, intente más
        tarde.
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full table-auto border-2 border-[#F5F0E5] rounded-xl">
        <thead className="bg-[#E4FBDD] text-black">
          <tr>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Cantidad</TableHeader>
            <TableHeader>Cantidad Mínima</TableHeader>
            <TableHeader>Ubicación</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Despublicar</TableHeader>
            <TableHeader>Eliminar</TableHeader>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {products.map((product) => (
              <motion.tr
                key={product.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center hover:bg-gray-50 border-b border-[#E5E8EB]"
              >
                <td className="p-2">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-10 h-10 object-contain mx-auto rounded-full"
                  />
                </td>
                <td className="p-2 text-black whitespace-normal max-w-xs">
                  {product.nombre}
                </td>
                <td className="p-2 text-black whitespace-normal max-w-xs">
                  {product.descripcion}
                </td>
                <td className="p-2 text-black">{product.cantidad}</td>
                <td className="p-2 text-black">
                  {product.cantidad_minima_compra}
                </td>
                <td className="p-2">
                  <MiniMap lat={product.latitud} lng={product.longitud} />
                </td>
                <td className="p-2 text-black">${product.precio_unidad}</td>
                <td className="p-2">
                  <ActionButton
                    title="Cambiar publicación"
                    onClick={() =>
                      handleConfirm(
                        `¿Estás seguro de que deseas ${
                          product.despublicado === 1
                            ? "publicar"
                            : "despublicar"
                        } el producto ${product.nombre}?`,
                        async () => {
                          if (product.despublicado === 1) {
                            await publish(product.id);
                            setConfirmOpen(false);
                            setTimeout(
                              () =>
                                showMessage(
                                  "Producto ha sido publicado exitosamente."
                                ),
                              200
                            );
                          } else {
                            await unpublishProduct(product.id);
                            setConfirmOpen(false);
                            setTimeout(
                              () =>
                                showMessage(
                                  "Producto ha sido despublicado exitosamente."
                                ),
                              200
                            );
                          }
                        }
                      )
                    }
                  >
                    {product.despublicado === 1 ? "Publicar" : "Despublicar"}
                  </ActionButton>
                </td>
                <td className="p-2">
                  <ActionButton
                    title="Eliminar producto"
                    onClick={() =>
                      handleConfirm(
                        `¿Estás seguro de que deseas eliminar el producto ${product.nombre}?`,
                        async () => {
                          const result = await deleteProduct(product.id);

                          if (
                            !result ||
                            typeof result.success !== "boolean" ||
                            typeof result.message !== "string"
                          ) {
                            setConfirmOpen(false);
                            setTimeout(
                              () =>
                                showMessage("Respuesta inválida del servidor."),
                              200
                            );
                            return;
                          }

                          if (result.success) {
                            setConfirmOpen(false);
                            setTimeout(
                              () =>
                                showMessage(
                                  "Se eliminó el producto exitosamente."
                                ),
                              200
                            );
                            return;
                          }

                          setConfirmOpen(false);
                          await fetchProducts();
                        }
                      )
                    }
                  >
                    <FaTrash />
                  </ActionButton>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Confirmación */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ConfirmDialog
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={onConfirm}
              message={confirmMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensaje */}
      <AnimatePresence>
        {messageOpen && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MessageDialog
              isOpen={messageOpen}
              onClose={() => setMessageOpen(false)}
              message={message}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
