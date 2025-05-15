import { createContext, useEffect, useState } from 'react';
import { ProductManagementService } from '@/services/Admin/ProductManagementService';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  cantidad: number;
  cantidad_minima_compra: number;
  imagen: string;
  precio_unidad: number;
  despublicado: number;
  id_vendedor: number;
  nombre_vendedor: string;
  fecha_publicacion: string;
}

interface ContextType {
  products: Product[];
  unpublishProduct: (id: number) => void;
  publish: (id: number) => void;
  deleteProduct: (id: number) => void;
}

export const ProductManagementContext = createContext<ContextType | null>(null);

export const ProductManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await ProductManagementService.getProducts();

      const { products } = response;

      setProducts(products);
    } catch (error) {
      console.error('❌ Error al cargar productos:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const unpublishProduct = async (id: number) => {    
    try {
      await ProductManagementService.unpublishProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('❌ Error al despublicar producto:', error);
    }
  };
   const publish = async (id: number) => {    
    try {
      await ProductManagementService.publish(id);
      fetchProducts();
    } catch (error) {
      console.error('❌ Error al publicar producto:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await ProductManagementService.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('❌ Error al eliminar producto:', error);
    }
  };

  return (
    <ProductManagementContext.Provider value={{ products, unpublishProduct, publish, deleteProduct}}>
      {children}
    </ProductManagementContext.Provider>
  );
};
