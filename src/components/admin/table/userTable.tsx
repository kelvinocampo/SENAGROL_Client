import { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { TableHeader } from "@/components/admin/table/TableHeader";
import { ActionButton } from "@/components/admin/table/ActionButton";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { UserManagementContext } from "@/contexts/admin/AdminManagement";
import { UserRole } from "@/services/Admin/UserManagementService";
import { SearchBar } from "@/components/admin/table/SearchUsers";
import { TransporterDetailModal } from "@/components/admin/common/TransporterDetailModal";

export const UserTable = () => {
  const context = useContext(UserManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { users, deleteUser, disableUser, activateUserRole, fetchUsers } =
    context;

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  // 👉 NUEVO: estados para el modal de detalles
  const [selectedTransporter, setSelectedTransporter] = useState<any | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setMessageOpen(true);
  };

  const renderRoleCell = (user: any, role: UserRole) => {
    const status = user[role];

    if (role === "comprador") {
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
            status === "Activo" ? "bg-[#E4FBDD]" : ""
          } text-black`}
        >
          {status === "Activo"
            ? "Activo"
            : status === "Inactivo"
            ? "Inactivo"
            : "no disponible"}
        </span>
      );
    }

    if (status === "Activo") {
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

    if (status === "Inactivo") {
      return (
        <div className="flex flex-col items-center gap-2">
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

          {role === "transportador" && (
            <ActionButton
              title={`Ver detalles de ${user.name}`}
              onClick={() => {
                setSelectedTransporter(user);
                setIsDetailOpen(true);
              }}
            >
              Ver detalles
            </ActionButton>
          )}
        </div>
      );
    }

    return (
      <span className="inline-block px-3 py-1 rounded-full bg-[#FBF5ED] font-semibold text-sm text-black">
        no disponible
      </span>
    );
  };

  if (users === null) return <div>Cargando usuarios...</div>;

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />

      <table className="min-w-full my-4 table-auto rounded-xl border-2 border-[#F5F0E5]">
        <thead className="border-2 border-[#F5F0E5] bg-[#E4FBDD]">
          <tr>
            <TableHeader>Nombre</TableHeader>
            <TableHeader className="text-black">Transportador</TableHeader>
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
            filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="text-center hover:bg-gray-50 border-2 border-[#E5E8EB]"
              >
                <td className="p-2 text-left whitespace-normal break-words max-w-[180px]">
                  {user.name}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {renderRoleCell(user, "transportador")}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {renderRoleCell(user, "vendedor")}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {renderRoleCell(user, "comprador")}
                </td>
                <td className="p-2 whitespace-normal break-words max-w-[140px]">
                  {user.administrador === "Activo" ? (
                    <ActionButton
                      title="Desactivar administrador"
                      onClick={() =>
                        handleConfirm(
                          `¿Estás seguro de que deseas desactivar el rol administrador para ${user.name}?`,
                          () => disableUser(user.id, "administrador")
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
                          () => activateUserRole(user.id, "administrador")
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
                        async () => {
                          const result = await deleteUser(user.id);
                          setConfirmOpen(false);

                          if (
                            !result ||
                            typeof result.success !== "boolean" ||
                            typeof result.message !== "string"
                          ) {
                            setTimeout(
                              () =>
                                showMessage("Respuesta inválida del servidor."),
                              200
                            );
                            return;
                          }

                          if (result.success) {
                            setTimeout(() => showMessage(result.message), 200);
                          }

                          await fetchUsers();
                        }
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

      {/* Dialogos */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        message={confirmMessage}
      />

      <MessageDialog
        isOpen={messageOpen}
        onClose={() => setMessageOpen(false)}
        message={message}
      />

      {/* 👉 NUEVO: Modal de detalle de transportador */}
      {selectedTransporter && (
        <TransporterDetailModal
          user={selectedTransporter}
          isOpen={isDetailOpen}     
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  );
};
