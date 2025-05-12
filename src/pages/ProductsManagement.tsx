import { ProductManagementProvider } from "@/contexts/ProductsManagement"
import { Route, Routes } from "react-router-dom";
import { ProductsView } from "@/components/ProductsManagement/ProductsView"
import { Form } from "@/components/ProductsManagement/FormProduct"
import { DeleteProduct } from "@/components/ProductsManagement/DeleteProduct";
import { Navbar } from "@/components/ProductsManagement/NavBar";

export const ProductManagement = () => {
  return (
    <>
      <ProductManagementProvider>
        <section className="flex flex-1 w-full">
          <Navbar></Navbar>
          <Routes>
            <Route path="" element={<ProductsView />} />
            <Route path="Crear" element={<Form />} />
            <Route path="Editar/:id_edit_product" element={<Form />} />
            <Route path="Eliminar/:id_delete_product" element={<DeleteProduct />} />
          </Routes>
        </section>
      </ProductManagementProvider>
    </>
  )
}
