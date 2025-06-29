import { useContext } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { UserManagementContext } from '@/contexts/admin/AdminManagement';
import { getUserRoleCounts } from '@utils/User/userRoleUtils';

const roleColors: Record<string, string> = {
  Comprador: '#2e7c19',
  Vendedor: '#48bd28',
  Transportador: '#28a96c',
  Administrador: '#a0eb8a'
};

export const PieChartRoles = () => {
  const context = useContext(UserManagementContext);

  if (!context || !context.users || context.users.length === 0) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        La gráfica circular de usuarios no está disponible, intente más tarde.
      </div>
    );
  }

  const roleCounts = getUserRoleCounts(context.users);
  const data = Object.entries(roleCounts).map(([role, count]) => ({
    rol: role,
    cantidad: count
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="cantidad"
          nameKey="rol"
          cx="40%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={roleColors[entry.rol] || '#6dd850'} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          formatter={(value) => <span className="text-sm font-medium text-gray-700">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
