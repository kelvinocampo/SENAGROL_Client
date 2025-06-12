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
import { useEffect, useState } from 'react';
import axios from 'axios';

export const BarChartSalesByMonth = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sales/by-month');
        // Adaptamos los nombres de las claves para el gráfico
        const formattedData = res.data.map((item: any) => ({
          mes: item.month,
          cantidad: item.sales
        }));
        setData(formattedData);
        setError(false);
      } catch (err) {
        setError(true);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="text-red-600 font-semibold text-center">
       La gráfica de barras de Ventas no esta disponible, intente mas tarde
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Ventas por mes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#6dd850" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
