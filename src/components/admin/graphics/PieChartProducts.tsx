import { useContext, useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { ProductManagementContext } from '@/contexts/admin/ProductsManagement';

const COLORS = ['#48bd28', '#a0eb8a', '#caf5bd', '#205116', '#6dd850', '#e4fbdd', '#f4fcf1', '#379e1b'];

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' });
};

export const PieChartProductsByMonth = () => {
  const context = useContext(ProductManagementContext);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    try {
      if (!context || !context.products) {
        setNoData(true); // Flujo Interno 2
        return;
      }

      const monthCounts: Record<string, number> = {};
      context.products.forEach((product) => {
        const monthName = getMonthName(product.fecha_publicacion);
        monthCounts[monthName] = (monthCounts[monthName] || 0) + 1;
      });

      const formattedData = Object.entries(monthCounts).map(([month, count]) => ({
        name: month,
        value: count,
      }));

      if (formattedData.length === 0) {
        setNoData(true); // Flujo Interno 2
      } else {
        setData(formattedData);
        setNoData(false);
      }

    } catch (err) {
      setError(true); // Flujo Interno 1
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [context]);

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center">
        Error al cargar la gráfica. Recargando página...
      </div>
    );
  }

  if (noData) {
    return (
      <div className="text-yellow-600 font-semibold text-center">
        No se puede visualizar la gráfica de productos en este momento. Intente más tarde.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Productos creados por mes</h2>
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
