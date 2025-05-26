import { useContext } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ProductManagementContext } from '@/contexts/admin/ProductsManagement';
import { getMonthlyProductCounts } from '@utils/product/getMonthlyProductCounts';

export const BarChartProductsByMonth = () => {
  const context = useContext(ProductManagementContext);
  if (!context || !context.products) return null;

  const monthlyCounts = getMonthlyProductCounts(context.products);

  const data = Object.entries(monthlyCounts).map(([month, count]) => ({
    mes: month,
    cantidad: count,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Productos por mes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
           <Bar dataKey="cantidad" fill="#48bd28" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
