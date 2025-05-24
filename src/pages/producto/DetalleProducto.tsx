import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import CompraModal from "@components/admin/common/BuyModal";
import { getUserRole } from "@/services/authService";
import Header from "@components/Header";

export default function DetalleProducto() {
  const { id } = useParams();
  const context = useContext(DiscountedProductContext);
  const [producto, setProducto] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mensajeNoPermitido, setMensajeNoPermitido] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleComprar = () => {
    if (userRole !== "comprador") {
      setMensajeNoPermitido(true);
      return;
    }
    setModalOpen(true);
  };

  const handleCerrarMensajeNoPermitido = () => {
    setMensajeNoPermitido(false);
  };

  const handleConfirmarCompra = (cantidad: number, ubicacion: string) => {
    // Aquí puedes hacer lógica de compra si lo deseas
    console.log("Cantidad comprada:", cantidad);
    console.log("Ubicación:", ubicacion);
    setModalOpen(false);
    navigate("/inicio");
  };

  useEffect(() => {
    if (context && id) {
      const found = context.allProducts.find(
        (p) => String(p.id) === String(id)
      );
      setProducto(found || null);
      if (found) setCantidad(found.cantidad_minima_compra || 1);
    }
  }, [context, id]);

  useEffect(() => {
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchRole();
  }, []);

  if (!context || !producto || userRole === null) {
    return <div className="p-6">Cargando producto...</div>;
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Header />

      <Link
        to="/inicio"
        className="ml-6 mt-6 inline-flex items-center text-green-700 hover:text-green-900 font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Volver al inicio
      </Link>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 mt-10 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-[400px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {producto.nombre}
          </h1>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-green-700 font-bold text-xl">
              ${producto.precio_unidad}
              <span className="text-sm font-normal text-gray-500">
                {" "}
                / unidad
              </span>
            </p>
            {producto.descuento > 0 && (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                {producto.descuento*100}% OFF
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-3">{producto.descripcion}</p>

          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Vendedor:</span>{" "}
              {producto.nombre_vendedor}
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

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Cantidad:</span>
            <button
              onClick={() =>
                setCantidad((prev) =>
                  Math.max(producto.cantidad_minima_compra, prev - 1)
                )
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

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleComprar}
              className={`${
                userRole !== "comprador"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#48BD28] hover:bg-green-600"
              } text-white font-medium px-6 py-2 rounded transition duration-300`}
            >
              Comprar
            </button>

            <button className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded hover:bg-gray-300 transition">
              Conversar con el vendedor
            </button>
          </div>
        </div>
      </div>

      {/* Modal de advertencia */}
      {mensajeNoPermitido && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/80 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center border border-red-200">
            <h3 className="mb-4 text-xl font-semibold text-red-700">
              Acción no permitida
            </h3>
            <p className="mb-6 text-gray-800">
              Solo los usuarios con el rol{" "}
              <span className="font-bold">"comprador"</span> pueden realizar
              compras.
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-200"
              onClick={handleCerrarMensajeNoPermitido}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal de compra */}
      <CompraModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmarCompra}
        producto={{
          id: producto.id,
          nombre: producto.nombre,
          cantidad_minima: producto.cantidad_minima_compra || 1,
        }}
      />
    </div>
  );
}
