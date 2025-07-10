import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { VentasService, Venta } from "../../services/VentasService";
import { getCodigoCompra } from "../../services/CodigoQRService";
import { motion } from "framer-motion";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { ModalQr } from "@components/ProductsManagement/codigoqr";
import { ModalCodigo } from "@components/ProductsManagement/codigounico";

type DialogTarget = { type: "qr" | "code"; id: string };

const getEstadoColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "pendiente":
      return "text-[#FF0000] ";
    case "asignada":
      return "text-[#C59400]";
    case "completada":
      return "text-[#28A745] ";
    case "En Proceso":
      return "text-[#C59400]";
    default:
      return "text-gray-700 ";
  }
};

export const SellsView = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [dialogTarget, setDialogTarget] = useState<DialogTarget | null>(null);
  const [codigoQr, setCodigoQr] = useState<string | null>(null);
  const [isModalQrOpen, setIsModalQrOpen] = useState(false);
  const [isModalCodigoOpen, setIsModalCodigoOpen] = useState(false);
  const [codigoTargetId, setCodigoTargetId] = useState<string | null>(null);

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
          descuento: v.descuento ? parseFloat(v.descuento as unknown as string) : 0,
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

  const normalizar = (val: unknown) => val ? val.toString().toLowerCase() : "";

  const ventasFiltradas = ventas.filter((v) => {
    const texto = normalizar(busqueda);
    return (
      normalizar(v.comprador_nombre).includes(texto) ||
      normalizar(v.producto_nombre).includes(texto) ||
      normalizar(v.fecha_compra).includes(texto) ||
      normalizar(v.estado).includes(texto) ||
      normalizar(v.fecha_entrega).includes(texto)
    );
  });

  const handleConfirm = () => {
    if (!dialogTarget) return;
    const { type, id } = dialogTarget;
    if (type === "qr") {
      obtenerCodigoQR(id);
    } else {
      setCodigoTargetId(id);
      setIsModalCodigoOpen(true);
    }
  };

  const obtenerCodigoQR = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const codigo = await getCodigoCompra(id, token);
      setCodigoQr(codigo);
      setIsModalQrOpen(true);
    } catch (error) {
      console.error("Error al obtener QR:", error);
    }
  };

  return (
    <div className="font-[Fredoka] min-h-screen flex flex-col">
      <main className="flex-1 flex justify-center items-start py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <h2 className="text-3xl sm:text-4xl font-medium mb-6 text-[#0D141C]">
            Mis Ventas
          </h2>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 relative"
          >
            <Search className="absolute  left-3 top-3 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por comprador, producto, fecha compra, fecha entrega o estado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 p-3 rounded-full border border-gray-300  shadow-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-base bg-white"
            />
          </motion.div>

          {loading ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-600">
              Cargando ventas...
            </motion.p>
          ) : error ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500">
              {error}
            </motion.p>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full overflow-x-auto rounded-xl border border-[#48bd28] shadow bg-white"
            >
              <table className="w-full min-w-[720px] table-auto text-sm text-center">
                <thead className="bg-white text-black font-bold">
                  <tr>
                    {["Estado", "Fecha compra", "Fecha entrega", "Comprador", "Transportador", "Producto", "Cantidad", "Precio Unidad", "Costo transporte", "Precio Total", "QR/Código"].map((titulo, idx) => (
                      <th key={idx} className="px-4 py-2 border-y border-[#48bd28]">{titulo}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ventas.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={11} className="text-center text-gray-500 py-4">
                        Aún no tienes ventas registradas.
                      </td>
                    </motion.tr>
                  ) : ventasFiltradas.length === 0 ? (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td colSpan={11} className="text-center text-gray-500 py-4">
                        No se encontraron ventas con ese criterio de búsqueda.
                      </td>
                    </motion.tr>
                  ) : (
                    ventasFiltradas.map((c, i) => {
                      const precioConDescuento = c.precio_producto * (1 - (c.descuento || 0) / 100);
                      const total = c.cantidad * precioConDescuento + c.precio_transporte;

                      return (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={i % 2 === 0 ? "bg-[#f4fcf1]" : "bg-white"}
                        >
                          <td className={`px-4 py-2 border-y border-[#48bd28] font-medium ${getEstadoColor(c.estado)}`}>{c.estado}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.fecha_compra}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.fecha_entrega}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.comprador_nombre}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.transportador_nombre}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.producto_nombre}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">{c.cantidad}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">${precioConDescuento.toFixed(2)}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">${c.precio_transporte.toFixed(2)}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">${total.toFixed(2)}</td>
                          <td className="px-4 py-2 border-y border-[#48bd28]">
                            {c.estado === "Asignada" && (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setDialogTarget({ type: "qr", id: c.id_compra.toString() })}
                                  className="py-1 px-5 rounded bg-[#FACC15] text-black"
                                >
                                  QR
                                </button>
                                <button
                                  onClick={() => setDialogTarget({ type: "code", id: c.id_compra.toString() })}
                                  className="bg-[#3B82F6] text-white px-5 py-1 rounded"
                                >
                                  Código
                                </button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Modales */}
      <ModalQr
        isOpen={isModalQrOpen}
        onClose={() => setIsModalQrOpen(false)}
        codigo={codigoQr}
      />

      <ModalCodigo
        isOpen={isModalCodigoOpen}
        onClose={() => {
          setIsModalCodigoOpen(false);
          setCodigoTargetId(null);
        }}
        id_compra={codigoTargetId}
      />

      <ConfirmDialog
        isOpen={dialogTarget !== null}
        onClose={() => setDialogTarget(null)}
        onConfirm={handleConfirm}
        title={dialogTarget?.type === "qr" ? "Ver código QR" : "Ver código alfanumérico"}
        message={
          dialogTarget?.type === "qr"
            ? "¿Deseas abrir el código QR de esta venta?"
            : "¿Deseas abrir el código alfanumérico de esta venta?"
        }
      />
    </div>
  );
};
