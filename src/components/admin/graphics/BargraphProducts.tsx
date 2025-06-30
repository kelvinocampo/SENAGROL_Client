import { useContext, useEffect, useState } from "react";
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
import { ProductManagementContext } from "@/contexts/admin/ProductsManagement";
import { getMonthlyProductCounts } from "@utils/product/getMonthlyProductCounts";

export const BarChartProductsByMonth = () => {
  const context = useContext(ProductManagementContext);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);
  const [data, setData] = useState<{ mes: string; cantidad: number }[]>([]);

  useEffect(() => {
    try {
      if (!context || !context.products) {
        setNoData(true);
        return;
      }

      const monthlyCounts = getMonthlyProductCounts(context.products);

      const formattedData = Object.entries(monthlyCounts).map(
        ([month, count]) => ({
          mes: month,
          cantidad: count,
        })
      );

      if (formattedData.length === 0) {
        setNoData(true);
      } else {
        setData(formattedData);
        setNoData(false);
      }
    } catch (err) {
      setError(true);
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
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-xl mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
          <XAxis dataKey="mes" tick={{ fill: "#205116", fontWeight: 600 }} />
          <YAxis tick={{ fill: "#205116", fontWeight: 600 }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="cantidad"
            fill="#48bd28"
            radius={[10, 10, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
