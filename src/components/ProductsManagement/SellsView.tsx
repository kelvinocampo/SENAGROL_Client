import { useState, useEffect } from "react";
import { QrCode } from "lucide-react";

type Venta = {
    id_compra: number;
    fecha_compra: string;
    fecha_entrega: string;
    producto_nombre: string;
    cantidad: number;
    precio_producto: number;
    precio_transporte: number;
    vendedor_nombre: string;
    transportador_nombre: string;
    estado: string;
};

export const SellsView = () => {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                // Datos quemados de ejemplo
                const data: Venta[] = [
                    {
                        id_compra: 1,
                        fecha_compra: "2025-05-10",
                        fecha_entrega: "2025-05-15",
                        producto_nombre: "Bicicleta MTB",
                        cantidad: 1,
                        precio_producto: 500,
                        precio_transporte: 30,
                        vendedor_nombre: "Carlos Ruiz",
                        transportador_nombre: "No asignado",
                        estado: "En espera",
                    },
                    {
                        id_compra: 2,
                        fecha_compra: "2025-05-08",
                        fecha_entrega: "2025-05-13",
                        producto_nombre: "Casco Profesional",
                        cantidad: 2,
                        precio_producto: 80,
                        precio_transporte: 20,
                        vendedor_nombre: "Laura Gómez",
                        transportador_nombre: "TransExpress",
                        estado: "Asignada",
                    },
                    {
                        id_compra: 3,
                        fecha_compra: "2025-05-09",
                        fecha_entrega: "2025-05-12",
                        producto_nombre: "Guantes deportivos",
                        cantidad: 3,
                        precio_producto: 25,
                        precio_transporte: 10,
                        vendedor_nombre: "Pedro Torres",
                        transportador_nombre: "LogiFast",
                        estado: "Entregado",
                    },
                ];

                setVentas(data);
            } catch (err: any) {
                setError("Error al cargar las compras");
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();
    }, []);

    return (
        <section className="font-[Fredoka] w-full sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
            <h2 className="sm:text-4xl text-2xl font-lightbold">
                Mis Ventas
            </h2>
            <div className="overflow-x-auto w-full text-sm">
                <table className="min-w-full text-xs text-left border shadow-sm rounded-md overflow-hidden">
                    <thead className="bg-[#E4FBDD] text-black uppercase">
                        <tr>
                            <th className="px-3 py-2">Fecha compra</th>
                            <th className="px-3 py-2">Fecha entrega</th>
                            <th className="px-3 py-2">Producto</th>
                            <th className="px-3 py-2">Cantidad</th>
                            <th className="px-3 py-2">Precio Unidad</th>
                            <th className="px-3 py-2">Precio Total</th>
                            <th className="px-3 py-2">Costo transporte</th>
                            <th className="px-3 py-2">Vendedor</th>
                            <th className="px-3 py-2">Transportador</th>
                            <th className="px-3 py-2">Estado</th>
                            <th className="px-3 py-2">QR / Código</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-[#BFBFBD]">
                        {ventas.map((c, i) => (
                            <tr key={i} className="hover:bg-[#BFBFBD] transition-colors">
                                <td className="px-3 py-2">{c.fecha_compra}</td>
                                <td className="px-3 py-2">{c.fecha_entrega}</td>
                                <td className="px-3 py-2">{c.producto_nombre}</td>
                                <td className="px-3 py-2">{c.cantidad}</td>
                                <td className="px-3 py-2">${c.precio_producto}</td>
                                <td className="px-3 py-2">${(c.cantidad * c.precio_producto + c.precio_transporte)}</td>
                                <td className="px-3 py-2">${c.precio_transporte}</td>
                                <td className="px-3 py-2">{c.vendedor_nombre}</td>
                                <td className="px-3 py-2">{c.transportador_nombre}</td>
                                <td className="px-3 py-2">{c.estado}</td>
                                <td className="px-3 py-2">
                                    {c.estado === "Asignada" && (
                                        <div className="flex items-center gap-1">
                                            <QrCode size={16} className="text-black" />
                                            <a
                                                href="#"
                                                className="bg-[#48BD28] text-white px-2 py-1 rounded text-xs inline-block">
                                                Código
                                            </a>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section >
    )
}


