import { useState, useEffect } from "react";
import { Truck, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

type Compra = {
  id_compra: number;
  fecha_compra: string;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_producto: number;
  precioTotal: number;
  precio_transporte: number;
  vendedor_nombre: string;
  transportador_nombre: string;
  estado: "En espera" | "Asignado" | "En proceso" | "Terminado";
};

const fetchComprasDummy = async (): Promise<Compra[]> => {
  return [
    {
      id_compra: 1,
      fecha_compra: "2025-05-01",
      fecha_entrega: "2025-05-05",
      producto_nombre: "Bicicleta montaña",
      cantidad: 2,
      precio_producto: 350,
      precioTotal: 700,
      precio_transporte: 50,
      vendedor_nombre: "Juan Pérez",
      transportador_nombre: "",
      estado: "En espera",
    },
    {
      id_compra: 2,
      fecha_compra: "2025-05-03",
      fecha_entrega: "2025-05-07",
      producto_nombre: "Casco profesional",
      cantidad: 1,
      precio_producto: 120,
      precioTotal: 120,
      precio_transporte: 20,
      vendedor_nombre: "Lucía Gómez",
      transportador_nombre: "Carlos Transporte",
      estado: "Asignado",
    },
    {
      id_compra: 3,
      fecha_compra: "2025-05-04",
      fecha_entrega: "2025-05-09",
      producto_nombre: "Guantes térmicos",
      cantidad: 3,
      precio_producto: 25,
      precioTotal: 75,
      precio_transporte: 15,
      vendedor_nombre: "Ana Torres",
      transportador_nombre: "Logística Express",
      estado: "En proceso",
    },
    {
      id_compra: 4,
      fecha_compra: "2025-05-06",
      fecha_entrega: "2025-05-10",
      producto_nombre: "Rodilleras Pro",
      cantidad: 1,
      precio_producto: 80,
      precioTotal: 80,
      precio_transporte: 10,
      vendedor_nombre: "Santiago López",
      transportador_nombre: "Rápido Cargo",
      estado: "Terminado",
    },
  ];
};

const ListarMiscompras = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const data = await fetchComprasDummy();
        setCompras(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar las compras");
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando compras...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  if (!loading && compras.length === 0) {
    return <p className="text-center mt-4 text-gray-600">No hay compras todavía.</p>;
  }

  return (
    <div className="overflow-x-auto text-sm">
      <table className="min-w-full text-xs text-left border shadow-sm rounded-md overflow-hidden">
        <thead className="bg-[#E4FBDD] text-black uppercase">
          <tr>
            <th className="px-3 py-2">Fecha compra</th>
            <th className="px-3 py-2">Fecha entrega</th>
            <th className="px-3 py-2">Producto</th>
            <th className="px-3 py-2">Cantidad</th>
            <th className="px-3 py-2">Precio Unidad</th>
            <th className="px-3 py-2">Precio Total</th>
            <th className="px-3 py-2">Costo transporte</th>
            <th className="px-3 py-2">Vendedor</th>
            <th className="px-3 py-2">Transportador</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Asignar Transportador</th>
            <th className="px-3 py-2">QR / Código</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-[#BFBFBD]">
          {compras.map((c, i) => (
            <tr key={i} className="hover:bg-[#BFBFBD] transition-colors">
              <td className="px-3 py-2">{c.fecha_compra}</td>
              <td className="px-3 py-2">{c.fecha_entrega}</td>
              <td className="px-3 py-2">{c.producto_nombre}</td>
              <td className="px-3 py-2">{c.cantidad}</td>
              <td className="px-3 py-2">${c.precio_producto}</td>
              <td className="px-3 py-2">${(c.cantidad * c.precio_producto).toFixed(2)}</td>
              <td className="px-3 py-2">${c.precio_transporte}</td>
              <td className="px-3 py-2">{c.vendedor_nombre}</td>
              <td className="px-3 py-2">{c.transportador_nombre}</td>
              <td className="px-3 py-2">{c.estado}</td>

              <td className="px-3 py-2 text-center">
                {c.estado === "En espera" && (
                  <Link
                    to="/transportadores"
                    className="flex justify-center"
                    title="Asignar transportador"
                  >
                    <Truck size={16} className="text-black hover:text-green-600 transition-colors" />
                  </Link>
                )}
                {c.estado === "Asignado" && (
                  <span className="text-black font-semibold">Asignado</span>
                )}
                {c.estado === "En proceso" && (
                  <span className="text-black font-semibold">En proceso</span>
                )}
                {c.estado === "Terminado" && (
                  <span className="text-black font-semibold">Terminado</span>
                )}
              </td>

              <td className="px-3 py-2">
                {c.estado === "En proceso" && (
                  <div className="flex items-center gap-1">
                    <QrCode size={16} className="text-black" />
                    <button className="bg-[#48BD28] text-white px-2 py-1 rounded text-xs">
                      Código
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarMiscompras;
