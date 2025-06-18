/* -------------------------------------------------
   Muestra mis compras + ConfirmDialog para:
   • Asignar transportador
   • Ver QR / Código
   • Cancelar transporte (eliminar)
-------------------------------------------------- */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, QrCode } from "lucide-react";

/* ── services ─────────────────────────────── */
import { ProductManagementService } from "@/services/Perfil/PerfilcomprasServices";
import TransportService from "@/services/Perfil/ListarMisTransportes";

/* ── UI ────────────────────────────────────── */
import Header from "@/components/Header";
import Footer from "@/components/footer";
import UserProfileCard from "@components/perfil/UserProfileCard";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";

/* ── types ─────────────────────────────────── */
export type Compra = {
  id_compra: number;
  fecha_compra: string;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_producto: number;
  precio_transporte: number;
  vendedor_nombre: string;
  transportador_nombre: string;
  estado: "Pendiente" | "Asignada" | "En Proceso" | "Completada";
};

/* ── small helpers ─────────────────────────── */
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ============================================================= */
export default function ListarMisCompras() {
  /* ---------- state ---------- */
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  /* confirm‑dialog */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState<React.ReactNode>("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  /* toast */
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const navigate = useNavigate();

  /* ---------- fetch ---------- */
  const fetchCompras = async () => {
    try {
      setLoading(true);
      const data = await ProductManagementService.getBySeller();
      setCompras(data);
    } catch (e: any) {
      setError(e?.message ?? "Error al cargar las compras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  /* ---------- filtro ---------- */
  const comprasFiltradas = compras.filter((c) =>
    [c.producto_nombre, c.vendedor_nombre, c.estado]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  /* ---------- diálogo helper ---------- */
  const openDialog = (t: string, m: React.ReactNode, cb: () => void) => {
    setDialogTitle(t);
    setDialogMsg(m);
    setOnConfirm(() => cb);
    setDialogOpen(true);
  };

  /* ---------- acciones ---------- */
  const gotoAsignar = (id: number) => navigate(`/transporte/${id}`);
  const gotoQr = (id: number) => navigate(`/compra/${id}/qr`);
  const gotoCodigo = (id: number) => navigate(`/compra/${id}/codigo`);

  const cancelTransport = async (id_compra: number) => {
    try {
      await TransportService.cancelarCompra(id_compra);
      setToast({ msg: "Transporte cancelado", ok: true });
      await fetchCompras(); // refrescar tabla
    } catch {
      setToast({ msg: "Error al cancelar", ok: false });
    }
  };

  /* ============================================================= */
  return (
    <>
      <Header />

      {/* ---- Toast ---- */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-white cursor-pointer
                      ${toast.ok ? "bg-green-600" : "bg-red-600"}`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}

      {/* ---- Pantalla principal ---- */}
      <div className="font-[Fredoka] min-h-screen flex flex-col bg-[#f4fcf1]">
        <main className="flex-1 flex justify-center items-start pt-28 md:pt-32 pb-10 px-4 gap-6 flex-col lg:flex-row">
          <UserProfileCard />

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full max-w-6xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#205116]">
              Mis Compras
            </h2>

            {/* buscador */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <input
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por producto, vendedor o estado..."
                className="w-full pl-4 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28] bg-white"
              />
            </motion.div>

            {/* tabla / mensajes */}
            {loading ? (
              <p className="text-gray-600">Cargando compras…</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-x-auto w-full text-sm"
              >
                <table className="min-w-full text-xs text-left border shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-[#caf5bd] text-black uppercase">
                    <tr>
                      {[
                        "Fecha compra",
                        "Fecha entrega",
                        "Producto",
                        "Cant.",
                        "P. Unidad",
                        "P. Total",
                        "Transporte",
                        "Vendedor",
                        "Transportador",
                        "Estado",
                        "Asignar",
                        "QR/Código",
                        "Acción",
                      ].map((th) => (
                        <th key={th} className="px-3 py-2">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-[#ccc] text-[13px]">
                    {comprasFiltradas.length ? (
                      comprasFiltradas.map((c, i) => (
                        <motion.tr
                          key={c.id_compra}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="hover:bg-[#e4fbdd] transition-colors"
                        >
                          <td className="px-3 py-2">{c.fecha_compra}</td>
                          <td className="px-3 py-2">{c.fecha_entrega}</td>
                          <td className="px-3 py-2">{c.producto_nombre}</td>
                          <td className="px-3 py-2">{c.cantidad}</td>
                          <td className="px-3 py-2">${c.precio_producto}</td>
                          <td className="px-3 py-2">
                            $
                            {c.cantidad * c.precio_producto +
                              c.precio_transporte}
                          </td>
                          <td className="px-3 py-2">${c.precio_transporte}</td>
                          <td className="px-3 py-2">{c.vendedor_nombre}</td>
                          <td className="px-3 py-2">
                            {c.transportador_nombre}
                          </td>
                          <td className="px-3 py-2">{c.estado}</td>

                          {/* asignar */}
                          <td className="px-3 py-2 text-center">
                            {c.estado === "Pendiente" && (
                              <button
                                title="Asignar transportador"
                                className="text-gray-600 hover:text-green-600"
                                onClick={() =>
                                  openDialog(
                                    "Asignar transportador",
                                    "¿Deseas asignar un transportador para esta compra?",
                                    () => gotoAsignar(c.id_compra)
                                  )
                                }
                              >
                                <Truck size={16} />
                              </button>
                            )}
                          </td>

                        
                            <td className="px-3 py-2">
                          {c.estado === "En Proceso" && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                   openDialog(
                                    "Generar Codigo QR",
                                    "¿esta seguro de generar el código QR?",
                                    () => gotoQr(c.id_compra)
                                  )
                                }
                                className="p-1 rounded hover:text-green-700"
                              >
                                <QrCode size={16} />
                              </button>

                              <button
                                onClick={() =>
                                    openDialog(
                                    "Generar Código",
                                    "¿esta seguro de generar el código?",
                                    () => gotoCodigo(c.id_compra)
                                  )
                                }
                                className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-2 py-1 rounded text-xs"
                              >
                                Código
                              </button>
                            </div>
                          )}
                        </td>

                          <td className="px-3 py-2 text-center">
                            {c.estado === "Asignada" && (
                              <button
                                className="text-red-600 hover:underline text-xs"
                                onClick={() =>
                                 openDialog(
                                    "Cancelar transporte",
                                    "¿esta seguro de cancelar el transporte?",
                                    () => cancelTransport(c.id_compra)
                                  )
                                }
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={13}
                          className="text-center py-4 text-gray-500"
                        >
                          No se encontraron compras con ese criterio.
                        </td>
                      </tr>
                    )}
                  </tbody> 
                </table>
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Confirmación global */}
        <ConfirmDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={onConfirm}
          title={dialogTitle}
          message={dialogMsg}
        />

        <Footer />
      </div>
    </>
  );
}
