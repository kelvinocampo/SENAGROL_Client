import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  precio: string;
  vendedor: string;
  descripcion: string;
  imagen?: string;
}

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);

  useEffect(() => {
    fetch(`http://senagrol.up.railway.app/productos/${id}`)
      .then((res) => res.json())
      .then((data: Producto) => setProducto(data))
      .catch((err) => console.error("Error al cargar producto", err));
  }, [id]);

  if (!producto) return <div>Cargando producto...</div>;

  return (
    <div>
      <h2>{producto.nombre}</h2>
      <p>Precio: {producto.precio}</p>
      <p>Vendedor: {producto.vendedor}</p>
      <p>{producto.descripcion}</p>
      {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
    </div>
  );
}

export default ProductDetail;
