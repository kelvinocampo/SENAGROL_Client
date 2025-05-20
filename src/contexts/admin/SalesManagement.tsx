import { createContext, useEffect, useState } from 'react';
import { SalesService } from '@/services/Admin/SalesManagementService';

export interface Sale {
  id_compra: number;
  estado: string;
  precio_transporte: number;
  precio_producto: number;
  cantidad: number;
  fecha_compra: string;
  fecha_entrega: string | null;
  producto_id: number;
  producto_nombre: string;
  vendedor_id: number | null;
  vendedor_nombre: string;
  comprador_id: number | null;
  comprador_nombre: string;
  transportador_id: number | null;
  transportador_nombre: string;
}

interface SalesContextProps {
  sales: Sale[]; // Siempre un array
  fetchSales: () => Promise<void>;
  refresh: () => Promise<void>; // alias por claridad
  loading: boolean;
  error: string | null;
}

export const SalesManagementContext = createContext<SalesContextProps | undefined>(undefined);

export const SalesManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [sales, setSales] = useState<Sale[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const { sales } = await SalesService.getAllAdmin();
      setSales(sales);
      setError(null);
    } catch (err: any) {
      console.error('Error al cargar ventas:', err);
      setError(err.message || 'Error al cargar ventas');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SalesManagementContext.Provider
      value={{
        sales: sales || [],
        fetchSales,
        refresh: fetchSales,
        loading,
        error,
      }}
    >
      {children}
    </SalesManagementContext.Provider>
  );
};
