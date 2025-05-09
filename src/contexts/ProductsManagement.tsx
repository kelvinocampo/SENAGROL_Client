// TaskContext.js
import { ProductManagementService } from '@/services/ProductsManagement';
import { createContext, useEffect, useState } from 'react';

export const ProductManagementContext: any = createContext<any>(undefined);

export const ProductManagementProvider = ({ children }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDY4MTU3NzYsImRhdGEiOnsiaWQiOjIsInJvbGVzIjoidmVuZGVkb3IifSwiaWF0IjoxNzQ2ODEyMTc2fQ.DxbeHTScpCKONJE2WSOVvXcxQtWAD7_9y-df6Or7v14")

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await ProductManagementService.getBySeller();
                setProducts(data);
            } catch (err: any) {
                console.error(err);
            }
        };

        fetchProducts();
    }, []);

    return (
        <ProductManagementContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductManagementContext.Provider>
    );
};