/* -------------------------------------------------------------
   src/pages/producto/PaginaProductos.tsx
   – UI alineada con la maqueta (ver captura)
---------------------------------------------------------------- */
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // flechas
import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Header        from "@components/Header";
import Footer        from "@components/footer";
import Buscador      from "@components/Inicio/Search";
import CompraModal   from "@components/admin/common/BuyModal";
import FallingLeaves from "@/components/FallingLeaf";

import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { getUserRole }              from "@/services/Perfil/authService";

/* -------- Stripe -------- */
import { Elements }  from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("pk_test_51abc123...");      // 🔑 pon tu clave pública

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
  const [busqueda, setBusqueda]       = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [modalOpen, setModalOpen]   = useState(false);
  const [productoSel, setProductoSel] = useState<Producto | null>(null);

  const [toastOK, setToastOK]   = useState(false);
  const [toastNo, setToastNo]   = useState(false);

  const [userRoles, setUserRoles] = useState<string[]>([]);

  /* ----------------- context / router ----------------- */
  const ctx      = useContext(DiscountedProductContext);
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

  /* ----------------- paginación ----------------- */
  const porPagina    = 5;
  const totalPaginas = Math.ceil(productosFiltrados.length / porPagina);
  const sliceIni     = (paginaActual - 1) * porPagina;
  const productos    = productosFiltrados.slice(sliceIni, sliceIni + porPagina);

  /* ----------------- carrusel (máx. 8) ----------------- */
  const carrusel = [...discountedProducts]
    .filter((p) => !p.eliminado && !p.despublicado)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  /* ----------------- handlers ----------------- */
  const cambiarPagina = (n: number) => {
    if (n < 1 || n > totalPaginas) return;
    setPaginaActual(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const comprar = (p: Producto) => {
    if (!userRoles.includes("comprador")) {
      setToastNo(true);
      return;
    }
    setProductoSel(p);
    setModalOpen(true);
  };

  /* ==================================================== */
  return (
    <>
      {/* Hojas flotantes de fondo */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>

      <div className="font-[Fredoka] bg-gradient-to-b from-[#e9ffef] to-[#c7f6c3] min-h-screen flex flex-col">
        <Header />

        {/* ---------------- Carrusel ---------------- */}
      <div className="max-w-5xl mx-auto mt-6 mb-12 rounded-2xl boverflow-hidden shadow-lg">
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
              className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
            >
              <FaChevronLeft className="text-white bg-black" />
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-black rounded-full p-2 shadow hover:scale-105 transition"
            >
              <FaChevronRight className="text-white bg-black" />
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
          <Buscador
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            setPaginaActual={setPaginaActual}
            placeholderText="Buscar por nombre, vendedor o precio…"
          />
        </div>

        {/* ---------------- Grid productos ---------------- */}
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {productos.map((p) => (
              <motion.div
                key={p.id}
                className="bg-white rounded-2xl p-4 shadow hover:shadow-lg flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                  className="h-36 w-full object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/producto/${p.id}`)}
                />

                <h3 className="font-semibold mt-3 text-[15px]">{p.nombre}</h3>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {p.descripcion}
                </p>

                <div className="mt-2 text-sm text-gray-800 font-medium">
                  ${p.precio_unidad}
                </div>

                {p.descuento > 0 && (
                  <p className="text-xs text-green-600 font-semibold">
                    -{p.descuento * 100}%
                  </p>
                )}

                <p className="text-[11px] text-gray-400 mt-1">
                  Vendedor: {p.nombre_vendedor}
                </p>
                <button
                  onClick={() => comprar(p)}
                  disabled={!userRoles.includes("comprador")}
                  className={`mt-4 w-full py-[6px] rounded-full text-white text-sm transition
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
                  className="mt-1 text-center text-[13px] text-green-700 hover:text-green-900 underline"
                >
                  Ver más
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- Paginación ---------------- */}
        {totalPaginas > 1 && (
          <div className="mb-16 flex justify-center gap-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-3 py-[6px] rounded-full bg-white border hover:bg-gray-100 disabled:opacity-50"
            >
              ‹
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-[6px] rounded-full border
                  ${
                    paginaActual === i + 1
                      ? "bg-[#48BD28] text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-[6px] rounded-full bg-white border hover:bg-gray-100 disabled:opacity-50"
            >
              ›
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
                id:                productoSel.id,
                nombre:            productoSel.nombre,
                cantidad_minima:   productoSel.cantidad_minima_compra,
                precio_unidad:     productoSel.precio_unidad,
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
