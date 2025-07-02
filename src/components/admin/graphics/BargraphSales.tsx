import { useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SalesManagementContext } from "@/contexts/admin/SalesManagement";
import { getMonthlySalesCounts } from "@utils/Sales/getMonthlySalesCounts";

export const BarChartSalesByMonth = () => {
  const context = useContext(SalesManagementContext);
  if (!context || !context.sales) return null;

  const monthlyCounts = getMonthlySalesCounts(context.sales);

  const data = Object.entries(monthlyCounts).map(([month, count]) => ({
    mes: month,
    cantidad: count,
  }));

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-12 rounded-2xl shadow-lg">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} barSize={50}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fill: "#333", fontSize: 14, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#333", fontSize: 14, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="capitalize text-sm text-gray-700">{value}</span>
            )}
          />
          <Bar
            dataKey="cantidad"
            fill="#48bd28"
            radius={[10, 10, 0, 0]}
            label={{ position: "top", fill: "#000", fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
