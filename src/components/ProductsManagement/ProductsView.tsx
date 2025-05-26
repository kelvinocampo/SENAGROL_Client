import { useState, useEffect, useContext, useMemo } from "react";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductCard } from "@components/ProductsManagement/ProductCard";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { ProductSearcher } from "@components/ProductsManagement/ProductSearcher";

export const ProductsView = () => {
  const { products = [], setProducts, searchTerm }: any = useContext(ProductManagementContext);
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

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    return products
      .filter((product: any) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a: any, b: any) => b.precio_unidad - a.precio_unidad);
  }, [products, searchTerm]);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="sm:text-4xl text-2xl font-lightbold">Mis Productos</h2>

        <ProductSearcher></ProductSearcher>
      </div >

      {error && (
        <div className="text-red-500 text-center py-2">{error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#48BD28]"></div>
        </div>
      ) : (
        <>
          <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.id_producto} product={product} />
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No se encontraron productos con ese nombre" : "No se encontraron productos"}
                </p>
              </div>
            )}
          </ul>
        </>
      )}
    </section>
  );
};