import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GiCoffeeBeans } from "react-icons/gi";
import Buscador from "@components/Inicio/Search";
import Header from "@components/Header";
import CompraModal from "@components/admin/common/BuyModal";
import FloatingIcon from "@/components/Inicio/FloatingIcon";
import FallingLeaves from "@/components/FallingLeaf";
import Footer from "@components/footer";

import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { getUserRole } from "@/services/Perfil/authService";

export default function PaginaProductos() {
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
  const [userRole, setUserRole] = useState<
    "vendedor" | "comprador" | "transportador" | "administrador" | null
  >(null);

  const productosPorPagina = 5;
  const context = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getUserRole();
        setUserRole(role as typeof userRole);
      } catch {
        setUserRole(null);
      }
    };
    fetchRole();
  }, []);

  if (!context) return <p className="p-10">Cargando productos...</p>;

  const { allProducts, discountedProducts } = context;

  const productosFiltrados = allProducts.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPaginados = productosFiltrados.slice(
    indiceInicio,
    indiceInicio + productosPorPagina
  );

  const cambiarPagina = (numero: number) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleComprar = (producto: any) => {
    if (userRole !== "comprador") {
      setMensajeNoPermitido(true);
      return;
    }
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  const handleConfirmarCompra = (cantidad: number, ubicacion: string) => {
    setCantidadSeleccionada(cantidad);
    setUbicacionSeleccionada(ubicacion);
    setModalOpen(false);
    setMensajeCompraExitosa(true);
  };

  const handleCerrarMensajeCompra = () => {
    setMensajeCompraExitosa(false);
    if (
      productoSeleccionado &&
      cantidadSeleccionada !== null &&
      ubicacionSeleccionada !== null
    ) {
      console.log("Compra registrada:", {
        producto: productoSeleccionado,
        cantidad: cantidadSeleccionada,
        ubicacion: ubicacionSeleccionada,
      });
    }
  };

  const handleCerrarMensajeNoPermitido = () => {
    setMensajeNoPermitido(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[0] pointer-events-none">
        <FallingLeaves quantity={20} />
      </div>

      <div className="font-[Fredoka] bg-neutral-50 px-4 sm:px-6">
        <Header />
        <FloatingIcon
          icon={<GiCoffeeBeans size="100%" color="green" />}
          top="2rem"
          right="2rem"
            className="hidden md:block"  // <-- oculto en xs y sm, visible en md+
        />
        <FloatingIcon
          icon={<GiCoffeeBeans size="100%" color="brown" />}
          top="2rem"
          left="2rem"
          size="6rem"
            className="hidden md:block"  // <-- oculto en xs y sm, visible en md+
        />

        {/* CARRUSEL */}

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
            {discountedProducts.map((producto) => (
              <motion.div
                key={producto.id}
                className="cursor-pointer relative overflow-hidden"
                onClick={() => navigate(`/producto/${producto.id}`)}
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
                  src={producto.imagen}
                  alt={producto.nombre}
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
                  <h3 className="text-xl font-bold">{producto.nombre}</h3>
                  {producto.descuento > 0 && (
                    <p className="text-sm text-green-300">
                      Descuento: {producto.descuento * 100}%
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </Carousel>
        </div>

        {/* BUSCADOR */}
        <Buscador
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          setPaginaActual={setPaginaActual}
        />

        {/* PRODUCTOS */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Productos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 z-[100]">
            {productosPaginados.map((producto) => (
              <motion.div
                key={producto.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 text-center shadow hover:shadow-md transition relative"
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-40 object-cover rounded cursor-pointer"
                  onClick={() => navigate(`/producto/${producto.id}`)}
                  onError={(e) => ((e.target as HTMLImageElement).src = "")}
                />
                <h3 className="font-bold mt-2">{producto.nombre}</h3>
                <p
                  className="text-sm text-gray-600 truncate"
                  title={producto.descripcion}
                >
                  {producto.descripcion.slice(0, 30)}...
                </p>
                <p className="text-sm text-gray-800 font-semibold mt-1">
                  ${producto.precio_unidad}
                </p>
                {producto.descuento > 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    Descuento: {producto.descuento * 100}%
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Vendedor: {producto.nombre_vendedor}
                </p>

                <div className="mt-3 flex flex-col gap-2">
                  <button
                    onClick={() => handleComprar(producto)}
                    className={`text-white px-6 py-2 rounded-full transition duration-300 ease-in-out ${userRole !== "comprador"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 hover:-translate-y-1 hover:scale-105"
                      }`}
                    disabled={userRole !== "comprador"}
                  >
                    Comprar
                  </button>

                  <Link
                    to={`/producto/${producto.id}`}
                    className="text-green-700 underline text-sm hover:text-green-900"
                  >
                    Ver más
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PAGINACIÓN */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex space-x-2">
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 transition-all duration-200 hover:bg-gray-100 active:scale-95"
            >
              Anterior
            </button>

            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i}
                onClick={() => cambiarPagina(i + 1)}
                className={`px-3 py-1 border rounded transition-all duration-300 transform hover:scale-105 active:scale-95 ${paginaActual === i + 1
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
              className="px-3 py-1 border rounded disabled:opacity-50 transition-all duration-200 hover:bg-gray-100 active:scale-95"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* MODAL COMPRA */}
        {productoSeleccionado && (
          <CompraModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmarCompra}
            producto={{
              id: productoSeleccionado.id,
              nombre: productoSeleccionado.nombre,
              cantidad_minima: productoSeleccionado.cantidad_minima_compra || 1,
            }}
          />
        )}

        {/* MENSAJE COMPRA EXITOSA */}
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

        {/* MENSAJE NO PERMITIDO */}
        {mensajeNoPermitido && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded p-8 shadow-lg max-w-sm mx-4 text-center">
              <h3 className="mb-6 text-lg font-bold text-red-600">
                No estás autorizado para comprar.
              </h3>
              <button
                onClick={handleCerrarMensajeNoPermitido}
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
