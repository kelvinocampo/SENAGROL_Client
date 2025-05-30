import { useNavigate } from "react-router-dom";
import editIcon from "@assets/edit.svg";
import deleteIcon from "@assets/delete.svg";
import { motion } from "framer-motion";

export const ProductCard = ({ product }: any) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate(`/MisProductos/Editar/${product.id_producto}`);
  };

  const handleDeleteClick = () => {
    navigate(`/MisProductos/Eliminar/${product.id_producto}`);
  };

  const getStatus = () => {
    if (product.despublicado) {
      return "No disponible (despublicado)";
    }
    return "Disponible";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 12px 25px rgba(72, 189, 40, 0.3)" },
  };

  return (
    <motion.li
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="overflow-hidden capitalize flex flex-col gap-2 w-[200px] bg-white rounded-xl shadow-md cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.imagen}
          alt={product.descripcion}
          className="object-cover w-full h-[150px] rounded-t-xl"
          loading="lazy"
        />
        {product.descuento && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full select-none">
            {product.descuento}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="text-xl font-medium truncate">{product.nombre}</p>
          <p
            className={`text-sm font-semibold ${
              product.activo ? "text-green-600" : "text-red-600"
            }`}
          >
            {getStatus()}
          </p>

          <div className="flex justify-between text-sm mt-1 text-gray-600">
            <p>Cant: {product.cantidad}kg</p>
            <p>Mín: {product.cantidad_minima_compra}kg</p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            {product.descuento ? (
              <>
                <p className="text-gray-400 line-through">${product.precio_unidad}</p>
                <p className="font-bold text-green-700">
                  ${(product.precio_unidad * (1 - product.descuento / 100)).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="font-bold text-green-700">${product.precio_unidad.toFixed(2)}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <motion.button
            onClick={handleEditClick}
            className="p-1 rounded transition-colors duration-300 hover:bg-green-100"
            aria-label="Editar producto"
            whileTap={{ scale: 0.9 }}
          >
            <img className="w-6" src={editIcon} alt="Editar" />
          </motion.button>
          <motion.button
            onClick={handleDeleteClick}
            className="p-1 rounded transition-colors duration-300 hover:bg-red-100"
            aria-label="Eliminar producto"
            whileTap={{ scale: 0.9 }}
          >
            <img className="w-6" src={deleteIcon} alt="Eliminar" />
          </motion.button>
        </div>
      </div>  
    </motion.li>
  );
};
