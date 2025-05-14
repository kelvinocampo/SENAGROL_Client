import { useState, useContext } from 'react';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';
import { FaTrash } from 'react-icons/fa';
import { ProductManagementContext } from '@/contexts/ProductsManagement';

export const ProductTable = () => {
  const context = useContext(ProductManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { products} = context;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };

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
            <TableHeader>Vendedor</TableHeader>
            <TableHeader>Publicado</TableHeader>
            <TableHeader>Eliminar</TableHeader>
            <TableHeader>Nombre</TableHeader>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="text-center border-b hover:bg-gray-50">
              <td className="p-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 object-contain mx-auto"
                />
              </td>
              <td className="p-2 text-black">${product.price}</td>
              <td className="p-2 text-black">{product.quantity}</td>
              <td className="p-2 text-black">{product.sellerName}</td>
              <td className="p-2">
                <ActionButton
                  title="Cambiar publicación"
                  onClick={() =>
                    handleConfirm(
                      `¿Estás seguro de que deseas ${product.isPublished ? 'despublicar' : 'publicar'} el producto ${product.name}?`,
                      () => togglePublished(product.id)
                    )
                  }
                >
                  {product.isPublished ? 'despublicar' : 'publicar'}
                </ActionButton>
              </td>
              <td className="p-2">
                <ActionButton
                  title="Eliminar producto"
                  onClick={() =>
                    handleConfirm(
                      `¿Estás seguro de que deseas eliminar el producto ${product.name}?`,
                      () => deleteProduct(product.id)
                    )
                  }
                >
                  <FaTrash />
                </ActionButton>
              </td>
              <td className="p-2 text-black">{product.name}</td>
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
