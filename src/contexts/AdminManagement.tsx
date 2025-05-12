import { UserManagementService } from '@/services/Admin/UserManagementService';
import { createContext, useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email?: string;
  role: string;
  hasTransportForm: boolean;
  hasSellerRequest: boolean;
  is_active?: boolean;
}

interface UserManagementContextProps {
  users: User[];
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  disableUser: (id: number, role: 'vendedor' | 'transportador') => Promise<void>;
  activateUserRole: (id: number, role: 'vendedor' | 'transportador') => Promise<void>;
}

export const UserManagementContext = createContext<UserManagementContextProps | undefined>(undefined);

export const UserManagementProvider = ({ children }: any) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await UserManagementService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
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
    <UserManagementContext.Provider value={{ users, fetchUsers, deleteUser, disableUser, activateUserRole }}>
      {children}
    </UserManagementContext.Provider>
  );
};

