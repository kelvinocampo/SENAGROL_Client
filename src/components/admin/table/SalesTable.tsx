import { useContext, useState } from 'react';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { CiCircleMore } from "react-icons/ci";
import { SearchBar } from '@/components/admin/table/SearchUsers'; // Asegúrate de que esta ruta sea correcta
import { SalesManagementContext } from '@/contexts/admin/SalesManagement'; // Este contexto debe proveer las ventas

export const SalesTable = () => {
  const context = useContext(SalesManagementContext);
   if (!context) return <div>Error: contexto no disponible.</div>;
  
   const { sales} = context;

  const [searchTerm, setSearchTerm] = useState('');

  if (!sales) return <div>Cargando ventas...</div>;

  const filteredSales = sales.filter((sale) =>
    sale.vendedor_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

      <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5] bg-[E4FBDD]">
          <tr className="bg-[#E4FBDD]">
            <TableHeader>Vendedor</TableHeader>
            <TableHeader>Transportador</TableHeader>
            <TableHeader>Comprador</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Ver mas</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay ventas que coincidan con la búsqueda.
              </td>
            </tr>
          ) : (
            filteredSales.map((sale) => (
              <tr
                key={sale.id_compra}
                className="text-center hover:bg-gray-50 border-2 border-[#E5E8EB]"
              >
                <td className="p-2 text-left whitespace-normal break-words max-w-[180px]">
                  {sale.vendedor_nombre}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.transportador_nombre}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.comprador_nombre}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.precio_producto}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  <CiCircleMore />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
