import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BackToHome } from "@components/admin/common/BackToHome";
import { LocationPicker } from "@components/ProductsManagement/LocationPicker";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Product } from "@/contexts/Product/ProductsManagement";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import Header from "@components/Header";
import Footer from "@components/footer";
import { MessageDialog } from "@/components/admin/common/MessageDialog";

type Location = { lat: number; lng: number };

export default function Pago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(DiscountedProductContext);

  const stripe = useStripe();
  const elements = useElements();

  const [producto, setProducto] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [cardholderName, setCardholderName] = useState("");
  const [cardErrors, setCardErrors] = useState({
    number: null as string | null,
    expiry: null as string | null,
    cvc: null as string | null,
  });
  const [cardStatus, setCardStatus] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  useEffect(() => {
    if (!ctx || !id) return;
    const found = ctx.allProducts.find((p) => String(p.id) === id);
    if (!found) {
      navigate("/");
      return;
    }

    setProducto(found);

    const storedQty = localStorage.getItem("cantidad_compra");
    const parsedQty = storedQty ? parseInt(storedQty, 10) : found.cantidad_minima_compra;
    const finalQty = Math.min(Math.max(parsedQty, found.cantidad_minima_compra), found.cantidad);
    setCantidad(finalQty);
  }, [ctx, id, navigate]);

  useEffect(() => {
    setUbicacion({ lat: 4.65, lng: -74.05 }); // Bogotá
  }, []);

  const subtotal = (producto?.precio_unidad ?? 0) * cantidad;
  const total = subtotal + (producto?.precio_transporte ?? 0);

  const hasCardErrors =
    !!cardErrors.number || !!cardErrors.expiry || !!cardErrors.cvc;

  const isFormValid = () => {
    return (
      !!cardholderName &&
      !hasCardErrors &&
      cardStatus.number &&
      cardStatus.expiry &&
      cardStatus.cvc &&
      !!ubicacion &&
      !!stripe &&
      !!elements &&
      !!producto
    );
  };

  const handlePagar = async () => {
    if (!stripe || !elements) {
      setModalMessage("Stripe aún no está listo.");
      return;
    }

    if (!producto) return;
    if (!ubicacion) return setModalMessage("Selecciona una ubicación.");
    if (!cardholderName) return setModalMessage("Completa el nombre del titular de la tarjeta.");
    if (hasCardErrors) return setModalMessage("Corrige los errores en la tarjeta.");

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) return setModalMessage("Error con el campo de tarjeta.");

    try {
      setLoading(true);
      const id_user = Number(localStorage.getItem("user_id"));

      await ProductManagementService.buyProduct(producto.id, {
        id_user,
        cantidad,
        latitud: ubicacion.lat.toFixed(6),
        longitud: ubicacion.lng.toFixed(6),
      });

      localStorage.removeItem("cantidad_compra");
      setModalMessage("¡Compra realizada con éxito!");
      setTimeout(() => navigate("/"), 2500);
    } catch (err) {
      setModalMessage("Error al procesar la compra.");
    } finally {
      setLoading(false);
    }
  };

  if (!producto) return null;

  return (
    <div className="min-h-screen flex flex-col font-[Fredoka]">
      <Header />

      <BackToHome
        className="absolute top-30 left-4 sm:left-25  z-50"
        title="Volver"
        route={`/producto/${producto.id}`}
      />

      <main className="flex-grow w-[92%] max-w-7xl mx-auto mt-6 p-6 flex flex-col lg:flex-row gap-10">
        <section className="flex-1">
          <h2 className="text-2xl font-bold text-black mb-6">Proceso de Pago</h2>
          <div className="border-2 border-[#48BD28] rounded-xl p-6 space-y-5 backdrop-blur-sm text-sm">
            <div>
              <label className="block mb-1">Nombre impreso en la tarjeta</label>
              <input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
              />
            </div>

            <div>
              <label className="block mb-1">Número de tarjeta</label>
              <CardNumberElement
                className="w-full border border-[#48BD28] rounded-lg p-3"
                onChange={(e) => {
                  setCardErrors((prev) => ({ ...prev, number: e.error?.message || null }));
                  setCardStatus((prev) => ({ ...prev, number: e.complete }));
                }}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1">Vencimiento</label>
                <CardExpiryElement
                  className="w-full border border-[#48BD28] rounded-lg p-3"
                  onChange={(e) => {
                    setCardErrors((prev) => ({ ...prev, expiry: e.error?.message || null }));
                    setCardStatus((prev) => ({ ...prev, expiry: e.complete }));
                  }}
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-1">CVV</label>
                <CardCvcElement
                  className="w-full border border-[#48BD28] rounded-lg p-3"
                  onChange={(e) => {
                    setCardErrors((prev) => ({ ...prev, cvc: e.error?.message || null }));
                    setCardStatus((prev) => ({ ...prev, cvc: e.complete }));
                  }}
                />
              </div>
            </div>

            {hasCardErrors && (
              <p className="text-red-500 text-sm mt-1">
                {cardErrors.number || cardErrors.expiry || cardErrors.cvc}
              </p>
            )}
          </div>
        </section>

        <section className="flex-1 border border-green-700 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={producto.imagen || "/placeholder.jpg"}
              alt={producto.nombre}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-black">{producto.nombre}</h3>
              {producto.descripcion && (
                <p className="text-sm text-[#676767]">{producto.descripcion}</p>
              )}
              <p className="text-green-700 font-bold text-sm">
                ${producto.precio_unidad.toLocaleString()}
                <span className="text-gray-500"> / unidad</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">Cantidad:</span>

            <button
              onClick={() => setCantidad((c) => Math.max(producto.cantidad_minima_compra, c - 1))}
              disabled={cantidad <= producto.cantidad_minima_compra}
              className={`w-6 h-6 rounded-full text-white ${
                cantidad <= producto.cantidad_minima_compra
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-[#48BD28] hover:bg-green-600"
              }`}
            >
              –
            </button>

            <input
              type="value"
              value={cantidad}
              onChange={(e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = producto.cantidad_minima_compra;
                val = Math.max(producto.cantidad_minima_compra, Math.min(val, producto.cantidad));
                setCantidad(val);
              }}
              min={producto.cantidad_minima_compra}
              max={producto.cantidad}
              className="w-8 h-6 text-center border-none rounded text-sm px-1 [-moz-appearance:textfield] focus:outline-none"
            />

            <button
              onClick={() => setCantidad((c) => Math.min(producto.cantidad, c + 1))}
              disabled={cantidad >= producto.cantidad}
              className={`w-6 h-6 rounded-full text-white ${
                cantidad >= producto.cantidad
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-[#48BD28] hover:bg-green-600"
              }`}
            >
              +
            </button>

            <span className="ml-6 text-sm text-gray-700">Stock: {producto.cantidad}</span>
          </div>

          <div className="h-40 w-full mb-4 border rounded overflow-hidden">
            <LocationPicker
              setLocation={setUbicacion}
              initialLocation={ubicacion}
              className="h-full w-full"
            />
          </div>

          <div className="text-sm text-gray-800 space-y-1 mb-4">
            <p className="font-semibold text-black">Resumen del pedido</p>
            <p>
              Cantidad: <span className="font-medium">{cantidad} unidades</span>
            </p>
            <p className="text-green-700 font-bold">Total: ${total.toLocaleString()}</p>
          </div>

          <button
            onClick={handlePagar}
            disabled={loading || !isFormValid()}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading || !isFormValid()
                ? "bg-green-300 cursor-not-allowed"
                : "bg-[#48BD28] hover:bg-green-600"
            }`}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </section>
      </main>

      <Footer />

      {/* MODAL */}
      <MessageDialog
        isOpen={!!modalMessage}
        onClose={() => setModalMessage("")}
        message={modalMessage}
      />
    </div>
  );
}
