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
eliminado: number; // 👈 necesario
}

interface ContextType {
  products: Product[];
  unpublishProduct: (id: number) => void;
  publish: (id: number) => void;
  deleteProduct: (id: number) => Promise<{ success: boolean; message: string }>;  // Corregido
   fetchProducts: () => Promise<void>;  
}


export const ProductManagementContext = createContext<ContextType | null>(null);

export const ProductManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

 const fetchProducts = async () => {
  try {
    const { products } = await ProductManagementService.getProducts();
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
const deleteProduct = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await ProductManagementService.deleteProduct(id);
    if (result.success) {
      await fetchProducts(); // Actualiza la lista si la eliminación fue exitosa
    }
    return result;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return {
      success: false,
      message: 'Ocurrió un error al eliminar el producto.',
    };
  }
};




  return (
      <ProductManagementContext.Provider value={{ products, unpublishProduct, publish, deleteProduct, fetchProducts }}>
      {children}
    </ProductManagementContext.Provider>
  );
};
