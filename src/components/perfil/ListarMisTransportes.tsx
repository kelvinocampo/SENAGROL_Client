import React, { useEffect, useState } from "react";
import TransportService from "@/services/Perfil/ListarMisTransportes";
import { MapPin, QrCode, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  }),
  whileHover: {
    scale: 1.2,
    rotate: 2,
    transition: { type: "spring", stiffness: 300 },
  },
};

const TransportesContenido: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
        const data = await TransportService.getTransports(id_user);

        const comprasFiltradas = data.filter((compra: Compra) => {
          const estado = compra.estado?.trim();
          return (
            estado === "En Proceso" ||
            estado === "Completada" ||
            estado === "Asignada"
          );
        });

        setCompras(comprasFiltradas);
      } catch (error) {
        console.error("Error al cargar transportes:", error);
      }
    };

    fetchData();
  }, []);

  const countByEstado = {
    Asignado: compras.filter((c) => c.estado === "Asignada").length,
    "En Proceso": compras.filter((c) => c.estado === "En Proceso").length,
    Completada: compras.filter((c) => c.estado === "Completada").length,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Indicadores de estado */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">Estado:</span>
          <div className="flex items-center gap-4">
            {[
              {
                label: "Asignada",
                color: "bg-red-400",
                count: countByEstado.Asignado,
              },
              {
                label: "Proceso",
                color: "bg-yellow-400",
                count: countByEstado["En Proceso"],
              },
              {
                label: "Completada",
                color: "bg-green-500",
                count: countByEstado.Completada,
              },
            ].map((estado) => (
              <div key={estado.label} className="flex items-center gap-1">
                <span className={`w-3 h-3 ${estado.color} rounded-full`} />
                <span className="text-sm text-gray-800">
                  {estado.label} ({estado.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de transportes */}
      <div className="space-y-6">
        {compras.map((compra, index) => (
          <motion.div
            key={compra.id_compra}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition-shadow"
          >
            <Truck className="w-10 h-10 text-green-600 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    estadoColor[compra.estado]
                  }`}
                />
                <span className="font-semibold text-lg text-gray-800">
                  {compra.producto_nombre}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Estado: <strong>{compra.estado}</strong> - Circassia <br />
                Precio transporte:{" "}
                <span className="text-green-600 font-semibold">
                  ${compra.precio_transporte}
                </span>
                <br />
                Cantidad: {compra.cantidad}
                <br />
                Vendedor: {compra.vendedor_nombre}
                <br />
                Fecha entrega:{" "}
                {new Date(compra.fecha_entrega).toLocaleDateString()}
              </p>
            </div>
            <motion.div
              className="flex flex-col items-center gap-2"
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  to: `/codigo/${compra.id_compra}`,
                  label: "Código",
                  component: (
                    <motion.span
                      className="text-sm text-blue-600 hover:underline"
                      variants={iconVariants}
                      custom={0}
                      whileHover={{ scale: 1.1 }}
                    >
                      Código
                    </motion.span>
                  ),
                },
                {
                  to: `/ubicacion/${compra.id_compra}`,
                  icon: MapPin,
                  custom: 1,
                },
                {
                  to: `/escanear/${compra.id_compra}`,
                  icon: QrCode,
                  custom: 2,
                },
              ].map((item, i) => (
                <Link to={item.to} key={item.to}>
                  {item.icon ? (
                    <motion.div
                      variants={iconVariants}
                      custom={item.custom}
                      whileHover={iconVariants.whileHover}
                    >
                      <item.icon className="w-5 h-5 text-gray-700 hover:text-blue-500 cursor-pointer" />
                    </motion.div>
                  ) : (
                    item.component
                  )}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TransportesContenido;
