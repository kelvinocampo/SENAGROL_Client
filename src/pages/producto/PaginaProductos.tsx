/* -------------------------------------------------------------
   src/pages/producto/PaginaProductos.tsx
   – UI alineada con la maqueta:
     · Grid continuo (5 col XL, 4 col LG, 3 col MD, 2 col SM)
     · Botón “Ver más” → carga 10 productos adicionales
---------------------------------------------------------------- */
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "@components/Header";
import Footer from "@components/footer";
import Buscador from "@components/Inicio/Search";
import CompraModal from "@/pages/producto/pago";
import FallingLeaves from "@/components/FallingLeaf";

import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { getUserRole } from "@/services/Perfil/authService";

/* -------- Stripe -------- */
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51abc123..."); // 🔑 tu clave pública

/* -------- Tipos --------- */
type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  descuento: number;
  precio_unidad: number;
  precio_transporte: number;
  cantidad: number;
  cantidad_minima_compra: number;
  nombre_vendedor: string;
  eliminado: boolean;
  despublicado: boolean;
};

export default function PaginaProductos() {
  /* ----------------- state ----------------- */
  const [busqueda, setBusqueda] = useState("");
  const [limiteProductos, setLimiteProductos] = useState(10); // ← muestra inicial
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSel, setProductoSel] = useState<Producto | null>(null);
  const [toastOK, setToastOK] = useState(false);
  const [toastNo, setToastNo] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  /* ----------------- context / router ----------------- */
  const ctx = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  /* ----------------- roles ----------------- */
  useEffect(() => {
    (async () => {
      try {
        const roles = (await getUserRole())?.split(/\s+/).filter(Boolean) || [];
        setUserRoles(roles);
      } catch {
        setUserRoles([]);
      }
    })();
  }, []);

  /* ----------------- loading ----------------- */
  if (!ctx) return <p className="p-10">Cargando…</p>;
  const { allProducts, discountedProducts } = ctx;

  /* ----------------- filtros ----------------- */
  const productosFiltrados = allProducts
    .filter((p) => !p.eliminado && !p.despublicado)
    .filter((p) => {
      const q = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(q) ||
        p.nombre_vendedor?.toLowerCase().includes(q) ||
        p.precio_unidad.toString().includes(q)
      );
    });

  /* ----------------- visibles según “Ver más” ----------------- */
  const productos = productosFiltrados.slice(0, limiteProductos);

  /* ----------------- carrusel (máx. 8) ----------------- */
  const carrusel = [...discountedProducts]
    .filter((p) => !p.eliminado && !p.despublicado)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  /* ----------------- comprar handler ----------------- */
  const comprar = (p: any) => {
    if (!userRoles.includes("comprador")) {
      setToastNo(true);
      return;
    }
    const productoCompleto: Producto = {
      ...p,
      precio_transporte: p.precio_transporte ?? 0,
    };
    setProductoSel(productoCompleto);
    setModalOpen(true);
  };

  /* ==================================================== */
  return (
    <>
      {/* Hojas flotantes de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>

      <div className="font-[Fredoka] bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] min-h-screen flex flex-col flex-grow">
        <Header />

        {/* ---------------- Carrusel ---------------- */}
        <div className="max-w-5xl mx-auto mt-6 mb-12 rounded-2xl overflow-hidden shadow-lg">
          <Carousel
            autoPlay
            infiniteLoop
            interval={5000}
            showThumbs={false}
            showStatus={false}
            showIndicators={false}
            swipeable
            emulateTouch
            renderArrowPrev={(onClickHandler, hasPrev, label) =>
              hasPrev && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
                >
                  <FaChevronLeft className="text-white" />
                </button>
              )
            }
            renderArrowNext={(onClickHandler, hasNext, label) =>
              hasNext && (
                <button
                  type="button"
                  onClick={onClickHandler}
                  title={label}
                  className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
                >
                  <FaChevronRight className="text-white" />
                </button>
              )
            }
          >
            {carrusel.map((p) => (
              <motion.div
                key={p.id}
                onClick={() => navigate(`/producto/${p.id}`)}
                className="relative cursor-pointer"
                whileHover={{ scale: 1.01 }}
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="h-64 md:h-96 w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-black/70 text-white px-4 py-2 rounded-lg text-center">
                  <h3 className="text-lg font-semibold">{p.nombre}</h3>
                  {p.descuento > 0 && (
                    <p className="text-sm text-[#00c914] font-medium">
                      Descuento {Math.round(p.descuento * 10000) / 100}%
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

        {/* ---------------- Título + buscador ---------------- */}
        <h2 className="text-6xl font-extrabold text-center text-[#48BD28] mb-4">
          Productos
        </h2>

        <div className="flex justify-center mb-10">
          <div className="w-full max-w-[550px]">
            <Buscador
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              setPaginaActual={() => {}} // ya no usamos paginado, pero mantenemos firma
              placeholderText="Buscar por nombre, vendedor o precio…"
            />
          </div>
        </div>

        {/* ---------------- Grid productos ---------------- */}
        <section className="max-w-7xl mx-auto px-4 mb-12 relative">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productos.map((p) => (
              <motion.div
                key={p.id}
                className="border-2 border-none bg-white rounded-xl p-4 flex flex-col text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                  className="h-36 w-full object-contain rounded-lg mb-2 cursor-pointer"
                  onClick={() => navigate(`/producto/${p.id}`)}
                />

                <h3 className="font-bold text-[15px]">{p.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {p.descripcion}
                </p>

                {/* Precio */}
                {p.descuento > 0 ? (
                  <div className="mt-2 text-sm font-semibold">
                    <p className="text-red-600">
                      Antes: {p.precio_unidad.toLocaleString()}{" "}
                      <span className="text-red ">
                        Ahora:{" "}
                        {(
                          p.precio_unidad -
                          p.precio_unidad * p.descuento
                        ).toLocaleString()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="mt-2 text-base text-[#676767] font-semibold">
                    ${p.precio_unidad}
                  </div>
                )}

                <p className="text-[13px] text-gray-500 mt-1">
                  Vendedor: {p.nombre_vendedor}
                </p>

                <button
                  onClick={() => comprar(p)}
                  disabled={!userRoles.includes("comprador")}
                  className={`mt-4 w-full py-[6px] rounded-full text-white text-sm font-semibold transition
      ${
        userRoles.includes("comprador")
          ? "bg-[#48BD28] hover:bg-[#379e1b]"
          : "bg-gray-400 cursor-not-allowed"
      }`}
                >
                  Comprar
                </button>

                <Link
                  to={`/producto/${p.id}`}
                  className="mt-2 text-[14px] text-green-600 hover:text-green-800"
                >
                  Ver más
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {productosFiltrados.length > productos.length && (
          <div className="flex justify-center mb-16">
            <button
              onClick={() => setLimiteProductos((prev) => prev + 10)}
              className="bg-[#48BD28] hover:bg-[#379E1B] text-white px-15 py-2 rounded-full font-semibold shadow transition "
            >
              Ver más
            </button>
          </div>
        )}

        {/* ---------------- Modales / toasts ---------------- */}
        {productoSel && (
          <Elements stripe={stripePromise}>
            <CompraModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onConfirm={() => setToastOK(true)}
              producto={{
                id: productoSel.id,
                nombre: productoSel.nombre,
                cantidad_minima: productoSel.cantidad_minima_compra,
                precio_unidad: productoSel.precio_unidad,
                precio_transporte: productoSel.precio_transporte ?? 0,
              }}
            />
          </Elements>
        )}

        {toastOK && (
          <Toast
            msg="¡Compra realizada con éxito!"
            ok
            onClose={() => setToastOK(false)}
          />
        )}
        {toastNo && (
          <Toast
            msg="Debes ingresar como comprador para comprar."
            ok={false}
            onClose={() => setToastNo(false)}
          />
        )}

        <Footer />
      </div>
    </>
  );
}

/* ---------- pequeño toast reutilizable ---------- */
const Toast = ({
  msg,
  ok,
  onClose,
}: {
  msg: string;
  ok: boolean;
  onClose: () => void;
}) => (
  <div
    onClick={onClose}
    className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[1px]"
  >
    <div
      className={`bg-white rounded-xl shadow-lg px-8 py-6 text-center
        ${ok ? "border-l-8 border-[#48BD28]" : "border-l-8 border-red-500"}`}
    >
      <p className="font-semibold mb-4">{msg}</p>
      <button
        className={`px-4 py-2 rounded text-white ${
          ok ? "bg-[#48BD28]" : "bg-red-500"
        }`}
      >
        Cerrar
      </button>
    </div>
  </div>
);
