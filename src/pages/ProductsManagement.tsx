import { ProductsView } from "@/components/ProductsManagement/ProductsView"
import { ProductManagementProvider } from "@/contexts/ProductsManagement"

export const ProductManagement = () => {
  return (
    <>
      <ProductManagementProvider>
        <ProductsView></ProductsView>
      </ProductManagementProvider>
    </>
  )
}
