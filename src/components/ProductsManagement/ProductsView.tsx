import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { ProductCard } from "@components/ProductsManagement/ProductCard";
import { useContext } from "react";

export const ProductsView = () => {
    const { products = [] }: any = useContext(ProductManagementContext);
    return (
        <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8">
            <h2 className="sm:text-4xl text-2xl font-lightbold">Mis Productos</h2>
            <ul className="flex justify-center sm:justify-start">
                {products.map((product: any) => (
                    <ProductCard product={product} />
                ))}
            </ul>
        </section>
    )
}
