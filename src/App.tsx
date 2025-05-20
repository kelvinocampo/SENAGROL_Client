import { ProductManagement } from "@pages/ProductsManagement";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { InicioManual } from "@pages/Inicio";
import { AdminManagement } from "./pages/AdminManagement";
import { RegisterForm } from "@components/Usuarioregister/RegisterForm";
import MyPurchasesPage from "@pages/ListarMisCompras";
import { ProtectedRoute } from "@components/ProtectedRoute";
import Error404 from "@pages/Error404";

function App() {
  const isLoggedIn = !!localStorage.getItem('token'); // Esto puede mejorar con un contexto

  return (
    <>
         <InicioManual />
        
         
    </>
  )
}

export default App;
