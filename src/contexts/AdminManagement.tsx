import { UserManagementService } from '@/services/Admin/UserManagementService';
import { createContext, useEffect, useState } from 'react';

export interface User {
  id: number;
  name: string;
  administrador: string;
  comprador: string;
  vendedor: string;
  transportador: string;
}
interface UserManagementContextProps {
  users: User[];  // siempre un array al exponerlo
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  disableUser: (id: number, role: 'vendedor' | 'transportador') => Promise<void>;
  activateUserRole: (id: number, role: 'vendedor' | 'transportador') => Promise<void>;
}

export const UserManagementContext = createContext<UserManagementContextProps | undefined>(undefined);

export const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  // Utilizamos null para distinguir “no cargado” de “cargado vacío”
  const [users, setUsers] = useState<User[] | null>(null);

  // Para pruebas, dejamos este setItem aquí (no quitar)
  localStorage.setItem(
    'token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDcwODc5NjYsImRhdGEiOnsiaWQiOjEsInJvbGVzIjoiYWRtaW5pc3RyYWRvciJ9LCJpYXQiOjE3NDcwODQzNjZ9.TJzC9qx1pVAP4T5cRk3zydq9NuDz3QMXMaAf7CJ54lM'
  );

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await UserManagementService.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const disableUser = async (id: number, role: 'vendedor' | 'transportador') => {
    try {
      await UserManagementService.disableUser(id, role);
      await fetchUsers();
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const activateUserRole = async (id: number, role: 'vendedor' | 'transportador') => {
    try {
      await UserManagementService.activateUserRole(id, role);
      await fetchUsers();
    } catch (error) {
      console.error('Error activating user role:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserManagementContext.Provider
      value={{
        users: users || [],        // expone siempre array para componentes consumidores
        fetchUsers,
        deleteUser,
        disableUser,
        activateUserRole,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};
