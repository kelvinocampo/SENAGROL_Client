// components/admin/table/UserTable.tsx
import { FaTrash, FaUserSlash } from 'react-icons/fa';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { useContext } from 'react';
import { UserManagementContext } from '@/contexts/AdminManagement';

export const UserTable = () => {
  const context = useContext(UserManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;
 
  

  const { users, deleteUser, disableUser, activateUserRole } = context;
  console.log(users);
  if (users === null) return <div>Cargando usuarios...</div>;
  if (users.length === 0) return <div>No hay usuarios para mostrar.</div>;

  return (
    <div className="overflow-x-auto bg-white p-4">
      <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5]">
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader className="text-[#A1824A]">Transportador</TableHeader>
            <TableHeader className="text-[#A1824A]">Vendedor</TableHeader>
            <TableHeader className="text-[#A1824A]">Comprador</TableHeader>
            <TableHeader className="text-[#A1824A]">Administrador</TableHeader>
            <TableHeader className="text-[#A1824A]">Eliminar</TableHeader>
            <TableHeader className="text-[#A1824A]">Desactivar</TableHeader>
          </tr>
        </thead>
<tbody>
  {users.map(user => (
    <tr key={user.id} className="text-center hover:bg-gray-50 border-2 border-[#F5F0E5]">
      <td className="p-2 text-left">{user.name}</td>

      {/* Transportador: Activar/Inactivar según status */}
      <td className="p-2">
        {user.transportador === 'Activo' ? (
          <ActionButton
            title="Desactivar transportador"
            onClick={() => disableUser(user.id, 'transportador')}
          >
            Desactivar
          </ActionButton>
        ) : user.transportador === 'Inactivo' ? (
          <ActionButton
            title="Activar transportador"
            onClick={() => activateUserRole(user.id, 'transportador')}
          >
            Activar
          </ActionButton>
        ) : (
          <></>  // No disponible, celdas vacías
        )}
      </td>

      {/* Vendedor: Activar/Inactivar según status */}
      <td className="p-2">
        {user.vendedor === 'Activo' ? (
          <ActionButton
            title="Desactivar vendedor"
            onClick={() => disableUser(user.id, 'vendedor')}
          >
            Desactivar
          </ActionButton>
        ) : user.vendedor === 'Inactivo' ? (
          <ActionButton
            title="Activar vendedor"
            onClick={() => activateUserRole(user.id, 'vendedor')}
          >
            Activar
          </ActionButton>
        ) : (
          <></>
        )}
      </td>

      {/* Comprador y Administrador siguen igual: solo muestran estado */}
      <td className="p-2"><ActionButton>{user.comprador}</ActionButton></td>
      <td className="p-2"><ActionButton>{user.administrador}</ActionButton></td>

      {/* Eliminar */}
      <td className="p-2">
        <ActionButton title="Eliminar" onClick={() => deleteUser(user.id)}>
          <FaTrash />
        </ActionButton>
      </td>

      {/* (Opcional) Una columna extra si quieres desactivar el rol actual genérico */}
     
    </tr>
  ))}
</tbody>       
      </table>
    </div>
  );
};
