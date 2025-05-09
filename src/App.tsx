import { ProductManagement } from "@pages/ProductsManagement"
import { ProductsView } from "@/components/ProductsManagement/ProductsView"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { FormCreate } from "@/components/ProductsManagement/CreateForm/CreateForm"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/MisProductos" element={<ProductManagement />}>
            <Route path="" element={<ProductsView />} />
            <Route path="Crear" element={<FormCreate />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
