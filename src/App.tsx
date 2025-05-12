import { ProductManagement } from "@pages/ProductsManagement"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { InicioManual } from "./pages/Inicio"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/LogIn" element={<InicioManual />} />
          <Route path="/MisProductos/*" element={<ProductManagement />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
