import { useContext } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { SalesManagementContext } from '@/contexts/admin/SalesManagement';
import { getMonthlySalesProfits } from '@utils/Sales/getMonthlySalesProfits';

export const LineChartSalesByMonth = () => {
  const context = useContext(SalesManagementContext);
  if (!context || !context.sales) return null;

  const monthlyProfits = getMonthlySalesProfits(context.sales);

  if (Object.values(monthlyProfits).every((profit) => profit === 0)) {
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
    <div className="w-full max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Ganancias</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="ganancia"
            stroke="#379e1b"
            strokeWidth={2.5}
            dot={{
              r: 5,
              stroke: '#379e1b',
              strokeWidth: 2,
              fill: '#48bd28',
            }}
            activeDot={{
              r: 7,
              stroke: '#205116',
              strokeWidth: 2,
              fill: '#6dd850',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
