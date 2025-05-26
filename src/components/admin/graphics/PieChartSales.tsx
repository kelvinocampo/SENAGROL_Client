import { useContext } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { SalesManagementContext } from '@/contexts/admin/SalesManagement';

const COLORS = ['#48bd28', '#a0eb8a', '#caf5bd', '#205116', '#6dd850', '#e4fbdd', '#f4fcf1', '#379e1b'];

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' }); 
};

export const PieChartSalesByMonth = () => {
  const context = useContext(SalesManagementContext);
  if (!context) return null;

  const { sales } = context;

  // Contar productos por mes
  const monthCounts: Record<string, number> = {};

  sales.forEach((sale) => {
    const monthName = getMonthName(sale.fecha_compra);
    monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
  });

  const data = Object.entries(monthCounts).map(([month, count]) => ({
    name: month,
    value: count,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas por mes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={150}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="capitalize text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
