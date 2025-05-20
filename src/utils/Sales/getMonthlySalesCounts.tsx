// utils/Product/getMonthlyProductCounts.ts
import { Sale } from '@/contexts/admin/SalesManagement';

export const getMonthlySalesCounts = (products: Sale[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  products.forEach(Sale => {
    if (!Sale.fecha_entrega) return;

    const date = new Date(Sale.fecha_entrega);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // ej: "May 2025"
    counts[monthYear] = (counts[monthYear] || 0) + 1;
  });

  return counts;
};
