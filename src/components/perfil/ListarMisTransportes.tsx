import React, { useEffect, useState } from "react";
import TransportService from "@/services/Perfil/ListarMisTransportes";
import { ConfirmDialog } from "@components/admin/common/ConfirmDialog";
import ManualCodeForm from "@components/perfil/CodigoTransportador";
import ModalEscanearQr from "@components/perfil/EscanearQr";
import ModalUbicacionCompra from "@pages/Perfil/UbicacionCompra";

interface Compra {
  id_compra: number;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_transporte: number;
  vendedor_nombre: string;
  estado: "Asignada" | "En Proceso" | "Completada";
}

const estadoColor: Record<Compra["estado"], string> = {
  Asignada: "text-[#0284C7]",
  "En Proceso": "text-[#CA8A04]",
  Completada: "text-[#28A745]",
};

export const TransportesContenido: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<{
    tipo: "codigo" | "qr" | "ubicacion" | "cancelar";
    compra: Compra;
  } | null>(null);

  const [modalCodigoOpen, setModalCodigoOpen] = useState(false);
  const [modalQrOpen, setModalQrOpen] = useState(false);
  const [modalUbicacionOpen, setModalUbicacionOpen] = useState(false);

  // Carga inicial de compras
  useEffect(() => {
    (async () => {
      try {
        const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
        const data: Compra[] = await TransportService.getTransports(id_user);
        setCompras(
          data.filter(
            (c: Compra) =>
              c.estado === "Asignada" ||
              c.estado === "En Proceso" ||
              c.estado === "Completada"
          )
        );
      } catch {
        setToast({ mensaje: "Error al cargar transportes", tipo: "error" });
      }
    })();
  }, []);

  // Ejecuta la acción pendiente: cancelar, código, QR o ubicación
  const ejecutarAccion = () => {
    if (!accionPendiente) return;
    const { tipo, compra } = accionPendiente;

    if (tipo === "cancelar") {
      TransportService.cancelarCompra(compra.id_compra)
        .then(() => {
          setToast({ mensaje: "Compra cancelada correctamente", tipo: "success" });
          // recargar transportes
          return TransportService.getTransports(
            JSON.parse(localStorage.getItem("user") || "{}").id
          );
        })
        .then((data: Compra[]) =>
          setCompras(
            data.filter(
              (c: Compra) =>
                c.estado === "Asignada" ||
                c.estado === "En Proceso" ||
                c.estado === "Completada"
            )
          )
        )
        .catch(() => {
          setToast({ mensaje: "Error al cancelar la compra", tipo: "error" });
        });
    } else if (tipo === "codigo") {
      setModalCodigoOpen(true);
    } else if (tipo === "qr") {
      setModalQrOpen(true);
    } else if (tipo === "ubicacion") {
      setModalUbicacionOpen(true);
    }
  };

  // Conteos por estado
  const countByEstado = {
    Asignada: compras.filter((c: Compra) => c.estado === "Asignada").length,
    "En Proceso": compras.filter((c: Compra) => c.estado === "En Proceso").length,
    Completada: compras.filter((c: Compra) => c.estado === "Completada").length,
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white z-50 cursor-pointer ${
            toast.tipo === "success" ? "bg-green-600" : "bg-red-600"
          }`}
          onClick={() => setToast(null)}
        >
          {toast.mensaje}
        </div>
      )}

    
      <h2 className='font-medium text-2xl mb-5'>Mis Transportes</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        {(["Asignada", "En Proceso", "Completada"] as Compra["estado"][]).map(
          (estado) => (
            <span
              key={estado}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor:
                  estado === "Asignada"
                    ? "#E0F2FE"
                    : estado === "En Proceso"
                    ? "#fde68a"
                    : "#DCFCE7",
                color:
                  estado === "Asignada"
                    ? "#0284C7"
                    : estado === "En Proceso"
                    ? "#CA8A04"
                    : "#16A34A",
                border: `2px solid ${
                  estado === "Asignada"
                    ? "#0284C7"
                    : estado === "En Proceso"
                    ? "#CA8A04"
                    : "#16A34A"
                }`,
              }}
            >
              {estado}
              <span className="bg-white rounded-full px-2 ml-2">
                {countByEstado[estado]}
              </span>
            </span>
          )
        )}
      </div>

    {compras.length === 0 ? (
  <div className="text-center text-gray-600 py-6 text-lg">
    No tienes transportes en este momento.
  </div>
) : (
  
  <div className="w-full overflow-x-auto rounded-xl border border-[#48bd28] shadow bg-white">
    
    <table className="w-full min-w-[720px] table-auto text-sm text-center">
      <thead className="bg-white text-black font-bold sticky top-0 z-10">
        <tr>
          <th className="px-4 py-2">Estado</th>
          <th className="px-4 py-2">Fecha entrega</th>
          <th className="px-4 py-2">Vendedor</th>
          <th className="px-4 py-2">Producto</th>
          <th className="px-4 py-2">Cantidad</th>
          <th className="px-4 py-2">Precio transp.</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {compras.map((compra, index) => (
          <tr
            key={compra.id_compra}
            className={index % 2 === 0 ? "bg-[#f4fcf1]" : "bg-white"}
          >
            <td className="px-2 py-1">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${estadoColor[compra.estado]}`}
              >
                {compra.estado}
              </span>
            </td>
            <td className="px-2 py-1 whitespace-nowrap">
              {new Date(compra.fecha_entrega).toLocaleString()}
            </td>
            <td className="px-2 py-1">{compra.vendedor_nombre}</td>
            <td className="px-2 py-1">{compra.producto_nombre}</td>
            <td className="px-2 py-1">{compra.cantidad}</td>
            <td className="px-2 py-1 text-green-700 font-semibold">
              ${compra.precio_transporte.toLocaleString()}
            </td>
            <td className="py-2 px-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setAccionPendiente({ tipo: "codigo", compra });
                    setConfirmOpen(true);
                  }}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Código
                </button>
                <button
                  onClick={() => {
                    setAccionPendiente({ tipo: "qr", compra });
                    setConfirmOpen(true);
                  }}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
                >
                  QR
                </button>
                <button
                  onClick={() => {
                    setAccionPendiente({ tipo: "ubicacion", compra });
                    setConfirmOpen(true);
                  }}
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                  Ubicación
                </button>
                {compra.estado === "Asignada" && (
                  <button
                    onClick={() => {
                      setAccionPendiente({ tipo: "cancelar", compra });
                      setConfirmOpen(true);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          ejecutarAccion();
          setConfirmOpen(false);
        }}
        title="Confirmar acción"
        message={`¿Deseas continuar con "${accionPendiente?.tipo}"?`}
      />

      {/* Modales */}
      {modalCodigoOpen && accionPendiente && (
        <ManualCodeForm
          isOpen={modalCodigoOpen}
          onClose={() => setModalCodigoOpen(false)}
          compraId={accionPendiente.compra.id_compra}
        />
      )}
      {modalQrOpen && accionPendiente && (
        <ModalEscanearQr
          isOpen={modalQrOpen}
          onClose={() => setModalQrOpen(false)}
          compraId={accionPendiente.compra.id_compra}
        />
      )}
      {modalUbicacionOpen && accionPendiente && (
        <ModalUbicacionCompra
          id={accionPendiente.compra.id_compra}
          onClose={() => setModalUbicacionOpen(false)}
        />
      )}
    </div>
  );
};

export default TransportesContenido;
