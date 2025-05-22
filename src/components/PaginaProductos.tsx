// src/pages/producto/PaginaProductos.tsx (o el nombre correspondiente)

import { useState } from "react";
import CompraModal from "@components/admin/common/BuyModal";

// Suponiendo que esta sea la estructura de producto
interface Producto {
  id: number;
  nombre: string;
  cantidad_minima: number;
  // Otros campos si es necesario
}

export default function PaginaProductos() {
  const [productos] = useState<Producto[]>([
    { id: 1, nombre: "Producto A", cantidad_minima: 5 },
    { id: 2, nombre: "Producto B", cantidad_minima: 3 },
  ]);

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModal = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const confirmarCompra = (cantidad: number, ubicacion: string) => {
    console.log(`Compra confirmada. Cantidad: ${cantidad}, Ubicación: ${ubicacion}`);
    cerrarModal();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>

      <ul>
        {productos.map((producto) => (
          <li key={producto.id} className="mb-4 border-b pb-2">
            <strong>{producto.nombre}</strong> – Mínimo: {producto.cantidad_minima}
            <button
              onClick={() => abrirModal(producto)}
              className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Comprar
            </button>
          </li>
        ))}
      </ul>

      {productoSeleccionado && (
        <CompraModal
          isOpen={modalAbierto}
          onClose={cerrarModal}
          onConfirm={confirmarCompra}
          producto={productoSeleccionado}
        />
      )}
    </div>
  );
}
