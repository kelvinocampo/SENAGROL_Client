import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagementProvider } from '@/contexts/admin/AdminManagement';
export const AdminManagement = () => {

  return (
    <>
    <UserManagementProvider>
     <AdminLayout></AdminLayout>
    </UserManagementProvider>
   
    </>
 
  );
};
