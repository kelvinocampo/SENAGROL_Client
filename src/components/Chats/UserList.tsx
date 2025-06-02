import { ChatService } from "@/services/Chats/ChatService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Obtener el usuario actual desde localStorage
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
    } catch (err) {
      console.error("Error al obtener el chat:", err);
      setActionError("No se pudo iniciar el chat. Intenta de nuevo.");
    }
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await ChatService.getUsers();

      // Filtrar al usuario actual de la lista
      const filteredUsers = currentUser
        ? result.filter((user: User) => user.id_usuario !== currentUser.id_usuario)
        : result;

      setUsers(filteredUsers);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al cargar la lista de usuarios. Recarga la página.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderSkeletons = () => (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex justify-between items-center p-4 border-b border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white shadow-sm rounded-lg flex flex-1 flex-col m-4 w-full p-4">
      <div className="p-4 border-b border-gray-400 bg-white z-10">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Usuarios</h2>
      </div>

      {actionError && (
        <div className="p-2 mx-4 mt-2 text-red-500 text-sm bg-red-50 rounded text-center">
          {actionError}
        </div>
      )}

      {isLoading ? (
        renderSkeletons()
      ) : error ? (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500 mb-2">No hay usuarios disponibles</p>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Actualizar lista
          </button>
        </div>
      ) : (
        <>
          <div className="px-4 py-2 text-sm text-gray-500 border-b">
            {users.length} {users.length === 1 ? "usuario" : "usuarios"} encontrados
          </div>
          <ul className="overflow-y-auto flex-1">
            {users.map((user) => (
              <li
                className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                onClick={() => handleClickUser(user.id_usuario)}
                key={user.id_usuario}
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      {user.nombre_usuario}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                    {user.roles}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
