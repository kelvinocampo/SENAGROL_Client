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

// Nuevo tipo para roles
type UserRole = 'administrador' | 'comprador' | 'vendedor' | 'transportador';

interface UserManagementContextProps {
  users: User[];  // siempre un array al exponerlo
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  disableUser: (id: number, role: UserRole) => Promise<void>;
  activateUserRole: (id: number, role: UserRole) => Promise<void>;
}

export const UserManagementContext = createContext<UserManagementContextProps | undefined>(undefined);

export const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  // Utilizamos null para distinguir “no cargado” de “cargado vacío”
  const [users, setUsers] = useState<User[] | null>(null);

  // Para pruebas, dejamos este setItem aquí (no quitar)
  localStorage.setItem(
    'token',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDcxNzQ5NDksImRhdGEiOnsiaWQiOjEsInJvbGVzIjoiYWRtaW5pc3RyYWRvciJ9LCJpYXQiOjE3NDcxNzEzNDl9.kajE1gFrQmdakFcONbChMYJh89Uj1hhWPrwYUJ18Tj8'
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

  const disableUser = async (id: number, role: UserRole) => {
    try {
      await UserManagementService.disableUser(id, role);
      await fetchUsers();
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const activateUserRole = async (id: number, role: UserRole) => {
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
