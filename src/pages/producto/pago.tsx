// src/pages/producto/Pago.tsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LocationPicker } from "@components/ProductsManagement/LocationPicker";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { CardElement } from "@stripe/react-stripe-js";
import type { Product } from "@/contexts/Product/ProductsManagement";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import Header from "@components/Header";
import Footer from "@components/footer";
import { FiArrowLeft } from "react-icons/fi";

/* ---------- Tipos ---------- */
interface Location {
  lat: number;
  lng: number;
}

/* ---------- Página ---------- */
export default function Pago() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ctx = useContext(DiscountedProductContext);

  const [producto, setProducto] = useState<Product | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [ubicacion, setUbicacion] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- Obtener producto ---------- */
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

  /* ---------- Precios ---------- */
  const subtotal = (producto?.precio_unidad ?? 0) * cantidad;
  const total = subtotal + (producto?.precio_transporte ?? 0);

  /* ---------- Pagar ---------- */
  const handlePagar = async () => {
    if (!producto) return;
    if (!ubicacion) return alert("Por favor selecciona una ubicación.");
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
    } catch {
      alert("Hubo un error en la compra.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Render ---------- */
  if (!producto) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] font-[Fredoka]">
      <Header />

      <button
        onClick={() => navigate(-1)}
        className="flex font-bold items-center gap-1 text-sm ml-6 mt-4 text-[#2e7c19] hover:underline"
      >
        <FiArrowLeft /> Volver
      </button>

      <main className="flex-grow w-[92%] max-w-4xl mx-auto mt-4 lg:mt-8 grid lg:grid-cols-2 gap-10">
        {/* Columna izquierda */}
        <section>
          <h2 className="text-xl lg:text-2xl font-bold text-[#2e7c19] mb-4 lg:mb-6">
            Proceso de Pago
          </h2>

          {/* Caja de tarjeta */}
          <div className="border-2 border-[#48BD28] rounded-xl p-6 space-y-6 backdrop-blur-sm">
            <div className="flex flex-col space-y-1">
              <label htmlFor="">Número de tarjeta</label>
              <CardElement className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]" />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="">Nombre impreso en la tarjeta</label>
              <input
                placeholder="Nombre impreso en la tarjeta"
                className="w-full border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col w-1/2 space-y-1">
                <label htmlFor="">Vencimiento (MM/AA)</label>
                <input
                  placeholder="MM/AA"
                  className="border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                />
              </div>

              <div className="flex flex-col w-1/2 space-y-1">
                <label htmlFor="">CVV</label>
                <input
                  placeholder="CVV"
                  className="border border-[#48BD28] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#48BD28]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Columna derecha */}
        <section className="border-2 border-[#48BD28] rounded-xl p-4 flex w-120 flex-col gap-4 mb-8 shadow-lg">
          {/* Producto */}
          <div className="flex items-center gap-4">
            <img
              src={producto.imagen || "/placeholder.jpg"}
              alt={producto.nombre}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-black leading-none">
                {producto.nombre}
              </h3>
              <p className="text-xs text-[#676767] leading-none line-clamp-2">
                {producto.descripcion}
              </p>
              <p className="text-green-700 font-bold text-sm mt-1">
                ${producto.precio_unidad.toLocaleString()}
                <span className="text-gray-500"> / unidad</span>
              </p>
              {/* Cantidad */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Cantidad:</span>
                <button
                  onClick={() =>
                    setCantidad((c) =>
                      Math.max(producto.cantidad_minima_compra, c - 1)
                    )
                  }
                  className="w-8 h-8 rounded-full bg-[#48BD28] text-white  hover:bg-green-600"
                >
                  –
                </button>
                <span className="px-3 font-medium">{cantidad}</span>
                <button
                  onClick={() => setCantidad((c) => c + 1)}
                  className="w-8 h-8 rounded-full bg-[#48BD28] text-white  hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="h-55 w-full border-none rounded-lg overflow-hidden">
            <LocationPicker
              setLocation={setUbicacion}
              initialLocation={ubicacion}
              className="h-full w-full"
            />
          </div>

          <div className="text-sm mt-auto">
            <h4 className="font-semibold mb-1 text-black">
              Resumen del pedido
            </h4>
            <div className="flex justify-between text-[#666666]">
              <span>Cantidad</span>
              <span>{cantidad} unidades</span>
            </div>
            <div className="flex justify-between pt-1 border-t mt-1 text-[#666666]">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handlePagar}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold mt-2 transition shadow-lg
              ${loading ? "bg-green-300" : "bg-[#48BD28] hover:bg-green-600"}`}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
