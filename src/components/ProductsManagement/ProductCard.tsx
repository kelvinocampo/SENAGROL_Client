import { useNavigate } from "react-router-dom";
import editIcon from "@assets/edit.svg";
import deleteIcon from "@assets/delete.svg";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: any;
  isDetailView?: boolean;
}

export const ProductCard = ({ product, isDetailView = false }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleEditClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    navigate(`/MisProductos/Editar/${product.id_producto || product.id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/MisProductos/Eliminar/${product.id_producto || product.id}`);
  };

  const getStatus = () => {
    if (product.despublicado) {
      return "No disponible";
    }
    return "Disponible";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.02, boxShadow: "0 8px 20px rgba(72, 189, 40, 0.2)" },
  };

  if (isDetailView) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative">
          <img
            src={product.imagen}
            alt={product.descripcion}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          {product.descuento > 0 && (
            <div className="absolute top-2 right-2 bg-[#FF2B2B] text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.descuento * 100}% OFF
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">{product.nombre}</h3>
          <p className="text-sm text-gray-600 mt-1">{product.descripcion}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-700 font-bold">
              ${product.precio_unidad}
              <span className="text-xs font-normal text-gray-500"> / unidad</span>
            </span>
          </div>

          <div className="mt-3 text-sm text-gray-700 space-y-1">
            <p>
              <span className="font-semibold">Vendedor:</span> {product.nombre_vendedor}
            </p>
            <p>
              <span className="font-semibold">Mínimo:</span> {product.cantidad_minima_compra} unid.
            </p>
            <p>
              <span className="font-semibold">Disponible:</span> {product.cantidad} unid.
            </p>
          </div>

          <div className={`text-xs font-semibold mt-2 px-2 py-1 rounded-full inline-block ${
            product.activo && !product.despublicado 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {getStatus()}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.li
      onClick={handleEditClick}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="overflow-hidden capitalize flex flex-col gap-2 w-full sm:w-[200px] bg-white rounded-xl shadow-md cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.imagen}
          alt={product.descripcion}
          className="object-cover w-full h-[150px] rounded-t-xl"
          loading="lazy"
        />
        {product.descuento > 0 && (
          <div className="absolute top-2 right-2 bg-[#FF2B2B] text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.descuento * 100}% OFF
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="text-lg font-medium truncate">{product.nombre}</p>
          <div className="flex items-center gap-2 mt-1">
            {product.descuento > 0 ? (
              <>
                <p className="text-gray-400 line-through text-sm">${product.precio_unidad}</p>
                <p className="font-bold text-green-700">
                  ${(product.precio_unidad * (1 - product.descuento)).toFixed(2)}
                </p>
              </>
            ) : (
              <p className="font-bold text-green-700">${product.precio_unidad.toFixed(2)}</p>
            )}
          </div>

          <div className="flex justify-between text-xs mt-2 text-gray-600">
            <p>Mín: {product.cantidad_minima_compra} unid.</p>
            <p>Stock: {product.cantidad}</p>
          </div>
        </div>

        <div className="flex gap-4 mt-2 justify-end">
          <motion.button
            onClick={(e) => handleEditClick(e)}
            className="p-1 rounded transition-colors duration-300 hover:bg-green-100"
            aria-label="Editar producto"
            whileTap={{ scale: 0.9 }}
          >
            <img className="w-5" src={editIcon} alt="Editar" />
          </motion.button>
          <motion.button
            onClick={(e) => handleDeleteClick(e)}
            className="p-1 rounded transition-colors duration-300 hover:bg-red-100"
            aria-label="Eliminar producto"
            whileTap={{ scale: 0.9 }}
          >
            <img className="w-5" src={deleteIcon} alt="Eliminar" />
          </motion.button>
        </div>
      </div>  
    </motion.li>
  );
};