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
  const navigate = useNavigate();
  const context = useContext(DiscountedProductContext);

  const [producto, setProducto] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [roles, setRoles] = useState<string[]>([]);
  const [noBuyer, setNoBuyer] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isBuyer = roles.includes("comprador");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (context && id) {
      const found = context.allProducts.find((p) => String(p.id) === id);
      setProducto(found ?? null);
      if (found) {
        setCantidad(found.cantidad_minima_compra || 1);
      }
    }
  }, [context, id]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const r = (await getUserRole()).split(/\s+/).filter(Boolean);
        setRoles(r);
      } catch {
        setRoles([]);
      }
    };
    fetchRoles();
  }, []);

  const handleComprar = () => {
    if (!isBuyer) {
      setNoBuyer(true);
      return;
    }
    if (producto?.id) {
      localStorage.setItem("cantidad_compra", cantidad.toString());
      navigate(`/pago/${producto.id}`);
    }
  };

  const handleChat = async () => {
    if (!isAuthenticated) {
      setNotLoggedIn(true);
      return;
    }

    try {
      if (!producto?.id_vendedor) return;
      const chat = await ChatService.createOrGetChatWithUser(producto.id_vendedor);
      if (chat) {
        navigate(`/Chats/${chat}`);
      } else {
        alert("No se pudo obtener o crear el chat.");
      }
    } catch (err) {
      console.error("Error al crear o recuperar el chat:", err);
      alert("Ocurrió un error al intentar conversar con el vendedor.");
    }
  };

  if (!context || !producto)
    return <div className="p-6">Cargando producto…</div>;

  const precioConDescuento =
    producto.precio_unidad - producto.precio_unidad * producto.descuento;

 const ControlCantidad = () => (
  <div className="flex items-center">
    <span className="text-sm font-medium mr-2">Cantidad:</span>

    <button
      onClick={() =>
        setCantidad((c) => Math.max(producto.cantidad_minima_compra, c - 1))
      }
      className="w-6 h-6 rounded-full bg-[#48BD28] text-white"
    >
      -
    </button>

    <input
      type="value"
      value={cantidad}
      min={producto.cantidad_minima_compra}
      max={producto.cantidad}
      onChange={(e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = producto.cantidad_minima_compra;
        val = Math.max(
          producto.cantidad_minima_compra,
          Math.min(val, producto.cantidad)
        );
        setCantidad(val);
      }}
      className="w-8 h-6 text-center border-none rounded text-sm px-1 [-moz-appearance:textfield] focus:outline-none"
    />

    <button
      onClick={() => setCantidad((c) => Math.min(producto.cantidad, c + 1))}
      className="w-6 h-6 bg-[#48BD28] text-white rounded-full"
    >
      +
    </button>
  </div>
);


  return (
    <div className="font-[Fredoka] min-h-screen flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>

      <Header />
    
      <div className="relative w-full max-w-350 mx-auto px-4 sm:px-6">
        
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 -mt-2">
  <BackToHome className="text-left text-sm sm:text-base" />
</div>
        <motion.section
          className="grid grid-cols-1 ml-40 lg:grid-cols-[500px_1fr]  gap-10 pt-20 pb-30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="flex items-center justify-center">
            <img
              src={producto.imagen || "/placeholder.jpg"}
              alt={producto.nombre}
              className="w-full max-w-full h-[340px] object-cover rounded-xl shadow-lg"
              onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
            />
          </motion.div>

          <motion.div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{producto.nombre}</h1>
              <p className="text-sm text-[#676767] mb-3">{producto.descripcion}</p>
              <p className="bg-[#FF2B2B] text-white font-semibold text-center w-20 rounded-full">{producto.descuento*100}% OFF</p>
              <p className="text-[#1B7D00] font-semibold mb-2">
                <span className=" mr-2">
                  Antes: ${producto.precio_unidad.toLocaleString()}
                </span>
                Ahora: ${precioConDescuento.toLocaleString()} <span className="text-[#676767] font-normal">/ unidad</span>
              </p>
              <ul className="mt-2 text-sm text-[#676767] font-normal space-y-1 mb-6">
                <li><b className="text-black font-normal ">Vendedor:</b> {producto.nombre_vendedor}</li>
                <li><b  className="text-black font-normal ">Compra mínima:</b> {producto.cantidad_minima_compra} unidades</li>
                <li><b  className="text-black font-normal ">Disponible:</b> {producto.cantidad} unidades</li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              {ControlCantidad()}
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  onClick={handleComprar}
                  disabled={!isBuyer || cantidad < producto.cantidad_minima_compra}
                  className={`w-full sm:w-48 py-2 rounded-xl shadow font-semibold transition
                    ${
                      isBuyer && cantidad >= producto.cantidad_minima_compra
                        ? "bg-[#48BD28]  text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Comprar
                </button>

                <button
                  onClick={handleChat}
                  disabled={!isAuthenticated}
                  className={`w-full sm:w-60 py-2 rounded-xl shadow font-semibold transition
                    ${
                      isAuthenticated
                        ? "bg-[#676767] text-white hover:bg-gray-500"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Conversar con el vendedor
                </button>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>

      {/* Modales */}
      {noBuyer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="max-w-md mx-4 bg-white/90 p-8 rounded-2xl shadow-2xl border border-red-300 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-red-700 mb-4">
              Acción no permitida
            </h3>
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

      {notLoggedIn && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            className="max-w-md mx-4 bg-white/90 p-8 rounded-2xl shadow-2xl border border-yellow-400 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-yellow-600 mb-4">
              No has iniciado sesión
            </h3>
            <p className="mb-6 text-gray-800">
              Inicia sesión para conversar con el vendedor.
            </p>
            <button
              onClick={() => setNotLoggedIn(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full"
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
