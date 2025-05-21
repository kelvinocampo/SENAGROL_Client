import { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Header from "@components/Header";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import { Link } from "react-router-dom";

export default function PaginaProductos() {
  const [busqueda, setBusqueda] = useState("");
  const context = useContext(DiscountedProductContext);

  if (!context) return <p className="p-10">Cargando productos...</p>;

  const { allProducts, discountedProducts } = context;

  // Filtrado directo sin useEffect
  const productosFiltrados = allProducts.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-6">
      <Header />

      <div className="h-100 bg-white p-6 rounded-xl shadow-lg m-6">
      <Swiper
  pagination={{ clickable: true }}
  autoplay={{ delay: 1000 }}
  modules={[Pagination, Autoplay]}
  loop
  slidesPerView={1}
>
  {discountedProducts.map((producto) => (
    <SwiperSlide key={producto.id}>
      <Link to={`/producto/${producto.id}`} className="flex items-center gap-6 cursor-pointer p-4">
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="rounded-xl w-48 max-h-48 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.png";
          }}
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-xl font-bold">{producto.nombre}</h3>
          <p className="text-lg font-semibold text-gray-800">${producto.precio_unidad}</p>
          {producto.descuento > 0 && (
            <p className="text-green-600 font-semibold">Descuento: {producto.descuento}%</p>
          )}
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>

      </div>

      {/* BUSCADOR */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-full max-w-md">
          <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* PRODUCTOS */}
      <h2 className="text-2xl font-bold mb-4">Productos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="bg-white border rounded-lg p-3 text-center shadow-sm hover:shadow-md transition"
          >
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-32 object-cover rounded"
              title={producto.nombre}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
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
                Descuento: {producto.descuento}%
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Vendedor: {producto.nombre_vendedor}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              <button className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition">
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

      {/* VER MÁS */}
      <div className="mt-10 flex justify-center">
        <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition">
          Ver más
        </button>
      </div>
    </div>
  );
}
