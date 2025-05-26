import { useContext, useState } from 'react';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { SearchBar } from '@/components/admin/table/SearchUsers';
import { SalesManagementContext } from '@/contexts/admin/SalesManagement';

export const SalesTable = () => {
  const context = useContext(SalesManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { sales } = context;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  if (!sales) return <div>Cargando ventas...</div>;

  const filteredSales = sales.filter((sale) => {
    const term = searchTerm.toLowerCase();
    const vendedor = sale.vendedor_nombre?.toLowerCase() || '';
    const comprador = sale.comprador_nombre?.toLowerCase() || '';
    const estado = sale.estado?.toLowerCase() || '';
    const precioProducto = String(sale.precio_producto || '').toLowerCase();

    const matchesSearch =
      vendedor.includes(term) ||
      comprador.includes(term) ||
      estado.includes(term) ||
      precioProducto.includes(term);

    const saleMonth = sale.fecha_compra?.slice(5, 7); // extrae el mes (formato 'YYYY-MM-DD')
    const matchesMonth = selectedMonth ? saleMonth === selectedMonth : true;

    return matchesSearch && matchesMonth;
  });

  return (
    <div>
      {/* Filtro por texto y mes */}
    <div className="flex gap-4 mb-4 items-center">
  <SearchBar
    searchTerm={searchTerm}
    onSearch={setSearchTerm}
  />
  <select
    className="w-40 p-2 rounded border border-gray-300 bg-[#E4FBDD] h-10"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
  >
    <option value="">Todos los meses</option>
    <option value="01">Enero</option>
    <option value="02">Febrero</option>
    <option value="03">Marzo</option>
    <option value="04">Abril</option>
    <option value="05">Mayo</option>
    <option value="06">Junio</option>
    <option value="07">Julio</option>
    <option value="08">Agosto</option>
    <option value="09">Septiembre</option>
    <option value="10">Octubre</option>
    <option value="11">Noviembre</option>
    <option value="12">Diciembre</option>
  </select>
</div>


      {/* Tabla de ventas */}
      <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5] bg-[#E4FBDD]">
          <tr>
            <TableHeader>Vendedor</TableHeader>
            <TableHeader>Transportador</TableHeader>
            <TableHeader>Comprador</TableHeader>
            <TableHeader>Precio</TableHeader>
            <TableHeader>Fecha Compra</TableHeader>
            <TableHeader>Fecha Entrega</TableHeader>
            <TableHeader>Precio Transportador</TableHeader>
            <TableHeader>Precio Producto</TableHeader>
            <TableHeader>Estado</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
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
                  {sale.transportador_nombre || 'No asignado'}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.comprador_nombre}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  ${(
                    (Number(sale.precio_transporte) || 0) +
                    (Number(sale.precio_producto) || 0)
                  ).toFixed(2)}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.fecha_compra}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.fecha_entrega || 'No asignado'}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.precio_transporte ?? 'No asignado'}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.precio_producto}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {sale.estado}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
