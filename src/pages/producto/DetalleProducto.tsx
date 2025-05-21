import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { DiscountedProductContext } from "@/contexts/Product/ProductsManagement";
import Header from "@components/Header";
import { Link } from "react-router-dom";

export default function DetalleProducto() {
  const { id } = useParams();
  const context = useContext(DiscountedProductContext);
  const [producto, setProducto] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    if (context && id) {
      const found = context.allProducts.find((p) => String(p.id) === String(id));
      setProducto(found || null);
      if (found) setCantidad(found.cantidad_minima_compra || 1);
    }
  }, [context, id]);

  if (!context || !producto) return <div className="p-6">Cargando producto...</div>;

  return (
    <div className="bg-neutral-50 min-h-screen">
      
      <Header />
      <Link
  to="/inicio"
  className="ml-6 mt-6 inline-flex items-center text-green-700 hover:text-green-900 font-medium"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  Volver al inicio
</Link>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 mt-10 flex flex-col md:flex-row gap-6"> 
        <div className="flex-1">
          <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-[400px] object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-800">{producto.nombre}</h1>

          <div className="flex items-center gap-2 mt-2">
            <p className="text-green-700 font-bold text-xl">${producto.precio_unidad} <span className="text-sm font-normal text-gray-500">/ unidad</span></p>
            {producto.descuento > 0 && (
              <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-full">
                {producto.descuento}% OFF
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mt-3">
            {producto.descripcion}  
          </p>

          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p><span className="font-semibold">Vendedor:</span> {producto.nombre_vendedor}</p>
            <p><span className="font-semibold">Compra mínima:</span> {producto.cantidad_minima_compra} unidades</p>
          </div>

          {/* Selector de cantidad */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Cantidad:</span>
            <button
              onClick={() => setCantidad((prev) => Math.max(producto.cantidad_minima_compra, prev - 1))}
              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
            >–</button>
            <span className="text-lg">{cantidad}</span>
            <button
              onClick={() => setCantidad((prev) => prev + 1)}
              className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
            >+</button>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-4">
            <Link
              to="/compra-realizada"
              className="bg-[#48BD28] text-white font-medium px-6 py-2 rounded hover:bg-green-600 transition"
            >
              Comprar
            </Link>
            <button className="bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded hover:bg-gray-300 transition">
              Conversar con el vendedor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
