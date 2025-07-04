import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/footer";
import Buscador from "../Inicio/Search";
import UserProfileCard from "@components/perfil/UserProfileCard";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";

import { ProductManagementService } from "@/services/Perfil/PerfilcomprasServices";
import TransportService from "@/services/Perfil/ListarMisTransportes";

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

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ListarMisCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMsg, setDialogMsg] = useState<React.ReactNode>("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const navigate = useNavigate();

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const data = await ProductManagementService.getBySeller();
      setCompras(data);
    } catch (e: any) {
      setError(e?.message ?? "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  const comprasFiltradas = compras.filter((c) =>
    [c.producto_nombre, c.vendedor_nombre, c.estado]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const openDialog = (t: string, m: React.ReactNode, cb: () => void) => {
    setDialogTitle(t);
    setDialogMsg(m);
    setOnConfirm(() => cb);
    setDialogOpen(true);
  };

  const gotoAsignar = (id: number) => navigate(`/transporte/${id}`);
  const gotoQr = (id: number) => navigate(`/compra/${id}/qr`);
  const gotoCodigo = (id: number) => navigate(`/compra/${id}/codigo`);

  const cancelTransport = async (id_compra: number) => {
    try {
      await TransportService.cancelarCompra(id_compra);
      setToast({ msg: "Transporte cancelado", ok: true });
      await fetchCompras();
    } catch {
      setToast({ msg: "Error al cancelar", ok: false });
    }
  };

  return (
    <>
      <Header />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow text-white cursor-pointer ${
            toast.ok ? "bg-green-600" : "bg-red-600"
          }`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}

      <div className="font-[Fredoka] min-h-screen flex flex-col bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0]">
        <main className="flex flex-col-reverse lg:flex-row gap-8 px-4 sm:px-6 md:px-10 pb-16 py-10">
          {/* Perfil */}
          <div className="w-full lg:w-1/2">
            <UserProfileCard />
          </div>

          {/* Tabla */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full lg:w-3/4 overflow-x-auto"
          >
            <h2 className="text-3xl font-bolder mb-4 text-[#0D141C]">Mis Compras</h2>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Buscador
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                setPaginaActual={() => {}}
                placeholderText="Buscar por nombre, vendedor o precio…"
              />
            </motion.div>

            {loading ? (
              <p className="text-gray-600">Cargando compras…</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="border rounded-lg shadow overflow-hidden">
                <div className="">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-white sticky top-0 z-10">
                      <tr className="text-black uppercase">
                        {[
                          "Estado", "Fecha Compra", "Fecha Entrega", "Vendedor",
                          "Transportador", "Producto", "Cantidad", "Precio por unidad",
                          "Precio transporte", "Precio Total", "QR/Código", "Acción"
                        ].map((th) => (
                          <th key={th} className="px-3 py-2 whitespace-nowrap">
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  </table>
                </div>

                <div className="max-h-[240px] overflow-y-auto">
                  <table className="min-w-full text-xs text-left">
                    <tbody className="divide-y divide-[#48BD28] text-[13px]">
                      {comprasFiltradas.length ? (
                        comprasFiltradas.map((c, i) => (
                          <tr
                            key={c.id_compra}
                            className={`transition-colors ${
                              i % 2 === 0 ? "bg-[#E1FFD9]" : "bg-white"
                            } hover:bg-[#e4fbdd]`}
                          >
                            <td className={`px-4 py-2 ${
                              c.estado === "Pendiente"
                                ? "text-red-600 font-bold"
                                : c.estado === "Asignada"
                                ? "text-yellow-500 font-bold"
                                : c.estado === "Completada"
                                ? "text-green-600 font-bold"
                                : ""
                            }`}>
                              {c.estado}
                            </td>
                            <td className="px-3 py-2">{c.fecha_compra}</td>
                            <td className="px-3 py-2">{c.fecha_entrega}</td>
                            <td className="px-3 py-2">{c.vendedor_nombre}</td>
                            <td className="px-3 py-2">
                              {c.transportador_nombre ||
                                (c.estado === "Pendiente" && (
                                  <button
                                    onClick={() =>
                                      openDialog("Asignar transportador", "¿Deseas asignar un transportador para esta compra?", () => gotoAsignar(c.id_compra))
                                    }
                                    className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-4 py-1 rounded-full text-xs"
                                  >
                                    Asignar
                                  </button>
                                ))}
                            </td>
                            <td className="px-3 py-2">{c.producto_nombre}</td>
                            <td className="px-3 py-2">{c.cantidad}</td>
                            <td className="px-3 py-2">${c.precio_producto}</td>
                            <td className="px-3 py-2">${c.precio_transporte}</td>
                            <td className="px-3 py-2">
                              ${c.cantidad * c.precio_producto + c.precio_transporte}
                            </td>
                            <td className="px-3 py-2">
                              {c.estado === "En Proceso" && (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      openDialog("Generar Código QR", "¿Está seguro de generar el código QR?", () => gotoQr(c.id_compra))
                                    }
                                    className="p-1 rounded hover:text-green-700"
                                  >
                                    <QrCode size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openDialog("Generar Código", "¿Está seguro de generar el código?", () => gotoCodigo(c.id_compra))
                                    }
                                    className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-2 py-1 rounded text-xs"
                                  >
                                    Código
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {(c.estado === "Pendiente" || c.estado === "Asignada") && (
                                <button
                                  className={`px-4 py-1 rounded-full text-white text-xs ${
                                    c.estado === "Asignada"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-[#BDBDBD] hover:bg-gray-500"
                                  }`}
                                  onClick={() =>
                                    openDialog("Cancelar transporte", "¿Está seguro de cancelar el transporte?", () => cancelTransport(c.id_compra))
                                  }
                                >
                                  Cancelar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="text-center py-4 text-gray-500">
                            Aún no has realizado ninguna compra.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </main>

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
  