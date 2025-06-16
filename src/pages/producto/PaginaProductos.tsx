import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Buscador from "@components/Inicio/Search";
import Header from "@components/Header";
import CompraModal from "@components/admin/common/BuyModal";
import FallingLeaves from "@/components/FallingLeaf";
import Footer from "@components/footer";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { getUserRole } from "@/services/Perfil/authService";

export default function PaginaProductos() {
  /* ------------------- Estados ------------------- */
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(
    null
  );
  const [mensajeCompraExitosa, setMensajeCompraExitosa] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState<
    number | null
  >(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<
    string | null
  >(null);
  const [mensajeNoPermitido, setMensajeNoPermitido] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  /* ------------------- Context & nav ------------------- */
  const context = useContext(DiscountedProductContext);
  const navigate = useNavigate();
  const productosPorPagina = 5;

  /* ------------------- Cargar roles ------------------- */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesStr = await getUserRole(); // "comprador vendedor"
        const rolesArr = rolesStr ? rolesStr.split(/\s+/).filter(Boolean) : [];
        setUserRoles(rolesArr);
      } catch {
        setUserRoles([]);
      }
    };
    fetchRoles();
  }, []);

  if (!context) return <p className="p-10">Cargando productos...</p>;
  const { allProducts, discountedProducts } = context;

  /* ------------------- Filtro y paginación ------------------- */
  const productosFiltrados = allProducts
    .filter((p) => !p.eliminado && !p.despublicado)
    .filter((p) => {
      const busquedaLower = busqueda.toLowerCase();
      return (
        p.nombre.toLowerCase().includes(busquedaLower) ||
        p.nombre_vendedor?.toLowerCase().includes(busquedaLower) ||
        p.precio_unidad.toString().includes(busquedaLower)
      );
    });

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPaginados = productosFiltrados.slice(
    indiceInicio,
    indiceInicio + productosPorPagina
  );

  /* ------------------- Carrusel (máx 8 al azar) ------------------- */
  const productosCarrusel = [...discountedProducts]
    .filter((p) => !p.eliminado && !p.despublicado)
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  /* ------------------- Handlers ------------------- */
  const cambiarPagina = (n: number) => {
    if (n >= 1 && n <= totalPaginas) {
      setPaginaActual(n);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComprar = (producto: any) => {
    if (!userRoles.includes("comprador")) {
      setMensajeNoPermitido(true);
      return;
    }
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const handleConfirmarCompra = (cant: number, ubic: string) => {
    setCantidadSeleccionada(cant);
    setUbicacionSeleccionada(ubic);
    setModalOpen(false);
    setMensajeCompraExitosa(true);
  };

  const handleCerrarMensajeCompra = () => {
    setMensajeCompraExitosa(false);
    if (productoSeleccionado && cantidadSeleccionada && ubicacionSeleccionada) {
      console.log("Compra registrada:", {
        producto: productoSeleccionado,
        cantidad: cantidadSeleccionada,
        ubicacion: ubicacionSeleccionada,
      });
    }
  };

  /* ------------------- JSX ------------------- */
  return (
    <>
      <div className="fixed inset-0 z-[0] pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      <div className="font-[Fredoka] bg-neutral-50 px-4 sm:px-6">
        <Header />

        {/* ---------- Carrusel ---------- */}
        <div className="max-w-5xl mx-auto mb-10">
          <Carousel
            autoPlay
            infiniteLoop
            interval={5000}
            showThumbs={false}
            showStatus={false}
            swipeable
            emulateTouch
          >
            {productosCarrusel.map((p) => (
              <motion.div
                key={p.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/producto/${p.id}`)}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 80,
                }}
              >
                <motion.img
                  src={p.imagen}
                  alt={p.nombre}
                  className="object-cover h-60 sm:h-50 md:h-96 w-full transition-all duration-1000 ease-in-out"
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{
                    duration: 10,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "mirror",
                  }}
                />
                <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md text-white px-6 py-4">
                  <h3 className="text-xl font-bold">{p.nombre}</h3>
                  {p.descuento > 0 && (
                    <p className="text-sm text-green-300">
                      Descuento: {p.descuento * 100}%
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

        <Buscador
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          setPaginaActual={setPaginaActual}
          placeholderText="Buscar por nombre, vendedor o precio..."
        />

        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {productosPaginados.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 text-center shadow hover:shadow-md"
              >
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  onClick={() => navigate(`/producto/${p.id}`)}
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                />
                <h3 className="font-bold mt-2">{p.nombre}</h3>
                <p
                  className="text-sm text-gray-600 truncate"
                  title={p.descripcion}
                >
                  {p.descripcion.slice(0, 30)}...
                </p>
                <p className="text-sm text-gray-800 font-semibold mt-1">
                  ${p.precio_unidad}
                </p>
                {p.descuento > 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    Descuento: {p.descuento * 100}%
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Vendedor: {p.nombre_vendedor}
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => handleComprar(p)}
                    disabled={!userRoles.includes("comprador")}
                    className={`text-white px-6 py-2 rounded-full transition ${
                      !userRoles.includes("comprador")
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 hover:-translate-y-1 hover:scale-105"
                    }`}
                  >
                    Comprar
                  </button>
                  <Link
                    to={`/producto/${p.id}`}
                    className="text-green-700 underline text-sm hover:text-green-900"
                  >
                    Ver más
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <div className="inline-flex space-x-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-1 border rounded transition transform ${
                  paginaActual === i + 1
                    ? "bg-green-400 text-white shadow-md"
                    : "hover:bg-green-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
        {productoSeleccionado && (
          <CompraModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmarCompra}
            producto={{
              id: productoSeleccionado.id,
              nombre: productoSeleccionado.nombre,
              cantidad_minima: productoSeleccionado.cantidad_minima_compra,
              precio_unidad: productoSeleccionado.precio_unidad,
              precio_transporte: productoSeleccionado.precio_transporte ?? 0,
            }}
          />
        )}

        {/* ---------- Mensajes ---------- */}
        {mensajeCompraExitosa && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded p-8 shadow-lg max-w-sm mx-4 text-center">
              <h3 className="mb-6 text-lg font-bold">
                ¡Compra realizada con éxito!
              </h3>
              <button
                onClick={handleCerrarMensajeCompra}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {mensajeNoPermitido && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded p-8 shadow-lg max-w-sm mx-4 text-center">
              <h3 className="mb-6 text-lg font-bold text-red-600">
                No estás autorizado para comprar.
              </h3>
              <button
                onClick={() => setMensajeNoPermitido(false)}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
