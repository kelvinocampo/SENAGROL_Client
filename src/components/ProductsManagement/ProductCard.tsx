import { useNavigate } from "react-router-dom";
import editIcon from "@assets/edit.svg";
import deleteIcon from "@assets/delete.svg";

export const ProductCard = ({ product }: any) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/MisProductos/Editar/${product.id_producto}`);
  };

  const handleDeleteClick = () => {
    navigate(`/MisProductos/Eliminar/${product.id_producto}`);
  };

  // Determinar el estado del producto
  const getStatus = () => {
    if (product.despublicado) {
      return "No disponible (despublicado)";
    }
    return "Disponible";
  };

  return (
    <li
      className="overflow-hidden capitalize flex flex-col gap-2 w-[200px] bg-white rounded-xl shadow-md transition hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={product.imagen}
          alt={product.descripcion}
          className="object-cover w-full h-[150px] rounded-t-xl"
        />
        {product.descuento && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.descuento}% OFF
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="text-xl font-medium truncate">{product.nombre}</p>
          <p className={`text-sm font-semibold ${
            product.activo ? "text-green-600" : "text-red-600"
          }`}>
            {getStatus()}
          </p>
          
          <div className="flex justify-between text-sm mt-1">
            <p>Cant: {product.cantidad}kg</p>
            <p>Mín: {product.cantidad_minima_compra}kg</p>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            {product.descuento ? (
              <>
                <p className="text-gray-400 line-through">${product.precio_unidad}</p>
                <p className="font-bold">
                  ${(product.precio_unidad * (1 - product.descuento/100))}
                </p>
              </>
            ) : (
              <p className="font-bold">${product.precio_unidad}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 mt-2">
          <button 
            onClick={handleEditClick}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Editar producto"
          >
            <img className="w-6" src={editIcon} alt="Editar" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Eliminar producto"
          >
            <img className="w-6" src={deleteIcon} alt="Eliminar" />
          </button>
        </div>
      </div>
    </li>
  );
};