import { useState, useEffect } from "react";
import { ProductManagementService } from "@/services/Perfil/ProductsManagement";
import { useParams, useNavigate } from "react-router-dom";
import { ProductManagementContext } from "@/contexts/ProductsManagement";
import { useContext } from "react";

export const DeleteProduct = () => {
    const { id_delete_product } = useParams();
    const navigate = useNavigate();
    const { products }: any = useContext(ProductManagementContext);
    const [productExists, setProductExists] = useState<boolean | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Verificar si el producto existe al cargar el componente
    useEffect(() => {
        const checkProductExistence = () => {
            if (!id_delete_product) {
                setProductExists(false);
                return;
            }

            const productId = Number(id_delete_product);
            const exists = products.some((p: any) => p.id_producto === productId);
            setProductExists(exists);

            // Si no existe, mostrar mensaje y redirigir después de 3 segundos
            if (!exists) {
                setError("El producto que intentas eliminar no existe");
                const timer = setTimeout(() => {
                    navigate('/MisProductos');
                }, 3000);
                return () => clearTimeout(timer);
            }
        };

        checkProductExistence();
    }, [id_delete_product, products, navigate]);

    const handleCancel = () => {
        navigate('/MisProductos');
    };

    const handleDelete = async () => {
        if (!id_delete_product || !productExists) return;

        setIsDeleting(true);
        setError(null);

        try {
            await ProductManagementService.deleteProduct(Number(id_delete_product));
            navigate('/MisProductos', { state: { message: 'Producto eliminado correctamente' } });
        } catch (err) {
            console.error('Error al eliminar producto:', err);
            setError('Ocurrió un error al eliminar el producto');
        } finally {
            setIsDeleting(false);
        }
    };

    // Si el producto no existe, mostrar mensaje
    if (productExists === false) {
        return (
            <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1 items-center justify-center">
                <h2 className="sm:text-4xl text-2xl font-lightbold text-red-500">Producto no encontrado</h2>
                <p className="text-lg">{error}</p>
                <p>Redirigiendo a la lista de productos...</p>
            </section>
        );
    }

    // Si aún no se ha verificado la existencia del producto
    if (productExists === null) {
        return (
            <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#48BD28]"></div>
                <p>Verificando producto...</p>
            </section>
        );
    }

    return (
        <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
            <h2 className="sm:text-4xl text-2xl font-lightbold">Eliminar Producto</h2>

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex flex-col gap-4">
                <p className="text-lg">¿Estás seguro que deseas eliminar este producto?</p>
                <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className={`p-2 border rounded-xl border-gray-300 bg-red-500 hover:bg-red-600 cursor-pointer text-white font-medium ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isDeleting ? 'Eliminando...' : 'Confirmar Eliminación'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-2 border rounded-xl border-black bg-white hover:bg-gray-100 cursor-pointer text-black font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </section>
    );
};