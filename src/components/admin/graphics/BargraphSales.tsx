import React, { useContext } from "react";
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
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas por mes</h2>
     <ResponsiveContainer width="100%" height={500}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mes" />  {/* ← aquí va "mes" */}
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="cantidad" fill="#48bd28" radius={[10, 10, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};
