// src/contexts/DiscountedProductContext.tsx

import { createContext, useEffect, useState } from 'react';
import { ProductosService } from '@/services/Perfil/productosServices';

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
  descuento: number;
  despublicado: number;
  id_vendedor: number;
  nombre_vendedor: string;
  fecha_publicacion: string;
  eliminado?: boolean; 
  precio_transporte?: number; // ← agrega esta línea
}

interface DiscountedProductContextType {
  allProducts: Product[];
  discountedProducts: Product[];
  fetchAllProducts: () => Promise<void>;
  fetchDiscountedProducts: () => Promise<void>;
}

export const DiscountedProductContext = createContext<DiscountedProductContextType | null>(null);

export const DiscountedProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);

  const fetchAllProducts = async () => {
    try {
      const { products } = await ProductosService.getProducts();
      setAllProducts(products);
    } catch (error) {
      console.error('❌ Error al obtener todos los productos:', error);
    }
  };

  const fetchDiscountedProducts = async () => {
    try {
      const { products } = await ProductosService.getProductsWithDiscount();
      setDiscountedProducts(products);
    } catch (error) {
      console.error('❌ Error al obtener productos con descuento:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchDiscountedProducts();
  }, []);

  return (
    <DiscountedProductContext.Provider
      value={{
        allProducts,
        discountedProducts,
        fetchAllProducts,
        fetchDiscountedProducts
      }}
    >
      {children}
    </DiscountedProductContext.Provider>
  );
};
