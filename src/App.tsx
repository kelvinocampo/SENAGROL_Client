import { ProductManagement } from "@pages/ProductsManagement"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { InicioManual } from "@pages/Inicio"
import { UserManagementProvider } from '@/contexts/AdminManagement';
import { AdminManagement } from "./pages/AdminManagement";
//import { AdminLayout } from "./components/admin/AdminLayout"
import MyPurchasesPage from "@pages/ListarMisCompras"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/LogIn" element={<InicioManual />} />
          <Route path="/Profile" element={<MyPurchasesPage />} />
          <Route path="/MisProductos/*" element={<ProductManagement />}></Route>
          <Route path="/admin/*"
          element={
              <UserManagementProvider>
              < AdminManagement/>
            </UserManagementProvider>
          }></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
