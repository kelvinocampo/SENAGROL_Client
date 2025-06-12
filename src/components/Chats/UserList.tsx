import { ChatService } from "@/services/Chats/ChatService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id_usuario: number;
  nombre_usuario: string;
  roles: string;
}

export const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser: User | null = (() => {
    try {
      const userData = localStorage.getItem("currentUser");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  })();

  const handleClickUser = async (id_user2: number) => {
    try {
      setActionError(null);
      const { chat } = await ChatService.getChat(id_user2);
      navigate(`/Chats/${chat}`);
    } catch {
      setActionError("No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await ChatService.getUsers();
      const filtered = currentUser
        ? result.filter((u: User) => u.id_usuario !== currentUser.id_usuario)
        : result;
      setUsers(filtered);
    } catch {
      setError("Error al cargar la lista de usuarios. Recarga la página.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios por searchTerm (case-insensitive)
  const filteredUsers = users.filter(u =>
    u.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderSkeletons = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex justify-between items-center p-4 border-b border-gray-200"
        >
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <motion.div
      className="bg-white shadow-md rounded-xl m-4 p-4 w-full max-w-full sm:max-w-xl md:max-w-2xl mx-auto flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">
          Lista de Usuarios
        </h2>
      </div>

      {/* Buscador */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {actionError && (
        <motion.div
          className="p-2 mt-2 text-red-500 text-sm bg-red-50 rounded text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {actionError}
        </motion.div>
      )}

      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={fetchUsers}
          >
            Reintentar
          </motion.button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500 mb-2">
            {searchTerm
              ? "No se encontraron usuarios con ese nombre."
              : "No hay usuarios disponibles."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            onClick={fetchUsers}
          >
            Actualizar lista
          </motion.button>
        </div>
      ) : (
        <>
          <div className="px-4 py-2 text-sm text-gray-500 border-b text-center sm:text-left">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "usuario" : "usuarios"} encontrados
          </div>
          <ul className="overflow-y-auto flex-1 max-h-[60vh]">
            <AnimatePresence>
              {filteredUsers.map(user => (
                <motion.li
                  key={user.id_usuario}
                  className="p-4 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleClickUser(user.id_usuario)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="font-medium text-gray-700 truncate">
                      {user.nombre_usuario}
                    </p>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {user.roles}
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </>
      )}
    </motion.div>
  );
};
