// utils/Product/getMonthlyProductCounts.ts
import { Product } from '@/contexts/admin/ProductsManagement';

export const getMonthlyProductCounts = (products: Product[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  products.forEach(product => {
    if (!product.fecha_publicacion) return;

    const date = new Date(product.fecha_publicacion);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // ej: "May 2025"
    counts[monthYear] = (counts[monthYear] || 0) + 1;
  });

  return counts;
};
