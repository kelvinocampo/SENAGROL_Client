import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/footer";
import Buscador from "@/components/Inicio/Search";
import UserProfileCard from "@/components/perfil/UserProfileCard";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import ModalQr from "@/components/perfil/QrComprador";
import ModalCodigo from "@/components/perfil/CodigoComprador";

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
  const [qrCompraId, setQrCompraId] = useState<number | null>(null);
  const [codigoCompraId, setCodigoCompraId] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await ProductManagementService.getBySeller();
        const formatted: Compra[] = data.map((c: any) => ({
          ...c,
          precio_producto: parseFloat(c.precio_producto) || 0,
          precio_transporte: parseFloat(c.precio_transporte) || 0,
        }));
        setCompras(formatted);
      } catch (e: any) {
        setError(e.message || "Error al cargar compras");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const comprasFiltradas = compras.filter((c) =>
    [c.producto_nombre, c.vendedor_nombre, c.estado]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const openDialog = (
    t: string,
    m: React.ReactNode,
    cb: () => void
  ) => {
    setDialogTitle(t);
    setDialogMsg(m);
    setOnConfirm(() => cb);
    setDialogOpen(true);
  };

  const gotoAsignar = (id: number) => navigate(`/transporte/${id}`);

  const cancelTransport = async (id_compra: number) => {
    try {
      await TransportService.cancelarCompra(id_compra);
      setToast({ msg: "Transporte cancelado", ok: true });
      const data = await ProductManagementService.getBySeller();
      const formatted: Compra[] = data.map((c: any) => ({
        ...c,
        precio_producto: parseFloat(c.precio_producto) || 0,
        precio_transporte: parseFloat(c.precio_transporte) || 0,
      }));
      setCompras(formatted);
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

      <div className="font-[Fredoka] flex flex-col min-h-screen bg-gradient-to-b from-[#E1FFD9] to-[#F0F0F0]">
        <main className="flex flex-col-reverse lg:flex-row gap-8 px-4 sm:px-6 md:px-10 py-10 pb-16">
          <aside className="w-full lg:w-1/2">
            <UserProfileCard />
          </aside>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="w-full lg:w-3/4"
          >
            <h2 className="text-3xl font-bolder mb-4 text-[#0D141C]">Mis Compras</h2>

            <div className="mb-6">
              <Buscador
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                setPaginaActual={() => {}}
                placeholderText="Buscar por producto, vendedor o estado…"
              />
            </div>

            {loading ? (
              <p className="text-gray-600">Cargando compras…</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="border border-[#48BD28] rounded-lg shadow overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-[#E4FBDD] sticky top-0 z-10">
                      <tr>
                        {["Estado", "Fecha Compra", "Fecha Entrega", "Vendedor", "Transportador", "Producto", "Cantidad", "Precio unit.", "Precio transp.", "Precio Total", "QR/Código", "Acción"].map((th) => (
                          <th
                            key={th}
                            className="px-3 py-2 whitespace-nowrap font-medium text-[#0D141C]"
                          >
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d1e7dd]">
                      {comprasFiltradas.length ? (
                        comprasFiltradas.map((c, i) => (
                          <tr
                            key={c.id_compra}
                            className={`transition-colors ${
                              i % 2 === 0 ? "bg-[#E1FFD9]" : "bg-white"
                            } hover:bg-[#d4f7e2]`}
                          >
                            <td className={`px-3 py-2 whitespace-nowrap font-semibold ${
                              c.estado === "Pendiente"
                                ? "text-red-600"
                                : c.estado === "Asignada"
                                ? "text-yellow-500"
                                : "text-green-600"
                            }`}>{c.estado}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{c.fecha_compra}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{c.fecha_entrega}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{c.vendedor_nombre}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {c.transportador_nombre || (c.estado === "Pendiente" && (
                                <button
                                  onClick={() =>
                                    openDialog(
                                      "Asignar transportador",
                                      "¿Deseas asignar un transportador para esta compra?",
                                      () => gotoAsignar(c.id_compra)
                                    )
                                  }
                                  className="bg-[#48BD28] hover:bg-[#379e1b] text-white px-3 py-1 rounded-full text-xs"
                                >
                                  Asignar
                                </button>
                              ))}
                            </td>
                            <td className="px-3 py-2">{c.producto_nombre}</td>
                            <td className="px-3 py-2">{c.cantidad}</td>
                            <td className="px-3 py-2">${c.precio_producto.toFixed(2)}</td>
                            <td className="px-3 py-2">${c.precio_transporte.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              ${(c.cantidad * c.precio_producto + c.precio_transporte).toFixed(2)}
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-2">
                                {c.estado === "En Proceso" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        openDialog(
                                          "Ver código QR",
                                          "¿Deseas visualizar el código QR de esta compra?",
                                          () => {
                                            setQrCompraId(c.id_compra);
                                            setDialogOpen(false);
                                          }
                                        )
                                      }
                                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                      QR
                                    </button>
                                    <button
                                      onClick={() =>
                                        openDialog(
                                          "Ver código alfanumérico",
                                          "¿Deseas visualizar el código alfanumérico de esta compra?",
                                          () => {
                                            setCodigoCompraId(c.id_compra);
                                            setDialogOpen(false);
                                          }
                                        )
                                      }
                                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                      Código
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              {(c.estado === "Pendiente" || c.estado === "Asignada") && (
                                <button
                                  onClick={() =>
                                    openDialog(
                                      "Cancelar transporte",
                                      "¿Deseas cancelar el transporte?",
                                      () => cancelTransport(c.id_compra)
                                    )
                                  }
                                  className={`px-2 py-1 rounded text-white text-xs ${
                                    c.estado === "Asignada"
                                      ? "bg-red-600 hover:bg-red-700"
                                      : "bg-gray-400 hover:bg-gray-500"
                                  }`}
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

        <ModalQr
          isOpen={qrCompraId !== null}
          onClose={() => setQrCompraId(null)}
          compraId={qrCompraId}
        />

        <ModalCodigo
          isOpen={codigoCompraId !== null}
          onClose={() => setCodigoCompraId(null)}
          compraId={codigoCompraId}
        />

        <Footer />
      </div>
    </>
  );
}
