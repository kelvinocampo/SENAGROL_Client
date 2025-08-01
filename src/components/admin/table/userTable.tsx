import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionButton } from "@/components/admin/table/ActionButton";
import { ConfirmDialog } from "@/components/admin/common/ConfirmDialog";
import { MessageDialog } from "@/components/admin/common/MessageDialog";
import { UserManagementContext } from "@/contexts/admin/AdminManagement";
import { UserRole } from "@/services/Admin/UserManagementService";
import Buscador from "@/components/Inicio/Search";
import { TransporterDetailModal } from "@/components/admin/common/TransporterDetailModal";

export const UserTable = () => {
  const context = useContext(UserManagementContext);
  if (!context) return <div>Error: contexto no disponible.</div>;

  const { users, deleteUser, disableUser, activateUserRole, fetchUsers } = context;

  const [searchTerm, setSearchTerm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedTransporter, setSelectedTransporter] = useState<any | null>(null);
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

    const statusColor = {
      Activo: "bg-[#E4FBDD] text-green-700",
      Inactivo: "bg-gray-200 text-[#6C757D]",
      default: "bg-[#FBF5ED] text-black",
    };

    if (role === "comprador") {
      return (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
            status === "Activo"
              ? statusColor.Activo
              : status === "Inactivo"
              ? statusColor.Inactivo
              : statusColor.default
          }`}
        >
          {status === "Activo" ? "Activo" : status === "Inactivo" ? "Inactivo" : "No disponible"}
        </motion.span>
      );
    }

    if (status === "Activo") {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <ActionButton
            className="bg-gray-300 text-gray-800 rounded-full px-4 py-1 text-sm font-semibold"
            title={`Desactivar ${role}`}
            onClick={() =>
              handleConfirm(
                `¿Estás seguro de que deseas desactivar el rol ${role} para ${user.name}?`,
                async () => {
                  await disableUser(user.id, role);
                  showMessage(`El rol ${role} ha sido desactivado para ${user.name}`);
                }
              )
            }
          >
            Desactivar
          </ActionButton>
        </motion.div>
      );
    }

    if (status === "Inactivo") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <ActionButton
            className=" text-white bg-[#28A745] rounded-full px-4 py-1 text-sm font-semibold "
            title={`Activar ${role}`}
            onClick={() =>
              handleConfirm(
                `¿Estás seguro de que deseas activar el rol ${role} para ${user.name}?`,
                async () => {
                  await activateUserRole(user.id, role);
                  showMessage(`El usuario ${user.name} ha sido asignado como ${role}`);
                }
              )
            }
          >
            Activar
          </ActionButton>
        </motion.div>
      );
    }

    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="inline-block px-3 py-1 rounded-full bg-[#D6D8DB] font-semibold text-sm text-[#4A4A4A]"
      >
        No disponible
      </motion.span>
    );
  };

  if (users === null) return <div>Cargando usuarios...</div>;

  const term = searchTerm.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(term) ||
      ["transportador", "vendedor", "comprador", "administrador"].some(
        (r) => term.includes(r) && u[r as UserRole] !== "no disponible"
      )
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <div className="px-4 py-4">
        <Buscador
          busqueda={searchTerm}
          setBusqueda={setSearchTerm}
          setPaginaActual={() => {}}
          placeholderText="Buscar por nombre, correo o rol..."
        />

        <motion.table
          layout
          className="min-w-full my-10 table-auto border border-[#48BD28] rounded-xl overflow-hidden"
        >
          <thead className="bg-white border-b border-[#48BD28]">
            <tr>
              <th className="p-2 text-left rounded-tl-xl">Nombre</th>
              <th className="p-2">Transportador</th>
              <th className="p-2">Información de transportador</th>
              <th className="p-2">Vendedor</th>
              <th className="p-2">Comprador</th>
              <th className="p-2">Administrador</th>
              <th className="p-2 rounded-tr-xl">Acción</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.length === 0 ? (
                <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No se encontraron Usuarios con esos datos.
                  </td>
                </motion.tr>
              ) : (
                filteredUsers.map((user, index) => {
                  const rowClass = index % 2 === 0 ? "bg-[#E4FBDD]" : "bg-white";
                  const isLast = index === filteredUsers.length - 1;

                  return (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`text-center border-b border-green-300 hover:bg-green-50 ${rowClass}`}
                    >
                      <td className={`p-2 text-left font-semibold text-black ${isLast ? "rounded-bl-xl" : ""}`}>
                        {user.name}
                      </td>
                      <td className="p-2">{renderRoleCell(user, "transportador")}</td>
                      <td className="p-2">
                        {(user.transportador === "Activo" || user.transportador === "Inactivo") && (
                          <ActionButton
                            className="bg-blue-500 text-white rounded-full px-4 py-1 text-sm font-semibold"
                            title="Detalles"
                            onClick={() => {
                              setSelectedTransporter(user);
                              setIsDetailOpen(true);
                            }}
                          >
                            Ver detalles
                          </ActionButton>
                        )}
                      </td>
                      <td className="p-2">{renderRoleCell(user, "vendedor")}</td>
                      <td className="p-2">{renderRoleCell(user, "comprador")}</td>
                      <td className="p-2">{renderRoleCell(user, "administrador")}</td>
                      <td className={`p-2 ${isLast ? "rounded-br-xl" : ""}`}>
                        <ActionButton
                          className="bg-red-600 text-white rounded-full px-4 py-1 text-sm font-semibold"
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
                                  setTimeout(() => showMessage("Respuesta inválida del servidor."), 200);
                                  return;
                                }

                                if (result.success) {
                                  setTimeout(() => showMessage(`El usuario ${user.name} ha sido eliminado`), 200);
                                }

                                await fetchUsers();
                              }
                            )
                          }
                        >
                          Eliminar
                        </ActionButton>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </motion.table>
      </div>

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

      {selectedTransporter && (
        <TransporterDetailModal
          user={selectedTransporter}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </motion.div>
  );
};
