import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@components/admin/AdminLayout';
import { UserTable } from '@/components/admin/table/userTable';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
        <Route path="usuarios" element={<UserTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
