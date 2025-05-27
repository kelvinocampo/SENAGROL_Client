import { Route, Routes } from "react-router-dom";
import { ProductManagementProvider } from "@/contexts/ProductsManagement";
import Header from "@/components/Header";
import { Navbar } from "@/components/ProductsManagement/NavBar";
import { ProductsView } from "@/components/ProductsManagement/ProductsView";
import { Form } from "@/components/ProductsManagement/FormProduct";
import { DeleteProduct } from "@/components/ProductsManagement/DeleteProduct";
import { SellsView } from "@/components/ProductsManagement/SellsView";

export const ProductManagement = () => {
  return (
    <ProductManagementProvider>
              <Header/>
      <div className="flex w-screen h-screen overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
  
          <Routes>
            <Route path="" element={<ProductsView />} />
            <Route path="Crear" element={<Form />} />
            <Route path="Editar/:id_edit_product" element={<Form />} />
            <Route path="Eliminar/:id_delete_product" element={<DeleteProduct />} />
            <Route path="MisVentas" element={<SellsView />} />
          </Routes>
        </main>
      </div>
    </ProductManagementProvider>
  );
};
