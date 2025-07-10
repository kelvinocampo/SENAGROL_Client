// src/pages/producto/PaginaProductos.tsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext, useEffect, useMemo, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCartShopping } from "react-icons/fa6";
import Header from "@components/Header";
import Footer from "@components/footer";
import Buscador from "@components/Inicio/Search";
import FallingLeaves from "@components/FallingLeaf";

import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { getUserRole } from "@/services/Perfil/authService";

const formatearCOP = (numero: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(numero);

export default function PaginaProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [limiteProductos, setLimiteProductos] = useState(10);
  const [toastOK, setToastOK] = useState(false);
  const [toastNo, setToastNo] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const ctx = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  const comprar = (p: (typeof productos)[0]) => {
    if (!userRoles.includes("comprador")) {
      setToastNo(true);
      return;
    }
    navigate(`/pago/${p.id}`);
  };

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

  if (!ctx) return <p className="p-10">Cargando…</p>;
  const { allProducts, discountedProducts } = ctx;

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

  const productos = productosFiltrados.slice(0, limiteProductos);

  const carrusel = useMemo(() => {
    return [...discountedProducts]
      .filter((p) => !p.eliminado && !p.despublicado)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [discountedProducts]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0">
        <FallingLeaves quantity={20} />
      </div>

      <div className="font-[Fredoka]  min-h-screen flex flex-col flex-grow">
        <Header />

        {/* Contenedor principal con el mismo ancho que el Header */}
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="mt-6 mb-12 rounded-2xl overflow-hidden shadow-lg">
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
              {carrusel.map((p) => {
                const descuento =
                  typeof p.descuento === "string"
                    ? parseFloat(p.descuento)
                    : p.descuento;
                return (
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
                      <h3 className="text-lg ">{p.nombre}</h3>
                      {descuento > 0 && (
                        <p className="text-sm text-[#00c914] ">
                          Descuento {descuento.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </Carousel>
          </div>

          <h2 className="text-5xl sm:text-6xl font-semibold text-center text-[#48BD28] mb-4">
            Productos
          </h2>

          <div className="flex justify-center mb-10">
            <div className="w-full max-w-[550px]">
              <Buscador
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                setPaginaActual={() => {}}
                placeholderText="Buscar por nombre, vendedor o precio…"
              />
            </div>
          </div>

          {productos.length === 0 ? (
            <p className="text-center text-[#2e7c19] text-lg font-medium py-10">
              No se encontraron resultados para tu búsqueda.
            </p>
          ) : (
            <div className="grid gap-6 relative sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {productos.map((p, index) => {
  const descuento =
    typeof p.descuento === "string"
      ? parseFloat(p.descuento)
      : p.descuento;
  const precioFinal = formatearCOP(
    p.precio_unidad * (1 - descuento / 100)
  );
  return (
    <motion.div
      key={p.id}
      className="border-2 border-none bg-white rounded-xl p-4 flex flex-col text-center shadow-md"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.2, 0.8, 0.2, 1],
        bounce: 0.3,
      }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.1)",
        y: -6,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <img
        src={p.imagen}
        alt={p.nombre}
        onError={(e) => ((e.target as HTMLImageElement).src = "")}
        className="h-36 w-full object-contain rounded-lg mb-2 cursor-pointer transition hover:scale-105"
        onClick={() => navigate(`/producto/${p.id}`)}
      />

      <h3 className="font-bold text-[15px] text-black">{p.nombre}</h3>
      <p
        className="text-sm text-[#676767] mt-1 truncate cursor-help"
        title={p.descripcion}
      >
        {p.descripcion}
      </p>

      {descuento > 0 ? (
        <div className="mt-2 text-sm font-semibold">
          <p className="text-red-600">
            Antes: {formatearCOP(p.precio_unidad)}
            <span className="text-red font-semibold">
              {" "}Ahora: {precioFinal}
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-2 text-base text-[#676767] font-semibold">
          {formatearCOP(p.precio_unidad)}
        </div>
      )}

      <p className="text-[13px] text-[#676767] mt-1">
        Vendedor: {p.nombre_vendedor}
      </p>

      <button
        onClick={() => comprar(p)}
        disabled={!userRoles.includes("comprador")}
        className={`mt-4 w-full h-9 flex items-center justify-center rounded-full text-white text-sm font-semibold transition
          ${
            userRoles.includes("comprador")
              ? "bg-[#48BD28] hover:bg-[#379e1b]"
              : "bg-[#676767] cursor-not-allowed"
          }`}
        aria-label="Comprar"
      >
      
        <FaCartShopping size={20}/>
       <p className="ml-1"> Comprar </p>
      </button>

      <Link
        to={`/producto/${p.id}`}
        className="mt-2 text-[14px] text-green-600 hover:text-green-800"
      >
        Ver más
      </Link>
    </motion.div>
  );
})}

            </div>
          )}

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
        </div>

        {/* Footer ocupa todo el ancho */}
        <Footer />

        {/* Toasts */}
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
      </div>
    </>
  );
}

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
      className={`bg-white rounded-xl shadow-lg px-8 py-6 text-center ${
        ok ? "border-l-8 border-[#48BD28]" : "border-l-8 border-red-500"
      }`}
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
