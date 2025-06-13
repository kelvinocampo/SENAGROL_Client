import { useState, useEffect } from "react";
import { QrCode, Search } from "lucide-react";
import { VentasService, Venta } from "../../services/VentasService";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@components/footer";

export const SellsView = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const cargarVentas = async () => {
      try {
        const data = await VentasService.obtenerVentasPorUsuario();
        const ventasFormateadas = data.map((v) => ({
          ...v,
          precio_producto: parseFloat(v.precio_producto as unknown as string),
          precio_transporte: v.precio_transporte
            ? parseFloat(v.precio_transporte as unknown as string)
            : 0,
        }));
        setVentas(ventasFormateadas);
      } catch (err) {
        setError("Error al cargar las ventas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarVentas();
  }, []);

  const ventasFiltradas = ventas.filter((venta) =>
    venta.producto_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="font-[Fredoka] min-h-screen flex flex-col bg-[#f4fcf1]">
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#205116]">
            Mis Ventas
          </h2>

          {/* Buscador */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 relative"
          >
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar mis ventas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-base bg-white"
            />
          </motion.div>

          {/* Tabla o mensajes */}
          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-600"
            >
              Cargando ventas...
            </motion.p>
          ) : error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500"
            >
              {error}
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto w-full text-sm"
            >
              <table className="min-w-full text-xs text-left border shadow-md rounded-lg overflow-hidden">
                <thead className="bg-[#caf5bd] text-black uppercase text-xs">
                  <tr>
                    <th className="px-3 py-2">Fecha compra</th>
                    <th className="px-3 py-2">Fecha entrega</th>
                    <th className="px-3 py-2">Producto</th>
                    <th className="px-3 py-2">Cantidad</th>
                    <th className="px-3 py-2">Precio Unidad</th>
                    <th className="px-3 py-2">Precio Total</th>
                    <th className="px-3 py-2">Costo transporte</th>
                    <th className="px-3 py-2">Vendedor</th>
                    <th className="px-3 py-2">Transportador</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2">QR/Código</th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#ccc] text-[13px]">
                  {ventasFiltradas.length > 0 ? (
                    ventasFiltradas.map((c, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-[#e4fbdd] transition-colors"
                      >
                        <td className="px-3 py-2">{c.fecha_compra}</td>
                        <td className="px-3 py-2">{c.fecha_entrega}</td>
                        <td className="px-3 py-2">{c.producto_nombre}</td>
                        <td className="px-3 py-2">{c.cantidad}</td>
                        <td className="px-3 py-2">
                          ${c.precio_producto.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          $
                          {(
                            c.cantidad * c.precio_producto +
                            c.precio_transporte
                          ).toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          ${c.precio_transporte.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">{c.vendedor_nombre}</td>
                        <td className="px-3 py-2">{c.transportador_nombre}</td>
                        <td className="px-3 py-2">{c.estado}</td>
                        <td className="px-3 py-2">
                          {c.estado === "Asignada" && (
                            <div className="flex items-center gap-1">
                              <Link
                                to={`/venta/qr/${encodeURIComponent(c.id_compra)}`}
                              >
                                <QrCode
                                  size={16}
                                  className="text-black cursor-pointer hover:text-green-700"
                                />
                              </Link>
                              <Link
                                to={`/venta/codigo/${encodeURIComponent(c.id_compra)}`}
                                className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-2 py-1 rounded text-xs"
                              >
                                Código
                              </Link>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td
                        colSpan={11}
                        className="text-center text-gray-500 py-4"
                      >
                        No se encontraron ventas con ese nombre.
                      </td>
                    </motion.tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
        
      </main>
      <Footer></Footer>
    </div>
  );
};
