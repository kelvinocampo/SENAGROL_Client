// TaskContext.js
import { ProductManagementService } from '@/services/ProductsManagement';
import { createContext, useEffect, useState } from 'react';

export const ProductManagementContext: any = createContext<any>(undefined);

export const ProductManagementProvider = ({ children }: any) => {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDcwODAzNzMsImRhdGEiOnsiaWQiOjIsInJvbGVzIjoidmVuZGVkb3IifSwiaWF0IjoxNzQ3MDc2NzczfQ.mK6jtH9wqLMBYrSjgMA7lpO396dFdkkXiC-QVgiqcxo")

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