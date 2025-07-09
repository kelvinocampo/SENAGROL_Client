// ProductManagement.tsx
import { Route, Routes } from "react-router-dom";
import { ProductManagementProvider } from "@/contexts/ProductsManagement";
import { MobileMenuProvider } from "@/contexts/MobileMenuContext";
import Header from "@/components/Header";
import { Navbar } from "@/components/ProductsManagement/NavBar";
import { ProductsView } from "@/components/ProductsManagement/ProductsView";
import { Form } from "@/components/ProductsManagement/FormProduct";
import { SellsView } from "@/components/ProductsManagement/SellsView";
import Footer from "@/components/footer";

export const ProductManagement = () => {
  return (
    <ProductManagementProvider>
      <MobileMenuProvider>
        <div className="min-h-screen flex flex-col font-[Fredoka]">
          
          {/* ✅ Header con mismo ancho */}
          <div className="w-[92%] max-w-7xl mx-auto pt-4">
            <Header />
          </div>

          {/* ✅ Contenido con mismo ancho */}
          <div className="flex flex-1 w-[92%] max-w-7xl mx-auto px-4 py-6 gap-6">
            <Navbar />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="" element={<ProductsView />} />
                <Route path="Crear" element={<Form />} />
                <Route path="Editar/:id_edit_product" element={<Form />} />
                <Route path="MisVentas" element={<SellsView />} />
              </Routes>
            </main>
          </div>

          {/* ✅ Footer con mismo ancho */}

            <Footer />
          
        </div>
      </MobileMenuProvider>
    </ProductManagementProvider>
  );
};
