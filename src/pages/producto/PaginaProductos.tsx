import { useContext, useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaSearch } from "react-icons/fa";
import Header from "@components/Header";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { Link, useNavigate } from "react-router-dom";
import CompraModal from "@components/admin/common/BuyModal";
import { getUserRole } from "@/services/authService";

export default function PaginaProductos() {
  // Estado para buscar productos
  const [busqueda, setBusqueda] = useState("");
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  // Modal compra
  const [modalOpen, setModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  // Compra exitosa
  const [mensajeCompraExitosa, setMensajeCompraExitosa] = useState(false);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState<number | null>(null);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string | null>(null);

  // Mensaje para usuarios no compradores
  const [mensajeNoPermitido, setMensajeNoPermitido] = useState(false);

  // Estado para rol del usuario
  const [userRole, setUserRole] = useState<"vendedor" | "comprador" | "transportador" | "administrador" | null>(null);

  const productosPorPagina = 10;
  const context = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  // Obtener rol al montar
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

  // Filtrar productos según búsqueda
  const productosFiltrados = allProducts.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productosFiltrados.slice(indiceInicio, indiceFin);

  const cambiarPagina = (numero: number) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Cuando el rol es comprador, abre modal compra
  const handleComprar = (producto: any) => {
    if (userRole !== "comprador") {
      setMensajeNoPermitido(true);
      return;
    }
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  // Confirmar compra
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
    // Aquí podrías redirigir, actualizar datos, etc. Si no es necesario, simplemente deja el if vacío o elimínalo.
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
    <div className="min-h-screen bg-neutral-50 px-4 md:px-15 py-2">
      <Header />

      {/* CARRUSEL */}
      <div className="bg-white p-6 rounded-xl shadow-lg m-6">
        <Carousel autoPlay infiniteLoop interval={4000} showThumbs={false} showStatus={false}>
          {discountedProducts.map((producto) => (
            <div
              key={producto.id}
              onClick={() => navigate(`/producto/${producto.id}`)}
              className="cursor-pointer"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.png")}
                className="object-cover h-96 w-full"
              />
              <div className="legend">
                <h3 className="text-lg font-bold">{producto.nombre}</h3>
                {producto.descuento > 0 && (
                  <p className="text-sm text-green-300">Descuento: {producto.descuento}%</p>
                )}
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* BUSCADOR */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* PRODUCTOS */}
      <h2 className="text-2xl font-bold mb-4">Productos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {productosPaginados.map((producto) => (
          <div
            key={producto.id}
            className="bg-white w-60 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-33 object-cover rounded cursor-pointer"
              title={producto.nombre}
              onClick={() => navigate(`/producto/${producto.id}`)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
            <h3 className="font-bold mt-2">{producto.nombre}</h3>
            <p className="text-sm text-gray-600 truncate" title={producto.descripcion}>
              {producto.descripcion.slice(0, 30)}...
            </p>
            <p className="text-sm text-gray-800 font-semibold mt-1">${producto.precio_unidad}</p>
            {producto.descuento > 0 ? (
              <p className="text-sm text-[#48BD28] font-semibold">Descuento: {producto.descuento}%</p>
            ) : (
              <br />
            )}
            <p className="text-xs text-gray-500 mt-1">Vendedor: {producto.nombre_vendedor}</p>

            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => handleComprar(producto)}
                className={`${userRole !== "comprador"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#48BD28] hover:bg-green-600 cursor-pointer"
                  } text-white px-6 py-2 rounded-full transition delay-150 duration-300 ease-in-out ${userRole === "comprador" ? "hover:-translate-y-1 hover:scale-110" : ""
                  }`}
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
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
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
              className={`px-3 py-1 border rounded ${paginaActual === i + 1 ? "bg-green-400 text-white" : ""
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

      {/* MODAL DE COMPRA */}
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded p-8 shadow-lg max-w-sm mx-4 text-center">
            <h3 className="mb-6 text-lg font-bold">¡Compra realizada con éxito!</h3>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleCerrarMensajeCompra}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* MENSAJE NO PERMITIDO PARA COMPRA */}
    {mensajeNoPermitido && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white/80 rounded-2xl p-8 shadow-2xl max-w-md mx-4 text-center border border-red-200">
      <h3 className="mb-4 text-xl font-semibold text-red-700">
        Acción no permitida
      </h3>
      <p className="mb-6 text-gray-800">
        Solo los usuarios con el rol <span className="font-bold">"comprador"</span> pueden realizar compras.
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

    </div>
  );
}



