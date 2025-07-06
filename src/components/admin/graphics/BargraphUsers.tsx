import { useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { UserManagementContext } from "@/contexts/admin/AdminManagement";
import { getUserRoleCounts } from "@utils/User/userRoleUtils";

// Definir colores personalizados para cada rol
const roleColors: Record<string, string> = {
  Comprador: "#2e7c19",
  Vendedor: "#48bd28",
  Transportador: "#28a96c",
  Administrador: "#a0eb8a"
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { rol, cantidad } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow text-sm border border-gray-200">
        <p className="font-semibold">{rol}</p>
        <p>Cantidad: {cantidad}</p>
      </div>
    );
  }
  return null;
};

export const BarChartRoles = () => {
  const context = useContext(UserManagementContext);

  if (!context || !context.users || context.users.length === 0) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        La gráfica de barras Usuarios no está disponible, intente más tarde.
      </div>
    );
  }


  const roleCounts = getUserRoleCounts(context.users);

  // Preparamos los datos para el gráfico
  const data = Object.entries(roleCounts).map(([rol, cantidad]) => ({
    rol,
    cantidad,
    fill: roleColors[rol] || "#6dd850" // color por rol
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        margin={{ top: 30, right: 20, left: 10, bottom: 30 }}
        barCategoryGap={30}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="rol"
          tick={{ fontWeight: "bold", fontSize: 14 }}
          axisLine={false}
        />
        <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="cantidad"
          radius={[10, 10, 0, 0]}
          label={{ position: "top", fontWeight: "bold", fontSize: 13 }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
