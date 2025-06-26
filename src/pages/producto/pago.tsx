import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocationPicker } from "@components/ProductsManagement/LocationPicker";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import type { Product } from "@/contexts/Product/ProductsManagement";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import Header from "@components/Header";
import Footer from "@components/footer";

/* ---------- Tipos ---------- */
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

  const [cardholderName, setCardholderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  /* Obtener producto */
  useEffect(() => {
    if (!ctx || !id) return;
    const found = ctx.allProducts.find((p) => String(p.id) === id);
    if (!found) {
      navigate("/");
      return;
    }
    setProducto(found);
    setCantidad(found.cantidad_minima_compra);
  }, [ctx, id, navigate]);

  const subtotal = (producto?.precio_unidad ?? 0) * cantidad;
  const total = subtotal + (producto?.precio_transporte ?? 0);

  const handlePagar = async () => {
    if (!stripe || !elements) return alert("Stripe aún no está listo.");
    if (!producto) return;
    if (!ubicacion) return alert("Selecciona una ubicación.");
    if (!cardholderName || !expiry || !cvv) return alert("Completa todos los datos de la tarjeta.");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return alert("Error con el campo de tarjeta.");

    try {
      setLoading(true);
      const id_user = Number(localStorage.getItem("user_id"));
      await ProductManagementService.buyProduct(producto.id, {
        id_user,
        cantidad,
        latitud: ubicacion.lat.toFixed(6),
        longitud: ubicacion.lng.toFixed(6),
      });

      alert("¡Compra realizada con éxito!");
      navigate("/");
    } catch (err) {
      alert("Error al procesar la compra.");
    } finally {
      setLoading(false);
    }
  };

  if (!producto) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] font-[Fredoka]">
      <Header />

      <main className="flex-grow w-[92%] max-w-7xl mx-auto mt-6 p-6 flex flex-col lg:flex-row gap-10">
        {/* Columna izquierda: Formulario */}
        <section className="flex-1">
          <h2 className="text-2xl font-bold text-[#2e7c19] mb-6">Proceso de Pago</h2>

          <div className="border-2 border-[#48BD28] rounded-xl p-6 space-y-5 backdrop-blur-sm text-sm">
            <div>
              <label className="block mb-1">Número de tarjeta</label>
              <CardElement className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]" />
            </div>

            <div>
              <label className="block mb-1">Nombre impreso en la tarjeta</label>
              <input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block mb-1">Vencimiento</label>
                <input
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/AA"
                  className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                />
              </div>
              <div className="w-1/2">
                <label className="block mb-1">CVV</label>
                <input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Columna derecha: Resumen */}
        <section className="flex-1 border border-green-200 rounded-xl p-4 shadow-sm bg-white">
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

          {/* Cantidad */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm">Cantidad:</span>
            <button
              onClick={() => setCantidad((c) => Math.max(producto.cantidad_minima_compra, c - 1))}
              className="w-8 h-8 bg-[#48BD28] text-white rounded hover:bg-green-600"
            >
              –
            </button>
            <span className="px-3">{cantidad}</span>
            <button
              onClick={() => setCantidad((c) => c + 1)}
              className="w-8 h-8 bg-[#48BD28] text-white rounded hover:bg-green-600"
            >
              +
            </button>
          </div>

          {/* Mapa */}
          <div className="h-32 w-full mb-4 border rounded overflow-hidden">
            <LocationPicker
              setLocation={setUbicacion}
              initialLocation={ubicacion}
              className="h-full w-full"
            />
          </div>

          {/* Resumen */}
          <div className="text-sm text-gray-800 space-y-1 mb-4">
            <p className="font-semibold text-black">Resumen del pedido</p>
            <p>
              Cantidad: <span className="font-medium">{cantidad} unidades</span>
            </p>
            <p className="text-green-700 font-bold">
              Total: ${total.toLocaleString()}
            </p>
          </div>

          <button
            onClick={handlePagar}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-green-300" : "bg-[#48BD28] hover:bg-green-600"
            }`}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
