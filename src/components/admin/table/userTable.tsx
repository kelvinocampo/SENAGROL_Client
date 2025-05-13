import { FaTrash } from 'react-icons/fa';
import { TableHeader } from '@/components/admin/table/TableHeader';
import { ActionButton } from '@/components/admin/table/ActionButton';
import { useContext, useState } from 'react';
import { ConfirmDialog } from '@/components/admin/common/ConfirmDialog';
import { UserManagementContext } from '@/contexts/AdminManagement';
import { UserRole } from '@/services/Admin/UserManagementService';

export const UserTable = () => {
  const context = useContext(UserManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { users, deleteUser, disableUser, activateUserRole } = context;

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
      <span className="inline-block px-3 py-1 rounded-full bg-[#FBF5ED] font-semibold text-sm text-[#5B4B2B]">
        no disponible
      </span>
    );
  };

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
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center hover:bg-gray-50 border-2 border-[#F5F0E5]">
              <td className="p-2 text-left">{user.name}</td>
              <td className="p-2">{renderRoleCell(user, 'transportador')}</td>
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
          ))}
        </tbody>
      </table>

      {/* Modal de confirmación */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        message={confirmMessage}
      />
    </div>
  );
};
