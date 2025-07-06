import { AdminLayout } from '@/components/admin/AdminLayout';
import { UserManagementProvider } from '@/contexts/admin/AdminManagement';

export const AdminManagement = () => {

  return (
    <div className="bg-[#f0f0f0 ]">
     <UserManagementProvider>
     <AdminLayout></AdminLayout>
    </UserManagementProvider>
    </div>
  );
};
