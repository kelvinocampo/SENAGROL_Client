// UserList – alterna colores, lista pegada, buscador full-width
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

  const currentUser: User | null = (() => {
    try {
      const u = localStorage.getItem("currentUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  /* ---------- peticiones ---------- */
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
      setError("Error al cargar usuarios.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleClickUser = async (id_user2: number) => {
    try {
      setActionError(null);
      const { chat } = await ChatService.getChat(id_user2);
      navigate(`/Chats/${chat}`);
    } catch {
      setActionError("No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  /* ---------- filtro ---------- */
  const filtered = users.filter((u) =>
    u.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------- skeleton ---------- */
  const Skeleton = () => (
    <ul>
      {[...Array(6)].map((_, i) => (
        <li
          key={i}
          className={`h-12 w-full bg-gray-200/70 animate-pulse border border-dashed border-[#48BD28]
            ${i === 0 ? "rounded-t-lg" : ""} ${i === 5 ? "rounded-b-lg" : ""}`}
        />
      ))}
    </ul>
  );

  /* ---------- render ---------- */
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-5xl mx-auto px-2"
    >
      {/* título */}
      <h2 className="text-xl font-bold text-[#2e7c19] mb-3">Usuarios</h2>

      {/* buscador ancho completo */}
      <Buscador
        busqueda={searchTerm}
        setBusqueda={setSearchTerm}
        setPaginaActual={() => {}}
        placeholderText="Buscar usuario…"
          containerClassName="w-full mb-4"
        inputClassName="w-full"
      />

      {actionError && (
        <p className="text-red-600 text-center mb-3 text-sm">{actionError}</p>
      )}

      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <p className="text-center text-red-600 py-4">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 py-4">Sin resultados</p>
      ) : (
        <ul className="max-h-[55vh] overflow-y-auto border border-[#48BD28] rounded-lg">
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
                /* --- alternar fondo --- */
                className={`flex justify-between items-center px-4 py-3 cursor-pointer
                  ${idx % 2 === 0 ? "bg-white" : "bg-[#f4fcf1]"}
                  ${idx === 0 ? "rounded-t-lg" : ""}
                  ${idx === filtered.length - 1 ? "rounded-b-lg" : ""}
                `}
                onClick={() => handleClickUser(u.id_usuario)}
              >
                <span className="font-medium truncate">
                  {u.nombre_usuario}
                </span>
                <span className="text-xs font-semibold px-3 py-1 text-[#676767]">
                  {u.roles}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.section>
  );
};
