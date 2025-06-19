import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import CompraModal from "@components/admin/common/BuyModal";
import { BackToHome } from "@components/admin/common/BackToHome";
import { getUserRole } from "@/services/Perfil/authService";
import Header from "@components/Header";
import { motion } from "framer-motion";
import Footer from "@components/footer";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import { ProductCard } from "@/components/ProductsManagement/ProductCard";

const stripePromise = loadStripe("pk_test_51abc123..."); // 🔑 tu clave pública de Stripe

export default function DetalleProducto() {
  const { id } = useParams();
  const context = useContext(DiscountedProductContext);

  const [producto, setProducto] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [roles, setRoles] = useState<string[]>([]);
  const [mensajeNoPermitido, setMensajeNoPermitido] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();

  /* ---------- Handlers ---------- */
  const handleComprar = () => {
    if (!roles.includes("comprador")) {
      setMensajeNoPermitido(true);
      return;
    }
    setModalOpen(true);
  };

  const handleCerrarMensajeNoPermitido = () => setMensajeNoPermitido(false);

  const handleConversarConVendedor = () => {
    if (!producto?.id_vendedor) return;
    navigate(`/Chats/${producto.id_vendedor}`);
  };

  const handleConfirmarCompra = (cant: number, ubic: string) => {
    console.log("Cantidad comprada:", cant, "Ubicación:", ubic);
    setModalOpen(false);
    navigate("/");
  };

  /* ---------- Cargar producto ---------- */
  useEffect(() => {
    if (context && id) {
      const found = context.allProducts.find((p) => String(p.id) === String(id));
      setProducto(found || null);
      if (found) setCantidad(found.cantidad_minima_compra || 1);
    }
  }, [context, id]);

  /* ---------- Cargar roles usuario ---------- */
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const rolesStr = await getUserRole(); // p.ej. "comprador vendedor"
        const rolesArr = rolesStr ? rolesStr.split(/\s+/).filter(Boolean) : [];
        setRoles(rolesArr);
      } catch {
        setRoles([]);
      }
    };
    fetchRole();
  }, []);

  if (!context || !producto) {
    return <div className="p-6">Cargando producto...</div>;
  }

  const isComprador = roles.includes("comprador");

  /* ---------- Render ---------- */  
  return (
    <div className="font-[Fredoka] bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] min-h-screen flex flex-col flex-grow">
      <Header />
      <BackToHome />

      {/* ---------- Tarjeta producto ---------- */}
      <motion.div
        className="max-w-6xl mx-auto p-4 sm:p-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Imagen */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full max-w-md h-[300px] sm:h-[400px] object-contain rounded-xl border border-gray-200 shadow-sm"
            onError={(e) => ((e.target as HTMLImageElement).src = "")}
          />
        </motion.div>

        {/* Detalles */}
        <motion.div
          className="flex flex-col justify-between space-y-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>
            <p className="text-sm text-gray-600 mt-3">{producto.descripcion}</p>
            
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              <p className="text-white bg-[#FF2B2B] rounded-full font-semibold shadow transition px-2">{producto.descuento*100}% OFF</p>
              <p className="text-green-700 font-bold text-xl">
                ${producto.precio_unidad}
                <span className="text-sm font-normal text-gray-500"> / unidad</span>
              </p>
              {producto.descuento > 0 && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                  {producto.descuento * 100}% OFF
                </span>
              )}
            </div>

      

            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-semibold">Vendedor:</span> {producto.nombre_vendedor}
              </p>
              <p>
                <span className="font-semibold">Compra mínima:</span>{" "}
                {producto.cantidad_minima_compra} unidades
              </p>
              <p>
                <span className="font-semibold">Cantidad disponible:</span>{" "}
                {producto.cantidad} unidades
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col gap-4">
            {/* Selector cantidad */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Cantidad:</span>
              <button
                onClick={() =>
                  setCantidad((prev) => Math.max(producto.cantidad_minima_compra, prev - 1))
                }
                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
              >
                –
              </button>
              <span className="text-lg">{cantidad}</span>
              <button
                onClick={() => setCantidad((prev) => prev + 1)}
                className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Botones acción */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={handleComprar}
                className={`${
                  !isComprador
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#48BD28] hover:bg-green-600"
                } w-full text-white font-medium px-6 py-2 rounded transition duration-300`}
              >
                Comprar
              </button>

              <button
                onClick={handleConversarConVendedor}
                className="w-full bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded hover:bg-gray-300 transition"
              >
                Conversar con el vendedor
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------- Modal: acción no permitida ---------- */}
      {mensajeNoPermitido && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-white/80 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center border border-red-200"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="mb-4 text-xl font-semibold text-red-700">Acción no permitida</h3>
            <p className="mb-6 text-gray-800">
              Solo los usuarios con el rol <span className="font-bold">"comprador"</span> pueden
              realizar compras.
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200"
              onClick={handleCerrarMensajeNoPermitido}
            >
              Cerrar
            </button>
          </motion.div>
        </div>
      )}

      {/* ---------- Modal de compra (envuelto en Elements) ---------- */}
      <Elements stripe={stripePromise}>
        <CompraModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmarCompra}
          producto={{
            id: producto.id,
            nombre: producto.nombre,
            cantidad_minima: producto.cantidad_minima_compra || 1,
            precio_unidad: producto.precio_unidad,
            precio_transporte: producto.precio_transporte,
          }}
        />
      </Elements>

      <Footer />
    </div>
  );
}
