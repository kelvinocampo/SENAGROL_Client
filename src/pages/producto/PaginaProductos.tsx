import { useContext, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaSearch } from "react-icons/fa";
import Header from "@components/Header";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { Link, useNavigate } from "react-router-dom";

export default function PaginaProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 10;

  const context = useContext(DiscountedProductContext);
  const navigate = useNavigate();

  if (!context) return <p className="p-10">Cargando productos...</p>;

  const { allProducts, discountedProducts } = context;

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

  const handleComprar = (productoId: number) => {
    const cantidadStr = prompt("¿Cuántas unidades deseas comprar?");
    const cantidad = parseInt(cantidadStr || "0", 10);

    if (!isNaN(cantidad) && cantidad > 0) {
      navigate(`/comprar/${productoId}?cantidad=${cantidad}`);
    } else {
      alert("Por favor ingrese una cantidad válida.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-15 py-2">
      <Header />

      {/* CARRUSEL */}
      <div className="bg-white p-6 rounded-xl shadow-lg m-6">
        <Carousel
          autoPlay
          infiniteLoop
          interval={4000}
          showThumbs={false}
          showStatus={false}
        >
          {discountedProducts.map((producto) => (
            <div
              key={producto.id}
              onClick={() => navigate(`/producto/${producto.id}`)}
              className="cursor-pointer"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/placeholder.png")
                }
                className="object-cover h-96 w-full"
              />
              <div className="legend">
                <h3 className="text-lg font-bold">{producto.nombre}</h3>
                {producto.descuento > 0 && (
                  <p className="text-sm text-green-300">
                    Descuento: {producto.descuento}%
                  </p>
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
              setPaginaActual(1); // Reinicia a página 1 cuando se busca
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
            <p className="text-sm text-gray-800 font-semibold mt-1">
              ${producto.precio_unidad}
            </p>
            {producto.descuento > 0 ? (
              <p className="text-sm text-[#48BD28] font-semibold">
                Descuento: {producto.descuento}%
              </p>
            ) : (
              <br />
            )}
            <p className="text-xs text-gray-500 mt-1">
              Vendedor: {producto.nombre_vendedor}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => handleComprar(producto.id)}
                className="bg-[#48BD28] text-white px-6 py-2 rounded-full transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-green-600"
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
            ←
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
            <button
              key={numero}
              onClick={() => cambiarPagina(numero)}
              className={`px-3 py-1 rounded ${
                numero === paginaActual
                  ? "bg-green-600 text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {numero}
            </button>
          ))}
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
