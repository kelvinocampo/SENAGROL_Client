import { useContext, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';
import { UserManagementContext } from '@/contexts/admin/AdminManagement';
import { UserRole } from '@/services/Admin/UserManagementService';
import { SearchBar } from '@/components/admin/table/SearchUsers'; // Asegúrate de que la ruta sea correcta

export const UserTable = () => {
  const context = useContext(UserManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { users, deleteUser, disableUser, activateUserRole } = context;

  const [searchTerm, setSearchTerm] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };

  const renderRoleCell = (user: any, role: UserRole) => {
    const status = user[role];

    if (role === 'comprador') {
      if (status === 'Activo') {
           return (
        <span className="inline-block px-3 py-1 rounded-full font-semibold text-sm bg-[#E4FBDD] text-black">
          {status === 'Activo' ? 'Activo' : status === 'Inactivo' ? 'Inactivo' : 'no disponible'}
        </span>
      );
      }else {
        return (
        <span className="inline-block px-3 py-1 rounded-full font-semibold text-sm text-black">
          {status === 'Activo' ? 'Activo' : status === 'Inactivo' ? 'Inactivo' : 'no disponible'}
        </span>
      );
      }
     
    }

    if (status === 'Activo') {
      return (
        <ActionButton
          title={`Desactivar ${role}`}
          onClick={() =>
            handleConfirm(
              `¿Estás seguro de que deseas desactivar el rol ${role} para ${user.name}?`,
              () => disableUser(user.id, role)
            )
          }
        >
          Desactivar
        </ActionButton>
      );
    }

    if (status === 'Inactivo') {
      return (
        <ActionButton
          title={`Activar ${role}`}
          onClick={() =>
            handleConfirm(
              `¿Estás seguro de que deseas activar el rol ${role} para ${user.name}?`,
              () => activateUserRole(user.id, role)
            )
          }
        >
          Activar
        </ActionButton>
      );
    }

    return (
      <span className="inline-block px-3 py-1 rounded-full bg-[#FBF5ED] font-semibold text-sm text-black">
        no disponible
      </span>
    );
  };

  if (users === null) return <div>Cargando usuarios...</div>;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredUsers.length === 0) return <div>No hay usuarios para mostrar.</div>;

  return (
<div className="overflow-x-auto bg-white p-4">
  {/* Buscador */}
  <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

  <table className="min-w-full table-auto rounded-xl border-2 border-[#F5F0E5]">
    <thead className="border-2 border-[#F5F0E5] bg-[E4FBDD]">
      <tr className='bg-[#E4FBDD]'>
        <TableHeader>Nombre</TableHeader>
        <TableHeader className="text-black ">Transportador</TableHeader>
        <TableHeader className="text-black">Vendedor</TableHeader>
        <TableHeader className="text-black">Comprador</TableHeader>
        <TableHeader className="text-black">Administrador</TableHeader>
        <TableHeader className="text-black">Eliminar</TableHeader>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.length === 0 ? (
        <tr>
          <td colSpan={6} className="text-center py-4 text-gray-500">
            No hay usuarios que coincidan con la búsqueda.
          </td>
        </tr>
      ) : (
        filteredUsers.map(user => (
          <tr key={user.id} className="text-center hover:bg-gray-50 border-2 border-[#E5E8EB]">
            <td className="p-2 text-left">{user.name}</td>
            <td className="p-2 ">{renderRoleCell(user, 'transportador')}</td>
            <td className="p-2">{renderRoleCell(user, 'vendedor')}</td>
            <td className="p-2">{renderRoleCell(user, 'comprador')}</td>
            <td className="p-2">
              {user.administrador === 'Activo' ? (
                <ActionButton
                  title="Desactivar administrador"
                  onClick={() =>
                    handleConfirm(
                      `¿Estás seguro de que deseas desactivar el rol administrador para ${user.name}?`,
                      () => disableUser(user.id, 'administrador')
                    )
                  }
                >
                  Desactivar
                </ActionButton>
              ) : (
                <ActionButton
                  title="Designar como administrador"
                  onClick={() =>
                    handleConfirm(
                      `¿Deseas designar a ${user.name} como administrador?`,
                      () => activateUserRole(user.id, 'administrador')
                    )
                  }
                >
                  Designar
                </ActionButton>
              )}
            </td>
            <td className="p-2">
              <ActionButton
                title="Eliminar usuario"
                onClick={() =>
                  handleConfirm(
                    `¿Estás seguro de que deseas eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`,
                    () => deleteUser(user.id)
                  )
                }
              >
                <FaTrash />
              </ActionButton>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>

  <ConfirmDialog
    isOpen={confirmOpen}
    onClose={() => setConfirmOpen(false)}
    onConfirm={onConfirm}
    message={confirmMessage}
  />
</div>

  );
};
