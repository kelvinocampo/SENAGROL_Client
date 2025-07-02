import { useContext, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import { ProductManagementContext } from "@/contexts/admin/ProductsManagement";

const COLORS = [
  "#48bd28", "#6dd850", "#a0eb8a", "#caf5bd",
  "#e4fbdd", "#f4fcf1", "#379e1b", "#205116"
];

const getMonthName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "long" });
};

export const PieChartProductsByMonth = () => {
  const context = useContext(ProductManagementContext);
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [error, setError] = useState(false);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    try {
      if (!context || !context.products) {
        setNoData(true);
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
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            align="right"
            layout="vertical"
            iconType="circle"
            wrapperStyle={{
              paddingLeft: "20px",
              fontSize: "14px",
              color: "#205116",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
