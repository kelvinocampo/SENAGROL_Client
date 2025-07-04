// src/pages/producto/DetalleProducto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { BackToHome } from "@components/admin/common/BackToHome";
import { getUserRole } from "@/services/Perfil/authService";
import { ChatService } from "@/services/Chats/ChatService"; 
import Header from "@components/Header";
import Footer from "@components/footer";
import { motion } from "framer-motion";
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
      const found = context.allProducts.find((p) => String(p.id) === id);
      setProducto(found ?? null);
      if (found) setCantidad(found.cantidad_minima_compra || 1);
    }
  }, [context, id]);

  useEffect(() => {
    (async () => {
      try {
        const r = (await getUserRole()).split(/\s+/).filter(Boolean);
        setRoles(r);
      } catch {
        setRoles([]);
      }
    })();
  }, []);

  const isBuyer = roles.includes("comprador");

 const handleComprar = () => {
  if (!isBuyer) {
    setNoBuyer(true);
    return;
  }

  if (producto?.id) {
    localStorage.setItem("cantidad_compra", cantidad.toString()); // 💾 Guardar cantidad
    navigate(`/pago/${producto.id}`);
  }
};

  const handleChat = async () => {
    try {
      if (!producto?.id_vendedor) return;
      const chat = await ChatService.createOrGetChatWithUser(producto.id_vendedor);
      if (chat?.id_chat) {
        navigate(`/Chats/${chat.id_chat}`);
      } else {
        alert("No se pudo obtener o crear el chat.");
      }
    } catch (err) {
      console.error("Error al crear o recuperar el chat:", err);
      alert("Ocurrió un error al intentar conversar con el vendedor.");
    }
  };

  if (!context || !producto) return <div className="p-6">Cargando producto…</div>;

  const precioConDescuento = producto.precio_unidad - producto.precio_unidad * producto.descuento;

  return (
    <div className="font-[Fredoka] min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3]">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>
      <Header />
      <BackToHome />

      {/* Responsive mobile */}
      <section className="lg:hidden p-4 flex flex-col gap-6">
        <img
          src={producto.imagen || "/placeholder.jpg"}
          alt={producto.nombre}
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-2xl font-bold text-black">{producto.nombre}</h1>
          <p className="text-sm text-[#676767] mt-1">{producto.descripcion}</p>
          <p className="text-green-700 font-bold mt-2">
            Ahora: ${precioConDescuento.toLocaleString()} / unidad
          </p>

          <div className="mt-4 text-sm text-[#676767] space-y-1">
            <p><b>Vendedor:</b> {producto.nombre_vendedor}</p>
            <p><b>Compra mínima:</b> {producto.cantidad_minima_compra} unidades</p>
            <p><b>Disponible:</b> {producto.cantidad} unidades</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-medium">Cantidad:</span>
            <button
              onClick={() => setCantidad((c) => Math.max(producto.cantidad_minima_compra, c - 1))}
              className="w-8 h-8 bg-[#48BD28] text-white rounded"
            >-</button>
            <input
              type="number"
              value={cantidad}
              min={producto.cantidad_minima_compra}
              max={producto.cantidad}
              onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = producto.cantidad_minima_compra;
                val = Math.max(producto.cantidad_minima_compra, Math.min(val, producto.cantidad));
                setCantidad(val);
              }}
              className="w-16 text-center border rounded"
            />
            <button
              onClick={() => setCantidad((c) => Math.min(producto.cantidad, c + 1))}
              className="w-8 h-8 bg-[#48BD28] text-white rounded"
            >+</button>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleComprar}
              disabled={!isBuyer || cantidad < producto.cantidad_minima_compra}
              className={`w-full py-2 rounded-lg shadow font-semibold transition
                ${isBuyer && cantidad >= producto.cantidad_minima_compra
                  ? "bg-[#48BD28] text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
            >
              Comprar
            </button>

            <button
              onClick={handleChat}
              className="w-full py-2 rounded-lg shadow font-semibold bg-[#676767] text-white hover:bg-gray-500"
            >
              Conversar con el vendedor
            </button>
          </div>
        </div>
      </section>

      {/* Desktop */}
      <motion.section
        className="hidden lg:grid w-[92%] max-w-7xl mx-auto mt-6 grid-cols-[490px_1fr] gap-10 p-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="flex items-center justify-center">
          <img
            src={producto.imagen || "/placeholder.jpg"}
            alt={producto.nombre}
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </motion.div>

        <motion.div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">{producto.nombre}</h1>
            <p className="text-sm text-[#676767] mt-2">{producto.descripcion}</p>
            <p className="text-green-700 font-bold mt-3">
              Ahora: ${precioConDescuento.toLocaleString()} / unidad
            </p>
            <ul className="mt-4 text-sm text-[#676767] space-y-1">
              <li><b>Vendedor:</b> {producto.nombre_vendedor}</li>
              <li><b>Compra mínima:</b> {producto.cantidad_minima_compra} unidades</li>
              <li><b>Disponible:</b> {producto.cantidad} unidades</li>
            </ul>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Cantidad:</span>
              <button
                onClick={() => setCantidad((c) => Math.max(producto.cantidad_minima_compra, c - 1))}
                className="w-8 h-8 rounded-full bg-[#48BD28] hover:bg-green-500 text-white"
              >-</button>
              <input
                type="number"
                value={cantidad}
                min={producto.cantidad_minima_compra}
                max={producto.cantidad}
                onChange={(e) => {
                  let val = parseInt(e.target.value, 10);
                  if (isNaN(val)) val = producto.cantidad_minima_compra;
                  val = Math.max(producto.cantidad_minima_compra, Math.min(val, producto.cantidad));
                  setCantidad(val);
                }}
                className="w-16 text-center border rounded"
              />
              <button
                onClick={() => setCantidad((c) => Math.min(producto.cantidad, c + 1))}
                className="w-8 h-8 rounded-full bg-[#48BD28] hover:bg-green-500 text-white"
              >+</button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleComprar}
                disabled={!isBuyer || cantidad < producto.cantidad_minima_compra}
                className={`w-48 py-2 rounded-lg shadow font-semibold transition
                  ${isBuyer && cantidad >= producto.cantidad_minima_compra
                    ? "bg-[#48BD28] text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
              >
                Comprar
              </button>
              <button
                onClick={handleChat}
                className="w-60 py-2 rounded-lg shadow font-semibold bg-[#676767] text-white hover:bg-gray-500"
              >
                Conversar con el vendedor
              </button>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {noBuyer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="max-w-md mx-4 bg-white/90 p-8 rounded-2xl shadow-2xl border border-red-300 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
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
