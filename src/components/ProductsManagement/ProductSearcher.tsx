import { Input } from "@/components/Input";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { useContext } from "react";

export const ProductSearcher = () => {
    const { searchTerm, setSearchTerm }: any = useContext(ProductManagementContext);

    return (
        <div className="w-full sm:w-auto flex items-center gap-2">
            <Input
                type="text"
                name="filter"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                label=""
                showLabel={false}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
                inputClassName="pl-4 mt-0"
            />
            <div className="flex items-center">
                <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        </div>
    )
}