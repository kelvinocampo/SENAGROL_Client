import { useContext } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { SalesManagementContext } from '@/contexts/admin/SalesManagement';
import { getMonthlySalesProfits } from '@utils/Sales/getMonthlySalesProfits';

export const LineChartSalesByMonth = () => {
  const context = useContext(SalesManagementContext);
  if (!context || !context.sales) return null;

  const monthlyProfits = getMonthlySalesProfits(context.sales);

  if (Object.values(monthlyProfits).every(profit => profit === 0)) {
    return (
      <div className="text-center p-4 text-gray-600">
        No hay ganancias registradas en ventas completadas este año.
      </div>
    );
  }

  const data = Object.entries(monthlyProfits).map(([month, profit]) => ({
    mes: month,
    ganancia: profit,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ganancias por Mes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="ganancia"
            stroke="#379e1b"
            strokeWidth={3}
            dot={{ r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

