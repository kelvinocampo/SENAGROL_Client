import { useState, useEffect, useContext } from "react";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductCard } from "@components/ProductsManagement/ProductCard";
import { ProductManagementService } from "@/services/ProductsManagement";

export const ProductsView = () => {
  const { products = [], setProducts }: any = useContext(ProductManagementContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los productos
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

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
      <h2 className="sm:text-4xl text-2xl font-lightbold">Mis Productos</h2>

      {error && (
        <div className="text-red-500 text-center py-2">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#48BD28]"></div>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product.id_producto} product={product} />
            ))
          ) : (
            <div className="w-full text-center py-8">
              <p className="text-gray-500 text-lg">
                No se encontraron productos
              </p>
            </div>
          )}
        </ul>
      )}
    </section>
  );
};