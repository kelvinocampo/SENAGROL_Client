
import React, { useEffect, useState } from "react";
import TransportService from "@/services/Perfil/ListarMisTransportes";
import { MapPin, QrCode, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ConfirmDialog } from "@components/admin/common/ConfirmDialog";

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
  Asignada: "bg-red-400",
  "En Proceso": "bg-yellow-400",
  Completada: "bg-green-500",
};

const iconVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 200, damping: 10 },
  }),
  whileHover: { scale: 1.2, rotate: 2, transition: { type: "spring", stiffness: 300 } },
};

const TransportesContenido: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [toast, setToast] = useState<{ mensaje: string; tipo: "success" | "error" } | null>(null);

  /* --- Confirm dialog state --- */
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [compraPendiente, setCompraPendiente] = useState<Compra | null>(null);

  /* -------- Fetch -------- */
  const cargarTransportes = async () => {
    try {
      const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
      const data = await TransportService.getTransports(id_user);
      setCompras(
        data.filter((c: Compra) => ["Asignada", "En Proceso", "Completada"].includes(c.estado))
      );
    } catch {
      setToast({ mensaje: "Error al cargar transportes", tipo: "error" });
    }
  };

  useEffect(() => {
    cargarTransportes();
  }, []);

  /* -------- Cancel -------- */
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

  /* -------- Counters -------- */
  const countByEstado = {
    Asignada: compras.filter((c) => c.estado === "Asignada").length,
    "En Proceso": compras.filter((c) => c.estado === "En Proceso").length,
    Completada: compras.filter((c) => c.estado === "Completada").length,
  };

  /* ============================================================= */
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 relative">
      {/* ---------- Toast ---------- */}
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

      {/* ---------- Indicadores ---------- */}
      <div className="mb-6 flex items-center gap-6 flex-wrap">
        {[
          { label: "Asignada", color: "bg-red-400", count: countByEstado.Asignada },
          { label: "En Proceso", color: "bg-yellow-400", count: countByEstado["En Proceso"] },
          { label: "Completada", color: "bg-green-500", count: countByEstado.Completada },
        ].map((e) => (
          <div key={e.label} className="flex items-center gap-1 text-sm text-gray-800">
            <span className={`w-3 h-3 rounded-full ${e.color}`} /> {e.label} ({e.count})
          </div>
        ))}
      </div>

      {/* ---------- Lista ---------- */}
      <div className="space-y-6">
        {compras.map((compra, i) => (
          <motion.div
            key={compra.id_compra}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 bg-white shadow-md rounded-xl p-4 border hover:shadow-lg"
          >
            <Truck className="w-10 h-10 text-green-600 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-3 h-3 rounded-full ${estadoColor[compra.estado]}`} />
                <span className="font-semibold text-lg text-gray-800">
                  {compra.producto_nombre}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Estado: <strong>{compra.estado}</strong> <br />
                Precio transporte:&nbsp;
                <span className="text-green-600 font-semibold">${compra.precio_transporte}</span>
                <br />
                Cantidad: {compra.cantidad} <br />
                Vendedor: {compra.vendedor_nombre} <br />
                Fecha entrega: {new Date(compra.fecha_entrega).toLocaleDateString()}
              </p>

              {compra.estado === "Asignada" && (
                <button
                  onClick={() => {
                    setCompraPendiente(compra);
                    setConfirmOpen(true);
                  }}
                  className="mt-2 text-sm text-red-600 hover:underline"
                >
                  Cancelar transporte
                </button>
              )}
            </div>

            <motion.div className="flex flex-col items-center gap-2" initial="hidden" animate="visible">
              {[
                { to: `/codigo/${compra.id_compra}`, label: "Código", custom: 0 },
                { to: `/ubicacion/${compra.id_compra}`, icon: MapPin, custom: 1 },
                { to: `/escanear/${compra.id_compra}`, icon: QrCode, custom: 2 },
              ].map((item) =>
                item.icon ? (
                  <Link to={item.to} key={item.to}>
                    <motion.div
                      variants={iconVariants}
                      custom={item.custom}
                      whileHover={iconVariants.whileHover}
                    >
                      <item.icon className="w-5 h-5 text-gray-700 hover:text-blue-500" />
                    </motion.div>
                  </Link>
                ) : (
                  <Link to={item.to} key={item.to}>
                    <motion.span
                      variants={iconVariants}
                      custom={item.custom}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                )
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ---------- Confirm Cancel ---------- */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={cancelar}
        title="Cancelar transporte"
        message={`¿esta seguro de cancelar el transporte?`}
      />
    </div>
  );
};

export default TransportesContenido;
