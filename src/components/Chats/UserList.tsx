import { ChatService } from "@/services/Chats/ChatService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Buscador from "@/components/Inicio/Search";

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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Cargar usuario actual
    try {
      const user = localStorage.getItem("currentUser");
      if (user) {
        const parsed = JSON.parse(user);
        setCurrentUserId(parsed.id_usuario);
      }
    } catch {
      setCurrentUserId(null);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await ChatService.getUsers();
      setUsers(result);
    } catch {
      setError("Error al cargar usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickUser = async (id_user2: number) => {
    try {
      setActionError(null);
      const { chat } = await ChatService.getChat(id_user2);
      navigate(`/Chats/${chat}`);
    } catch {
      setActionError("No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  // Filtrar usuarios visibles
  const filtered = users
    .filter((u) => currentUserId === null || u.id_usuario !== currentUserId)
    .filter((u) =>
      u.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const Skeleton = () => (
    <ul className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <li
          key={i}
          className="h-12 w-full bg-gray-200/70 animate-pulse rounded border border-[#48BD28]"
        />
      ))}
    </ul>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full px-2 md:px-4 pt-2 pb-1"
    >
      <div className="w-full relative">
        <h2 className="text-2xl font-bold text-[#000000] mb-4">Usuarios</h2>

        <Buscador
          busqueda={searchTerm}
          setBusqueda={setSearchTerm}
          setPaginaActual={() => {}}
          placeholderText="Buscar usuario…"
          containerClassName="w-full mb-6"
          inputClassName="w-full px-4 py-2 rounded-full border border-[#48BD28] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6dd850]"
        />

        {actionError && (
          <p className="text-red-600 text-center mb-3 text-sm">{actionError}</p>
        )}

        {isLoading ? (
          <Skeleton />
        ) : error ? (
          <p className="text-center text-red-600 py-4">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-600 py-4">
            No se encontraron usuarios con esos datos.
          </p>
        ) : (
          <ul className="max-h-[55vh] overflow-y-auto rounded-lg border border-[#48BD28]">
            <AnimatePresence>
              {filtered.map((u, idx) => (
                <motion.li
                  key={u.id_usuario}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#f4fcf1]"
                  } ${idx === 0 ? "rounded-t-lg" : ""} ${
                    idx === filtered.length - 1 ? "rounded-b-lg" : ""
                  } border-b border-[#48BD28]/40`}
                  onClick={() => handleClickUser(u.id_usuario)}
                >
                  <span className="font-medium truncate text-[#000000]">
                    {u.nombre_usuario}
                  </span>
                  <span className="text-xs text-[#676767]">{u.roles}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </motion.section>
  );
};
