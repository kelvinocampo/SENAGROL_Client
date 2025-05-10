// TaskContext.js
import { ProductManagementService } from '@/services/ProductsManagement';
import { createContext, useEffect, useState } from 'react';

export const ProductManagementContext: any = createContext<any>(undefined);

export const ProductManagementProvider = ({ children }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDY5MTIxNDUsImRhdGEiOnsiaWQiOjIsInJvbGVzIjoidmVuZGVkb3IifSwiaWF0IjoxNzQ2OTA4NTQ1fQ.5MsvD8AnOoTfVeE2lZ4cg_g7RTysDPMQf9WFRjb5vhU")

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