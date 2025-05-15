import { useState, useContext } from 'react';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';
import { FaTrash } from 'react-icons/fa';
import { MiniMap } from '@/components/admin/common/MiniMap';
import { ProductManagementContext } from '@/contexts/admin/ProductsManagement';

export const ProductTable = () => {
  const context = useContext(ProductManagementContext);
  if (!context) return <div> Error: contexto no disponible.</div>;

  const { products, unpublishProduct, publish, deleteProduct } = context;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => { });

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };

  if (!products || products.length === 0) {
    return <div>No hay productos disponibles.</div>;
  }

  return (
    <div className="">
      <table className="min-w-full table-auto border-2 border-[#F5F0E5] rounded-xl">
        <thead className="bg-[#E4FBDD] text-black">
          <tr>
            <TableHeader>imagen</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Descripción</TableHeader>
            <TableHeader>Cantidad</TableHeader>
            <TableHeader>Cantidad Minima</TableHeader>
            <TableHeader>ubicación</TableHeader>
            <TableHeader>precio</TableHeader>
            <TableHeader>despublicar</TableHeader>
            <TableHeader>Eliminar</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="min-w-full table-auto rounded-xl border-2 border-[#E5E8EB]">
              <td className="p-2">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-10 h-10 object-contain mx-auto"
                />
              </td>
              <td className="p-2 text-black">{product.nombre}</td>
              <td className="p-2 text-black">{product.descripcion}</td>
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
                      `¿Estás seguro de que deseas ${product.despublicado === 1 ? 'publicar' : 'despublicar'} el producto ${product.nombre}?`,
                      () => {
                        console.log(
                          `ID del producto a ${product.despublicado === 1 ? 'publicar' : 'despublicar'}:`,
                          product.id
                        );

                        if (product.despublicado === 1) {
                          publish(product.id);
                        } else {
                          unpublishProduct(product.id);
                        }
                      }
                    )
                  }
                >
                  {product.despublicado === 1 ? 'Publicar' : 'Despublicar'}
                </ActionButton>

              </td>
              <td className="p-2">
                <ActionButton
                  title="Eliminar producto"
                  onClick={() =>
                    handleConfirm(
                      `¿Estás seguro de que deseas eliminar el producto ${product.nombre}?`,
                      () =>  deleteProduct(product.id)
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

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        message={confirmMessage}
      />
    </div>
  );
};
