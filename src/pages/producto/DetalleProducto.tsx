import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductosMock, imagenes } from "../../services/productosServices";
import { Link } from "react-router-dom";

interface Producto {
  nombre: string;
  precio: string;
  imagen: string;
  descripcion?: string;
  vendedor?: string;
}

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      const productos = await getProductosMock();
      const prod = productos[Number(id)];
      setProducto(prod);
    };
    fetchProducto();
  }, [id]);

  if (!producto) return <div className="p-6">Cargando producto...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <img
        src={imagenes[producto.imagen]}
        alt={producto.nombre}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-2xl font-bold mt-4">{producto.nombre}</h1>
      <p className="text-lg text-green-700">{producto.precio}</p>
      <p className="mt-2 text-gray-600">
        {producto.descripcion || "Descripción del producto."}
      </p>
      <div className="mt-4">
        <span className="font-semibold">Vendedor:</span>{" "}
        {producto.vendedor || "Don Pepe"}
      </div>

      <div className="mt-6">
        <label className="block mb-2">Cantidad</label>
        <input
          type="number"
          min={1}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div className="mt-6 flex gap-4">
       
        <Link to="/compra-realizada" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600">
       Comprar
      </Link>
        <button className="bg-gray-200 px-6 py-2 rounded-full hover:bg-gray-300">
          Conversar con el vendedor
        </button>
      </div>
    </div>
  );
}
