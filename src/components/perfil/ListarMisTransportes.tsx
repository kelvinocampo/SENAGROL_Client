import React, { useEffect, useState } from "react";
import TransportService from "@/services/Perfil/ListarMisTransportes";
import { ConfirmDialog } from "@components/admin/common/ConfirmDialog";
import ManualCodeForm from "@components/perfil/CodigoTransportador";
import ModalEscanearQr from "@components/perfil/EscanearQr";
import ModalUbicacionCompra from "@pages/Perfil/UbicacionCompra";

type Compra = {
  id_compra: number;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_transporte: number;
  vendedor_nombre: string;
  estado: "Asignada" | "En Proceso" | "Completada";
};

const estadoColor: Record<Compra["estado"], string> = {
  Asignada: "text-[#0284C7]",
  "En Proceso": "text-[#CA8A04]",
  Completada: "text-[#28A745]",
};

const TransportesContenido: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<{
    tipo: "codigo" | "qr" | "ubicacion" | "cancelar";
    compra: Compra;
  } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalQrOpen, setModalQrOpen] = useState(false);
  const [modalUbicacionOpen, setModalUbicacionOpen] = useState(false);

  const cargarTransportes = async () => {
    try {
      const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
      const data = await TransportService.getTransports(id_user);
      setCompras(data.filter((c: Compra) => ["Asignada", "En Proceso", "Completada"].includes(c.estado)));
    } catch {
      setToast({ mensaje: "Error al cargar transportes", tipo: "error" });
    }
  };

  useEffect(() => {
    cargarTransportes();
  }, []);

  const ejecutarAccion = async () => {
    if (!accionPendiente) return;
    const { tipo, compra } = accionPendiente;

    switch (tipo) {
      case "cancelar":
        try {
          await TransportService.cancelarCompra(compra.id_compra);
          setToast({ mensaje: "Compra cancelada correctamente", tipo: "success" });
          cargarTransportes();
        } catch {
          setToast({ mensaje: "Error al cancelar la compra", tipo: "error" });
        }
        break;
      case "codigo":
        setModalOpen(true);
        break;
      case "qr":
        setModalQrOpen(true);
        break;
      case "ubicacion":
        setModalUbicacionOpen(true);
        break;
    }

    setAccionPendiente(null);
    setConfirmOpen(false);
  };

  const countByEstado = {
    Asignada: compras.filter((c) => c.estado === "Asignada").length,
    "En Proceso": compras.filter((c) => c.estado === "En Proceso").length,
    Completada: compras.filter((c) => c.estado === "Completada").length,
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

      {/* Indicadores */}
      <div className="flex flex-wrap gap-4 mb-6">
        {[
          { label: "Asignada", bg: "#E0F2FE", text: "#0284C7", count: countByEstado.Asignada },
          { label: "En Proceso", bg: "#fde68a", text: "#CA8A04", count: countByEstado["En Proceso"] },
          { label: "Completada", bg: "#DCFCE7", text: "#16A34A", count: countByEstado.Completada },
        ].map((estado) => (
          <span
            key={estado.label}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              backgroundColor: estado.bg,
              color: estado.text,
              border: `2px solid ${estado.text}`,
            }}
          >
            {estado.label}
            <span className="bg-white rounded-full px-2 ml-2">{estado.count}</span>
          </span>
        ))}
      </div>

      {/* Tabla */}
    <div className="overflow-x-auto rounded-xl border border-[#48bd28] shadow bg-white">
  <table className="w-full table-auto text-sm text-center rounded-xl overflow-hidden">
    <thead className="bg-white text-black font-bold">
      <tr>
        <th className="px-4 py-2">Estado</th>
        <th className="px-4 py-2">Fecha Entrega</th>
        <th className="px-4 py-2">Vendedor</th>
        <th className="px-4 py-2">Producto</th>
        <th className="px-4 py-2">Cantidad</th>
        <th className="px-4 py-2">Precio transporte</th>
        <th className="px-4 py-2">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {compras.map((compra, index) => (
        <tr
          key={compra.id_compra}
          className={`${index % 2 === 0 ? "bg-[#f4fcf1]" : "bg-white"}`}
        >
          <td className="px-2 py-2">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${estadoColor[compra.estado]}`}
            >
              {compra.estado}
            </span>
          </td>
          <td>{new Date(compra.fecha_entrega).toLocaleString()}</td>
          <td>{compra.vendedor_nombre}</td>
          <td>{compra.producto_nombre}</td>
          <td>{compra.cantidad}</td>
          <td className="text-green-700 font-semibold">
            ${compra.precio_transporte.toLocaleString()}
          </td>
          <td className="flex flex-wrap sm:flex-nowrap justify-center gap-1 px-2 py-1">
            <button
              onClick={() => {
                setAccionPendiente({ tipo: "codigo", compra });
                setConfirmOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded"
            >
              Código
            </button>

            <button
              onClick={() => {
                setAccionPendiente({ tipo: "qr", compra });
                setConfirmOpen(true);
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-xs rounded"
            >
              QR
            </button>

            <button
              onClick={() => {
                setAccionPendiente({ tipo: "ubicacion", compra });
                setConfirmOpen(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded"
            >
              Ubicación
            </button>

            {compra.estado === "Asignada" && (
              <button
                onClick={() => {
                  setAccionPendiente({ tipo: "cancelar", compra });
                  setConfirmOpen(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded"
              >
                Cancelar
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Confirmación genérica para todas las acciones */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={ejecutarAccion}
        title="Confirmar acción"
        message={`¿Está seguro que desea continuar con la acción "${
          accionPendiente?.tipo || ""
        }"?`}
      />

      {/* Modales */}
      {modalOpen && accionPendiente?.compra && (
        <ManualCodeForm isOpen={modalOpen} onClose={() => setModalOpen(false)} compraId={accionPendiente.compra.id_compra} />
      )}

      {modalQrOpen && accionPendiente?.compra && (
        <ModalEscanearQr isOpen={modalQrOpen} onClose={() => setModalQrOpen(false)} compraId={accionPendiente.compra.id_compra} />
      )}

      {modalUbicacionOpen && accionPendiente?.compra && (
        <ModalUbicacionCompra id={accionPendiente.compra.id_compra} onClose={() => setModalUbicacionOpen(false)} />
      )}
    </div>
  );
};

export default TransportesContenido;
