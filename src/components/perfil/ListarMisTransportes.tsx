import React, { useEffect, useState } from "react";
import TransportService from "@/services/Perfil/ListarMisTransportes";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "@components/admin/common/ConfirmDialog";
import ManualCodeForm from "@components/perfil/CodigoTransportador";
import ModalEscanearQr from "@components/perfil/EscanearQr";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [compraPendiente, setCompraPendiente] = useState<Compra | null>(null);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" } | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalQrOpen, setModalQrOpen] = useState(false);
  const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);

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

  const cancelar = async () => {
    if (!compraPendiente) return;
    try {
      await TransportService.cancelarCompra(compraPendiente.id_compra);
      setToast({ mensaje: "Compra cancelada correctamente", tipo: "success" });
      cargarTransportes();
    } catch {
      setToast({ mensaje: "Error al cancelar la compra", tipo: "error" });
    }
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
      <div className="overflow-x-auto border rounded-xl shadow bg-white">
        <table className="w-full table-auto text-sm text-center">
          <thead className="bg-white text-black font-bold">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">Estado</th>
              <th className="px-4 py-2 whitespace-nowrap">Fecha Entrega</th>
              <th className="px-4 py-2 whitespace-nowrap">Vendedor</th>
              <th className="px-4 py-2 whitespace-nowrap">Producto</th>
              <th className="px-4 py-2 whitespace-nowrap">Cantidad</th>
              <th className="px-4 py-2 whitespace-nowrap">Precio Transporte</th>
              <th className="px-4 py-2 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra, index) => (
              <tr key={compra.id_compra} className="border-b hover:bg-[#f4fcf1]">
                <td className="px-2 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${estadoColor[compra.estado]}`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#DCFCE7",
                    }}
                  >
                    {compra.estado}
                  </span>
                </td>
                <td>{new Date(compra.fecha_entrega).toLocaleDateString()}</td>
                <td>{compra.vendedor_nombre}</td>
                <td>{compra.producto_nombre}</td>
                <td>{compra.cantidad}</td>
                <td className="text-green-700 font-semibold">${compra.precio_transporte}</td>
                <td className="whitespace-nowrap space-y-1 sm:space-y-0 sm:space-x-1 flex flex-col sm:flex-row items-center justify-center">
                  <button
                    onClick={() => {
                      setSelectedCompraId(compra.id_compra);
                      setModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded"
                  >
                    Código
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCompraId(compra.id_compra);
                      setModalQrOpen(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                  >
                    QR
                  </button>

                  <Link to={`/ubicacion/${compra.id_compra}`} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 text-xs rounded">
                    Ubicación
                  </Link>

                  {compra.estado === "Asignada" && (
                    <button
                      onClick={() => {
                        setCompraPendiente(compra);
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

      {/* Confirmación de cancelación */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={cancelar}
        title="Cancelar transporte"
        message="¿Está seguro de cancelar el transporte?"
      />

      {/* Modal Código Manual */}
      {modalOpen && (
        <ManualCodeForm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          compraId={selectedCompraId}
        />
      )}

      {/* Modal Escanear QR */}
    {modalQrOpen && (
<ModalEscanearQr
  isOpen={modalQrOpen}
  onClose={() => setModalQrOpen(false)}
  compraId={selectedCompraId ?? undefined} // <- Aquí
/>
)}
    </div>
  );
};

export default TransportesContenido;
