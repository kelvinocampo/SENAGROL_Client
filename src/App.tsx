import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@components/admin/AdminLayout';
import { UserManagementProvider } from '@/contexts/AdminManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <UserManagementProvider>
              <AdminLayout />
            </UserManagementProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
