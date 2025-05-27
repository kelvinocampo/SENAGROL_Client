// TaskContext.js
import { ProductManagementService } from '@/services/Perfil/ProductsManagement';
import { createContext, useEffect, useState } from 'react';

export const ProductManagementContext: any = createContext<any>(undefined);

export const ProductManagementProvider = ({ children }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const fetchProducts = async () => {
        try {
            const data = await ProductManagementService.getBySeller();
            setProducts(data);
        } catch (err: any) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductManagementContext.Provider value={{ products, setProducts, fetchProducts, searchTerm, setSearchTerm }}>
            {children}
        </ProductManagementContext.Provider>
    );
};