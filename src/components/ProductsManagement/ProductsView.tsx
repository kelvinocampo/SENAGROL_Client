import { useState, useEffect, useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductCard } from "@components/ProductsManagement/ProductCard";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { ProductSearcher } from "@components/ProductsManagement/ProductSearcher";
import Footer from "@components/Footer";

export const ProductsView = () => {
  const {
    products = [],
    setProducts,
    searchTerm,
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

  // Variants para animar container con stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  // Variants para animar cada producto
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    hover: { scale: 1.05, boxShadow: "0px 8px 15px rgba(72, 189, 40, 0.3)" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50">
      <main className="flex-1">
        <section className="font-[Fredoka] sm:py-12 sm:px-16 py-8 px-8 flex flex-col gap-10 flex-1 max-w-7xl mx-auto">
          {/* Header con animación */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
          >
            <h2 className="sm:text-5xl text-3xl font-extrabold text-green-700 tracking-wide">
              Mis Productos
            </h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="w-full sm:w-auto"
            >
              <ProductSearcher />
            </motion.div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center py-4 font-semibold"
            >
              {error}
            </motion.div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600"></div>
            </div>
          ) : (
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="flex flex-wrap gap-6 justify-center sm:justify-start"
                >
                  {filteredProducts.map((product: any) => (
                    <motion.li
                      key={product.id_producto}
                      variants={itemVariants}
                      whileHover="hover"
                    >
                      <ProductCard product={product} />
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-center py-16 text-gray-500 text-xl"
                >
                  {searchTerm
                    ? "No se encontraron productos con ese nombre"
                    : "No se encontraron productos"}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
