import { useContext } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { UserManagementContext } from '@/contexts/admin/AdminManagement';
import { getUserRoleCounts } from '@utils/User/userRoleUtils';

const roleColors: Record<string, string> = {
  Comprador: '#2e7c19',
  Vendedor: '#48bd28',
  Transportador: '#28a96c',
  Administrador: '#a0eb8a'
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
  const data = Object.entries(roleCounts).map(([role, count]) => ({
    rol: role,
    cantidad: count,
    fill: roleColors[role] || '#6dd850'
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        barCategoryGap={50}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="rol" tick={{ fontWeight: 'bold' }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar
          dataKey="cantidad"
          radius={[10, 10, 0, 0]}
          label={{ position: 'top', fontWeight: 'bold' }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
import { Cell } from 'recharts';