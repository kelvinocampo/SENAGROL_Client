// src/pages/producto/DetalleProducto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { BackToHome } from "@components/admin/common/BackToHome";
import { getUserRole } from "@/services/Perfil/authService";
import Header from "@components/Header";
import Footer from "@components/footer";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ProductsManagement/ProductCard";
import FallingLeaves from "@/components/FallingLeaf";

export default function DetalleProducto() {
  const { id } = useParams();
  const context = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  const [producto, setProducto] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [roles, setRoles] = useState<string[]>([]);
  const [noBuyer, setNoBuyer] = useState(false);

  useEffect(() => {
    if (context && id) {
      const found = context.allProducts.find(p => String(p.id) === id);
      setProducto(found ?? null);
      if (found) setCantidad(found.cantidad_minima_compra || 1);
    }
  }, [context, id]);

  useEffect(() => {
    (async () => {
      try {
        const r = (await getUserRole()).split(/\s+/).filter(Boolean);
        setRoles(r);
      } catch { setRoles([]); }
    })();
  }, []);

  const handleComprar = () => {
    if (!roles.includes("comprador")) {
      setNoBuyer(true);
      return;
    }
    navigate(`/pago/${producto.id}`);
  };

  const handleChat = () => {
    if (producto?.id_vendedor) navigate(`/Chats/${producto.id_vendedor}`);
  };

  if (!context || !producto) return <div className="p-6">Cargando producto…</div>;
  const isBuyer = roles.includes("comprador");

  return (
    <div className="font-[Fredoka] min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
      <Header />
      <BackToHome />
      <div className="flex-grow relative">
        <section className="lg:hidden p-4">
          <ProductCard product={producto} isDetailView />
        </section>

        <motion.section
          className="hidden lg:grid w-[92%] max-w-7xl mx-auto mt-6 grid-cols-[490px_1fr] gap-10 p-10 "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-full object-cover rounded-xl shadow-lg"
              onError={e => ((e.target as HTMLImageElement).src = "")}
            />
          </motion.div>

          <motion.div
            className="flex flex-col justify-between"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-2xl font-bold text-black">{producto.nombre}</h1>
              <p className="text-sm text-[#676767] mt-2">{producto.descripcion}</p>

              <div className="flex flex-col gap-2 mt-3 flex-wrap">
                <span className="px-1 py-0.5 text-xs w-14 font-bold bg-[#FF2B2B] text-white rounded-full">
                  {producto.descuento * 100}% OFF
                </span>
                <span className="text-green-700 font-bold">
                  Antes: ${producto.precio_unidad} Ahora: $
                  {producto.precio_unidad - producto.precio_unidad * producto.descuento}
                  <span className="text-sm text-[#676767]"> / unidad</span>
                </span>
              </div>

              <ul className="mt-4 text-sm text-[#676767] space-y-1 leading-snug">
                <li><span className="font-medium text-black">Vendedor:</span> {producto.nombre_vendedor}</li>
                <li><span className="font-medium text-black">Compra mínima:</span> {producto.cantidad_minima_compra} unidades</li>
                <li><span className="font-medium text-black">Disponible:</span> {producto.cantidad} unidades</li>
              </ul>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Cantidad:</span>
                <button
                  onClick={() => setCantidad(c => Math.max(producto.cantidad_minima_compra, c - 1))}
                  className="w-8 h-8 rounded-full bg-[#48BD28] hover:bg-gray-300"
                >–</button>
                <span className="px-3 py-0.5 font-semibold">{cantidad}</span>
                <button
                  onClick={() => setCantidad(c => c + 1)}
                  className="w-8 h-8 rounded-full bg-[#48BD28] hover:bg-gray-300"
                >+</button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleComprar}
                  disabled={!isBuyer}
                  className={`w-48 py-2 rounded-lg shadow font-semibold transition
                    ${isBuyer
                      ? "bg-[#48BD28] text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                >
                  Comprar
                </button>
                <button
                  onClick={handleChat}
                  className="w-60 py-2 rounded-lg shadow font-semibold bg-[#676767] text-white hover:bg-gray-500 transition"
                >
                  Conversar con el vendedor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {noBuyer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="max-w-md mx-4 bg-white/90 p-8 rounded-2xl shadow-2xl border border-red-300 text-center"
            initial={{ scale: .8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-red-700 mb-4">Acción no permitida</h3>
            <p className="mb-6 text-gray-800">
              Solo los usuarios con rol <b>comprador</b> pueden realizar compras.
            </p>
            <button
              onClick={() => setNoBuyer(false)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
