import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

export const BarChartSalesByMonth = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/sales/by-month");
        setData(res.data);
        setError(false);
      } catch (err) {
        setError(true);
        setTimeout(() => {
          window.location.reload(); // recargar automáticamente
        }, 3000); // Espera 3 segundos antes de recargar
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center">
        Error al cargar la gráfica. Recargando página...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#6dd850" />
      </BarChart>
    </ResponsiveContainer>
  );
};
