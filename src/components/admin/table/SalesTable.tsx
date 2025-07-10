import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { TableHeader } from "@/components/admin/table/TableHeader";
import Buscador from "@/components/Inicio/Search";
import { SalesManagementContext } from "@/contexts/admin/SalesManagement";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.4 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const statusColors: Record<string, string> = {
  Pendiente: "text-red-500 font-semibold",
  Asignado: "text-yellow-500 font-semibold",
  "En Proceso": "text-orange-500 font-semibold",
  Completado: "text-green-600 font-semibold",
};

export const SalesTable = () => {
  const context = useContext(SalesManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { sales } = context;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  if (!sales) return <div>Cargando ventas...</div>;

  const term = searchTerm.toLowerCase();
  const filteredSales = sales.filter((sale) => {
    const vendedor = sale.vendedor_nombre?.toLowerCase() || "";
    const comprador = sale.comprador_nombre?.toLowerCase() || "";
    const estado = sale.estado?.toLowerCase() || "";
    const precioProducto = String(sale.precio_producto || "").toLowerCase();
    const matchesSearch =
      vendedor.includes(term) ||
      comprador.includes(term) ||
      estado.includes(term) ||
      precioProducto.includes(term);
    const saleMonth = sale.fecha_compra?.slice(5, 7);
    const matchesMonth = selectedMonth ? saleMonth === selectedMonth : true;
    return matchesSearch && matchesMonth;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="w-full md:w-auto flex-1">
          <Buscador
            busqueda={searchTerm}
            setBusqueda={setSearchTerm}
            setPaginaActual={() => {}}
            placeholderText="Buscar por nombre, correo o rol..."
          />
        </div>

        <select
          className="h-10 px-4 py-2 rounded-xl border border-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
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

      {/* Tabla */}
      <table className="min-w-full table-auto overflow-hidden rounded-xl border border-[#48BD28]">
  {/* CABECERA BLANCA */}
  <thead className="bg-white text-black">
    <tr>
      <TableHeader className="rounded-tl-xl border-b border-[#48BD28]">Estado</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Fecha Compra</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Fecha Entrega</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Vendedor</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Transportador</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Comprador</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Precio Producto</TableHeader>
      <TableHeader className="border-b border-[#48BD28]">Precio Transporte</TableHeader>
      <TableHeader className="rounded-tr-xl border-b border-[#48BD28]">Precio Total</TableHeader>
    </tr>
  </thead>

  {/* CUERPO DE LA TABLA CON FILAS ALTERNAS VERDE/BLANCO */}
  <tbody>
    {filteredSales.length === 0 ? (
      <tr>
        <td colSpan={9} className="text-center py-4 text-gray-500">
          No hay ventas que coincidan con la búsqueda.
        </td>
      </tr>
    ) : (
      filteredSales.map((sale, index) => {
        const isLast = index === filteredSales.length - 1;
        const rowBg = index % 2 === 0 ? "bg-[#E4FBDD]" : "bg-white";
        return (
          <motion.tr
            key={sale.id_compra}
            className={`text-center text-black font-semibold border-b border-[#48BD28] ${rowBg}`}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
          >
            <td className="p-3">
              <span className={statusColors[sale.estado] || "text-gray-700"}>
                {sale.estado}
              </span>
            </td>
            <td className="p-3">{sale.fecha_compra}</td>
            <td className="p-3">{sale.fecha_entrega || "No asignado"}</td>
            <td className="p-3">{sale.vendedor_nombre}</td>
            <td className="p-3">{sale.transportador_nombre || "No asignado"}</td>
            <td className="p-3">{sale.comprador_nombre}</td>
            <td className="p-3">${sale.precio_producto}</td>
            <td className="p-3">
              {sale.precio_transporte ?? "No asignado"}
            </td>
            <td className={`p-3 font-semibold ${isLast ? "rounded-br-xl" : ""}`}>
              $
              {(
                (Number(sale.precio_transporte) || 0) +
                (Number(sale.precio_producto) || 0)
              ).toLocaleString("es-CO")}
            </td>
          </motion.tr>
        );
      })
    )}
  </tbody>
</table>

    </motion.div>
  );
};
