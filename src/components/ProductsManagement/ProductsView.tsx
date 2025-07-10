import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductCard } from "@components/ProductsManagement/ProductCard";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { Search } from "lucide-react";

export const ProductsView = () => {
  const {
    products = [],
    setProducts,
    searchTerm,
    setSearchTerm,
  }: any = useContext(ProductManagementContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await ProductManagementService.getBySeller();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product: any) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a: any, b: any) => b.precio_unidad - a.precio_unidad);
  }, [products, searchTerm]);

  useEffect(() => {
    loadProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.03 },
  };

  return (
    <div className="min-h-screen flex flex-col font-[Fredoka]">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-10">
        {/* Título */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl font-medium text-[#0D141C] mb-4"
        >
          Mis Productos
        </motion.h2>

        {/* Buscador ancho completo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative w-full mb-10"
        >
          <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre del producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#48BD28] text-base bg-white"
          />
        </motion.div>

        {/* Mensaje de error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center py-4 font-semibold"
          >
            {error}
          </motion.div>
        )}

        {/* Cargando */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-green-600" />
          </div>
        ) : (
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
              >
                {filteredProducts.map((product: any) => (
                  <motion.div
                    key={product.id_producto}
                    variants={itemVariants}
                    whileHover="hover"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-center py-16 text-gray-500 text-xl"
              >
                {searchTerm
                  ? "No se encontraron productos con ese nombre."
                  : "No se encontraron productos."}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};
