import { useState, useContext, useEffect } from "react";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { ActionButton } from "@/components/admin/table/ActionButton";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { FaTrash } from "react-icons/fa";
import { MiniMap } from "@/components/admin/common/MiniMap";
import { ProductManagementContext } from "@/contexts/admin/ProductsManagement";
import { motion, AnimatePresence } from "framer-motion";
import Buscador from "@/components/Inicio/Search";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const ProductTable = () => {
  const context = useContext(ProductManagementContext);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>(
    () => async () => {}
  );
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Agregado

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

  const { products, unpublishProduct, publish, deleteProduct, fetchProducts } = context;

  if (!products || products.length === 0) {
    return (
      <div className="text-yellow-600 font-semibold text-center mt-4">
        No hay productos disponibles en este momento. Por favor, intente más tarde.
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-2xl p-4">
      {/* 🔍 Buscador */}
      <Buscador
        busqueda={searchTerm}
        setBusqueda={setSearchTerm}
        setPaginaActual={() => {}}
        placeholderText="Buscar por nombre de producto..."
        containerClassName="mb-4"
        inputClassName="w-full px-4 py-2 rounded-full border border-[#48BD28] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6dd850]"
      />

      <table className="min-w-full table-auto overflow-hidden rounded-2xl border border-[#48bd28]">
        <thead className="bg-[#E4FBDD] border-[#48BD28] text-black">
          <tr>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Cantidad</TableHeader>
            <TableHeader>Cantidad Mínima</TableHeader>
            <TableHeader>Ubicación</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Publicar</TableHeader>
            <TableHeader>Eliminar</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-transparent bg-[#E4FBDD] border  border-[#48BD28] rounded-xl overflow-hidden">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className={`text-center text-black font-semibold border-[#48BD28] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#E4FBDD] "
                }`}
              >
                <td className="p-3">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-12 h-12 object-contain mx-auto rounded-full"
                  />
                </td>
                <td className="p-3">{product.nombre}</td>
                <td className="p-3">{product.descripcion}</td>
                <td className="p-3">{product.cantidad}</td>
                <td className="p-3">{product.cantidad_minima_compra}</td>
                <td className="p-3">
                  <MiniMap lat={product.latitud} lng={product.longitud} />
                </td>
                <td className="p-3">${product.precio_unidad}</td>
                <td className="p-3">
                  <ActionButton
                    className={`${
                      product.despublicado === 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-black"
                    } rounded-full px-4 py-1 text-sm font-semibold`}
                    onClick={() =>
                      handleConfirm(
                        `¿Estás seguro de que deseas ${
                          product.despublicado === 1 ? "publicar" : "despublicar"
                        } el producto ${product.nombre}?`,
                        async () => {
                          if (product.despublicado === 1) {
                            await publish(product.id);
                            setConfirmOpen(false);
                            setTimeout(() => showMessage("Producto publicado."), 200);
                          } else {
                            await unpublishProduct(product.id);
                            setConfirmOpen(false);
                            setTimeout(() => showMessage("Producto despublicado."), 200);
                          }
                        }
                      )
                    }
                  >
                    {product.despublicado === 1 ? "Publicar" : "Ocultar"}
                  </ActionButton>
                </td>
                <td className="p-3">
                  <ActionButton
                    className="bg-red-600 text-white rounded-full px-3 py-1"
                    onClick={() => {
                      if (product.eliminado === 1) return;
                      handleConfirm(
                        `¿Eliminar el producto ${product.nombre}?`,
                        async () => {
                          const result = await deleteProduct(product.id);
                          if (!result?.success) {
                            setTimeout(() => showMessage("Error al eliminar."), 200);
                          } else {
                            setTimeout(() => showMessage("Producto eliminado."), 200);
                          }
                          await fetchProducts();
                          setConfirmOpen(false);
                        }
                      );
                    }}
                    disabled={product.eliminado === 1}
                  >
                    <FaTrash />
                  </ActionButton>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>

      {/* Diálogos */}
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
