import { useState, useContext } from 'react';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';
import { FaTrash } from 'react-icons/fa';
import { ProductManagementContext } from '@/contexts/admin/ProductsManagement';

export const ProductTable = () => {
  const context = useContext(ProductManagementContext);
  if (!context) return <div> Error: contexto no disponible.</div>;

  const { products, unpublishProduct, deleteProduct } = context;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };
   console.log(products);
   
  if (!products || products.length === 0) {
    return <div>No hay productos disponibles.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
      <table className="min-w-full table-auto border-2 border-[#F5F0E5] rounded-xl">
        <thead className="bg-[#E4FBDD] text-black">
          <tr>
            <TableHeader>Imagen</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Cantidad</TableHeader>
            <TableHeader>Nombre</TableHeader>
            <TableHeader>Publicado</TableHeader>
            <TableHeader>Eliminar</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="text-center border-b hover:bg-gray-50">
              <td className="p-2">
                <img
                  src={product.imagen}
                  alt={product.nombre}
                  className="w-10 h-10 object-contain mx-auto"
                />
              </td>
              <td className="p-2 text-black">${product.precio_unidad}</td>
              <td className="p-2 text-black">{product.cantidad}</td>
              <td className="p-2 text-black">{product.nombre}</td>
              <td className="p-2">
                <ActionButton
                  title="Cambiar publicación"
                  onClick={() =>
                    handleConfirm(
                      `¿Estás seguro de que deseas ${product.despublicado === 1 ? 'publicar' : 'despublicar'} el producto ${product.nombre}?`,
                      () => unpublishProduct(product.id)
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
                      () => deleteProduct(product.id)
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
