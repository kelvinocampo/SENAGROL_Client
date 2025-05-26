
// utils/sales/getMonthlySalesProfits.ts
import { Sale } from '@/contexts/admin/SalesManagement';

export const getMonthlySalesProfits = (sales: Sale[]): Record<string, number> => {
  const profitsByMonth: Record<string, number> = {
    Enero: 0, Febrero: 0, Marzo: 0, Abril: 0,
    Mayo: 0, Junio: 0, Julio: 0, Agosto: 0,
    Septiembre: 0, Octubre: 0, Noviembre: 0, Diciembre: 0,
  };

  sales
    .filter(sale => sale.estado === 'Completada') // ✅ Solo ventas completadas
    .forEach(sale => {
      const date = new Date(sale.fecha_compra);
      const monthName = date.toLocaleString('es-ES', { month: 'long' });
        const ganancia = 
      (Number(sale.precio_transporte) || 0) + 
      (Number(sale.precio_producto) || 0);

    profitsByMonth[capitalize(monthName)] += ganancia;
  });

  return profitsByMonth;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);