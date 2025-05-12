import { FaTrash, FaUserSlash } from 'react-icons/fa';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { BooleanIcon } from '@/components/admin/table/BooleanIcon';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { useContext } from 'react';
import { UserManagementContext } from '@/contexts/AdminManagement';

interface UserTableProps {
  filter?: string;
}

export const UserTable = ({ filter = '' }: UserTableProps) => {
  // Obtener datos del contexto
  const { users, deleteUser, disableUser, activateUserRole } = useContext(UserManagementContext);
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      await deleteUser(id);
    }
  };

  const handleDisable = async (id: number, role: string) => {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      await disableUser(id, role);
    }
  };

  const handleActivateRole = async (id: number, role: 'vendedor' | 'transportador') => {
    await activateUserRole(id, role);
  };

  return (
    <div className="overflow-x-auto bg-white p-4">
      <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5]">
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader className='pl-10'>Rol</TableHeader>
            <TableHeader className='text-[#A1824A]'>Formulario Transportado</TableHeader>
            <TableHeader className='text-[#A1824A]'>Petición Vendedor</TableHeader>
            <TableHeader className='text-[#A1824A]'>Activar Rol</TableHeader>
            <TableHeader className='text-[#A1824A]'>Designar Admin</TableHeader>
            <TableHeader className='text-[#A1824A]'>Eliminar</TableHeader>
            <TableHeader className='text-[#A1824A]'>Desactivar</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="text-center hover:bg-gray-50 border-2 border-[#F5F0E5]">
              <td className="p-2 text-left">{user.name}</td>
              <td className="p-2">
                <ActionButton>{user.role}</ActionButton>
              </td>
              <td className="p-2">
                <BooleanIcon value={user.hasTransportForm} />
              </td>
              <td className="p-2">
                <BooleanIcon value={user.hasSellerRequest} />
              </td>
              <td className="p-2">
                {user.hasSellerRequest && (
                  <ActionButton onClick={() => handleActivateRole(user.id, 'vendedor')}>
                    Activar
                  </ActionButton>
                )}
              </td>
              <td className="p-2">
                <ActionButton>Designar</ActionButton>
              </td>
              <td className="p-2">
                <ActionButton 
                  title="Eliminar"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </ActionButton>
              </td>
              <td className="p-2">
                <ActionButton 
                  title="Desactivar"
                  onClick={() => handleDisable(user.id, user.role.toLowerCase())}
                >
                  <FaUserSlash />
                </ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};