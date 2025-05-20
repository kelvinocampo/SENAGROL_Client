import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Slider1 from "../../assets/SliderProductos/Slider1.png";
import Slider2 from "../../assets/SliderProductos/Slider2.png";
import { Link } from "react-router-dom";

// Servicios e imágenes
import { getProductosMock, imagenes } from "../../services/productosServices";

interface Producto {
  nombre: string;
  precio: string;
  imagen: string;
}

export default function PaginaProductos() {
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    const fetchProductos = async () => {
      const data = await getProductosMock(); // backend real
      setProductos(data);
    };
    fetchProductos();
  }, []);


  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-4 md:px-10 py-6">
      {/* BOTONES */}
      <div className="flex justify-end space-x-4 mb-6">
        <Link to="/inicio" className="bg-[#5FC529] text-white font-bold px-6 py-2 rounded-full hover:opacity-90 transition">
          Inicio
        </Link>
        <Link to="/" className="bg-[#5FC529] text-white font-bold px-6 py-2 rounded-full hover:opacity-90 transition">
          Iniciar Sesión
        </Link>
        <Link to="/cerrar-sesion" className="border border-black text-black font-bold px-6 py-2 rounded-full hover:bg-gray-200 transition">
          Cerrar
        </Link>
      </div>



      {/* SLIDER */}
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        modules={[Pagination, Autoplay]}
        loop
      >
        <SwiperSlide>
          <img
            src={Slider1}
            className="rounded-xl w-full max-h-64 object-contain mx-auto"
            alt="Slider 1"
          />

        </SwiperSlide>
        <SwiperSlide>
          <img
            src={Slider2}
            className="rounded-xl w-full max-h-72 object-contain mx-auto"

            alt="Slider 2"
          />
        </SwiperSlide>
      </Swiper>


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
        {productosFiltrados.map((producto, index) => (
          <Link key={index} to={`/producto/${index}`}>
            <div className="bg-white border rounded-lg p-3 text-center shadow-sm hover:shadow-md transition">
              <img
                src={imagenes[producto.imagen]}
                alt={producto.nombre}
                className="w-full h-32 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.png";
                }}
              />
              <h3 className="font-bold mt-2">{producto.nombre}</h3>
              <p className="text-sm text-gray-600">{producto.precio}</p>
            </div>
          </Link>
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
