import { useContext } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { UserManagementContext } from '@/contexts/admin/AdminManagement';
import { getUserRoleCounts } from '@utils/User/userRoleUtils';

const COLORS = ['#48bd28', '#a0eb8a', '#caf5bd', '#205116'];

export const PieChartRoles = () => {
  const context = useContext(UserManagementContext);

  // Flujo Alterno 1: Contexto o usuarios no disponibles
  if (!context || !context.users || context.users.length === 0) {
    return (
      <div className="text-red-600 font-semibold text-center mt-4">
        La gráfica circular Usuarios no está disponible, intente más tarde.
      </div>
    );
  }

  const roleCounts = getUserRoleCounts(context.users);
  const data = Object.entries(roleCounts).map(([role, count]) => ({
    name: role,
    value: count,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Distribución de Roles</h2>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={150}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, _) => (
              <span className="capitalize text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
