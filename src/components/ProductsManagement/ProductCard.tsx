import { useNavigate } from "react-router-dom";
import editIcon from "@assets/edit.svg";
import deleteIcon from "@assets/delete.svg";

export const ProductCard = ({ product }: any) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/MisProductos/Editar/${product.id_producto}`);
  };

  return (
    <li
      key={product.id_producto}
      className="overflow-hidden capitalize flex flex-col gap-2 w-[200px] bg-white rounded-xl shadow-md transition hover:shadow-lg"
    >
      <img
        src={product.imagen}
        alt={product.descripcion}
        className="object-cover w-full h-full rounded-t-xl"
      />
      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="text-xl font-medium">{product.nombre}</p>
          <div className="flex justify-between text-sm">
            <p>cant: {product.cantidad}kg</p>
            <p>cant. min: {product.cantidad_minima_compra}kg</p>
          </div>
          <p className="">${product.precio_unidad}</p>
        </div>
        <div className="flex gap-4">
          <img 
            className="w-6 cursor-pointer" 
            src={editIcon} 
            alt="Edit Icon" 
            onClick={handleEditClick}
          />
          <img className="w-6 cursor-pointer" src={deleteIcon} alt="Delete Icon" />
        </div>
      </div>
    </li>
  );
};