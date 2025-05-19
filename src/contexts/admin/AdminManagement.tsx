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
  deleteUser: (id: number) => Promise<{ success: boolean; message: string }>;
  disableUser: (id: number, role: UserRole, currentUserId: number) => Promise<void>;
  activateUserRole: (id: number, role: UserRole) => Promise<void>;
}

export const UserManagementContext = createContext<UserManagementContextProps | undefined>(undefined);

export const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  // Utilizamos null para distinguir “no cargado” de “cargado vacío”
  const [users, setUsers] = useState<User[] | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

const deleteUser = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await UserManagementService.deleteUser(id);
     if (result.success) {
      await fetchUsers(); // Actualiza la lista si la eliminación fue exitosa
    }
    return result; // <-- Retornamos el mensaje y estado
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Error al eliminar el usuario'
    };
  }
};

const disableUser = async (id: number, role: UserRole, currentUserId: number) => {
  try {
    await UserManagementService.disableUser(id, role, currentUserId);
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
