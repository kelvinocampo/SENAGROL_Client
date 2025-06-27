import { useContext } from 'react';
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
import { UserManagementContext } from '@/contexts/admin/AdminManagement';
import { getUserRoleCounts } from '@utils/User/userRoleUtils';

export const BarChartRoles = () => {
  const context = useContext(UserManagementContext);

  // Flujo Alterno 1: Contexto o usuarios no disponibles
  if (!context || !context.users || context.users.length === 0) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        La gráfica de barras Usuarios no está disponible, intente más tarde.
      </div>
    );
  }

  const roleCounts = getUserRoleCounts(context.users);
  const data = Object.entries(roleCounts).map(([role, count]) => ({
    rol: role,
    cantidad: count
  }));
  return (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="rol" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cantidad" fill="#48bd28" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
