import React, { useEffect, useState } from "react";
import TransportService from "@/services/ListarMisTransportes";
import { MapPin, QrCode, Truck } from "lucide-react";
import { Link } from "react-router-dom";

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
  "Asignada": "bg-red-400",
  "En Proceso": "bg-yellow-400",
  "Completada": "bg-green-500",
};

const TransportesContenido: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id_user = JSON.parse(localStorage.getItem("user") || "{}").id;
        const data = await TransportService.getTransports(id_user);
        console.log("Data sin filtrar:", data);
  
        const comprasFiltradas = data.filter((compra: Compra) => {
          const estado = compra.estado?.trim();
          return estado === "En Proceso" || estado === "Completada" || estado === "Asignada";
        });
  
        console.log("Filtradas:", comprasFiltradas);
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
    <div className="flex-1 px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <span className="text-sm">Estado:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-400 rounded-full" />
              <span>Asignada ({countByEstado.Asignado})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-400 rounded-full" />
              <span>Proceso ({countByEstado["En Proceso"]})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Completada ({countByEstado.Completada})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-20">
        {compras.map((compra) => (
          <div
            key={compra.id_compra}
            className="flex items-start gap-4 border-b pb-4"
          >
            <Truck className="w-10 h-10 text-black" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-3 h-3 rounded-full ${estadoColor[compra.estado]}`}
                />
                <span className="font-semibold">{compra.producto_nombre}</span>
              </div>
              <p className="text-sm text-gray-700">
                {compra.estado}, Circassia
                <br />
                <span className="text-green-600 font-bold">
                  ${compra.precio_transporte}
                </span>
                <br />
                Cant: {compra.cantidad}
                <br />
                Vendedor: {compra.vendedor_nombre}
                <br />
                Entregado el{" "}
                {new Date(compra.fecha_entrega).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Link
                to={`/codigo/${compra.id_compra}`}
                className="text-sm text-black hover:text-blue-600"
              >
                Código
              </Link>
              <Link to={`/ubicacion/${compra.id_compra}`}>
                <MapPin className="w-5 h-5 text-black cursor-pointer" />
              </Link>
              <Link to={`/escanear/${compra.id_compra}`}>
                <QrCode className="w-5 h-5 text-black cursor-pointer" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportesContenido;
