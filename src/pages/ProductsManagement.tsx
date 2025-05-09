import { ProductManagementProvider } from "@/contexts/ProductsManagement"
import { Outlet } from "react-router-dom";

export const ProductManagement = () => {
  return (
    <>
      <ProductManagementProvider>
        <Outlet></Outlet>
      </ProductManagementProvider>
    </>
  )
}
