// ─── Librerías ───────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, QrCode } from "lucide-react";

// ─── Servicios ───────────────────────────────────────────────────────────────
import { ProductManagementService } from "@/services/Perfil/PerfilcomprasServices";

// ─── Componentes ─────────────────────────────────────────────────────────────
import Header from "@/components/Header";
import UserProfileCard from "@components/perfil/UserProfileCard";
import Footer from "@/components/footer";

// ─── Tipado ─────────────────────────────────────────────────────────────────
export type Compra = {
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
  estado: "Pendiente" | "Asignado" | "En Proceso" | "Completada";
};

// ─── Animación ───────────────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, ease: "easeOut", duration: 0.6 },
  }),
};

// ─── Componente Principal ───────────────────────────────────────────────────
export default function ListarMiscompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ProductManagementService.getBySeller();
        setCompras(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar las compras");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
          <main className="flex flex-col lg:flex-row pt-32 px-10 gap-10">
                <UserProfileCard />
  <motion.div
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={1}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#205116]">Mis Compras</h2>

        {loading && <p className="text-center mt-4">Cargando compras...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {!loading && compras.length === 0 && (
          <p className="text-center mt-4 text-gray-600">No hay compras todavía.</p>
        )}

        {!loading && compras.length > 0 && (
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
                  <tr key={i}>
                    <td className="px-3 py-2">{c.fecha_compra}</td>
                    <td className="px-3 py-2">{c.fecha_entrega}</td>
                    <td className="px-3 py-2">{c.producto_nombre}</td>
                    <td className="px-3 py-2">{c.cantidad}</td>
                    <td className="px-3 py-2">${c.precio_producto}</td>
                    <td className="px-3 py-2">
                      ${(c.cantidad * c.precio_producto).toFixed(2)}
                    </td>
                    <td className="px-3 py-2">${c.precio_transporte}</td>
                    <td className="px-3 py-2">{c.vendedor_nombre}</td>
                    <td className="px-3 py-2">{c.transportador_nombre}</td>
                    <td className="px-3 py-2">{c.estado}</td>

                    <td className="px-3 py-2 text-center">
                      {c.estado === "Pendiente" && (
                        <Link
                          to={`/transporte/${c.id_compra}`}
                          className="flex justify-center"
                          title="Asignar transportador"
                        >
                          <Truck
                            size={16}
                            className="text-black hover:text-green-600 transition-colors"
                          />
                        </Link>
                      )}
                      {c.estado === "Asignado" && (
                        <span className="text-black font-semibold">Asignado</span>
                      )}
                      {c.estado === "Completada" && (
                        <span className="text-black font-semibold">Completada</span>
                      )}
                    </td>

                    <td className="px-3 py-2 text-center">
                      {c.estado === "En Proceso" ? (
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/compra/${c.id_compra}/qr`}
                            className="text-[#48BD28]"
                            title="Ver QR"
                          >
                            <QrCode className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/compra/${c.id_compra}/codigo`}
                            className="text-[#48BD28] text-sm"
                          >
                            Ver Código
                          </Link>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs"></span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
          </main>
   
    

      <Footer />
    </>
  );
}
