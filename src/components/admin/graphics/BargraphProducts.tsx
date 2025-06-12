import { useContext, useEffect, useState } from 'react';
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
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);
  const [data, setData] = useState<{ mes: string; cantidad: number }[]>([]);

  useEffect(() => {
    try {
      if (!context || !context.products) {
        setNoData(true); // Flujo alterno 2
        return;
      }

      const monthlyCounts = getMonthlyProductCounts(context.products);

      const formattedData = Object.entries(monthlyCounts).map(([month, count]) => ({
        mes: month,
        cantidad: count,
      }));

      if (formattedData.length === 0) {
        setNoData(true); // Flujo alterno 2
      } else {
        setData(formattedData);
        setNoData(false);
      }

    } catch (err) {
      setError(true); // Flujo alterno 1
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
