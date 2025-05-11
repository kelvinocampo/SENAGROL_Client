// TaskContext.js
import { ProductManagementService } from '@/services/ProductsManagement';
import { createContext, useEffect, useState } from 'react';

export const ProductManagementContext: any = createContext<any>(undefined);

export const ProductManagementProvider = ({ children }: any) => {
    const [products, setProducts] = useState<any[]>([]);

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
        <ProductManagementContext.Provider value={{ products, setProducts, fetchProducts }}>
            {children}
        </ProductManagementContext.Provider>
    );
};