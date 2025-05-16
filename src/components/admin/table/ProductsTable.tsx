import { useState, useContext } from "react";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { ActionButton } from "@/components/admin/table/ActionButton";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { FaTrash } from "react-icons/fa";
import { MiniMap } from "@/components/admin/common/MiniMap";
import { ProductManagementContext } from "@/contexts/admin/ProductsManagement";
// Modal para mostrar solo mensajes sin confirmación


export const ProductTable = () => {
  const context = useContext(ProductManagementContext);

  if (!context) return <div>Error: contexto no disponible.</div>;

  const { products, unpublishProduct, publish, deleteProduct, fetchProducts } =
    context;

  // Estado para ConfirmDialog (confirmación con acción)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>(
    () => async () => {}
  );

  // Estado para MessageDialog (solo mensajes informativos)
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  // Abrir confirm dialog con acción
  const handleConfirm = (message: string, action: () => Promise<void>) => {
    setConfirmMessage(message);
    setOnConfirm(() => async () => {
      await action();
    });
    setConfirmOpen(true);
  };

  // Mostrar solo mensaje informativo
  const showMessage = (msg: string) => {
    setMessage(msg);
    setMessageOpen(true);
  };

  if (!products || products.length === 0) {
    return <div>No hay productos disponibles.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg border border-gray-200">
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
          {products.map((product) => (
            <tr
              key={product.id}
              className="text-center hover:bg-gray-50 border-b border-[#E5E8EB]"
            >
              <td className="p-2">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-10 h-10 object-contain mx-auto"
                />
              </td>
              <td className="p-2 text-black whitespace-normal max-w-xs">
                {product.nombre}
              </td>
              <td className="p-2 text-black whitespace-normal max-w-xs">
                {product.descripcion}
              </td>
              <td className="p-2 text-black">{product.cantidad}</td>
              <td className="p-2 text-black">{product.cantidad_minima_compra}</td>
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
                        product.despublicado === 1 ? "publicar" : "despublicar"
                      } el producto ${product.nombre}?`,
                      async () => {
                        if (product.despublicado === 1) {
                          await publish(product.id);
                        } else {
                          await unpublishProduct(product.id);
                        }
                        setConfirmOpen(false);
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
          // Pequeño delay para asegurar que el confirmDialog se cierre antes de abrir mensaje
          setTimeout(() => showMessage("Respuesta inválida del servidor."), 200);
          return;
        }
    
        
        if (result.success) {
          setConfirmOpen(false);
          setTimeout(() => showMessage(result.message), 200);
          return;
        }
       
        // Éxito: cerrar confirm y refrescar lista
        setConfirmOpen(false);
        await fetchProducts();
      }
    )
  }
>
  <FaTrash />
</ActionButton>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Confirmación */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        message={confirmMessage}
      />

      {/* Modal Mensajes */}
      <MessageDialog
        isOpen={messageOpen}
        onClose={() => setMessageOpen(false)}
        message={message}
      />
    </div>
  );
};
