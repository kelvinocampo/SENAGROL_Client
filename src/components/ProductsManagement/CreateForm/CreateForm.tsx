import { useState } from "react"
import { LocationPicker } from "./LocationPicker"
import { Input } from "@/components/Input"
import { ProductManagementService } from "@/services/ProductsManagement"

export const FormCreate = () => {
  const [product, setProduct] = useState<any>({});
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string>("null");

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!location) {
        setError("Debes seleccionar una ubicación en el mapa");
        return;
      }
      const imageInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
      const imageFile = imageInput.files?.[0];

      // Combine product data with location
      const productData = {
        ...product,
        latitud: location?.lat,
        longitud: location?.lng
      };

      await ProductManagementService.createProduct(productData, imageFile);
      setProduct({});
      setLocation(null);
      setError("");
    } catch (error) {
      console.error('Error creating product:', error);
      // Optionally show error message to user
    }
  }

  return (
    <section className="font-[Fredoka] sm:py-8 sm:px-16 py-4 px-8 flex flex-col gap-8 flex-1">
      <h2 className="sm:text-4xl text-2xl font-lightbold">Crear Producto</h2>
      <form onSubmit={handleSubmitCreate} className="flex flex-col gap-8 max-w-[600px]">
        <Input
          label="Nombre del producto"
          type="text"
          name="name"
          placeholder="Ingrese el nombre del producto"
          value={product.nombre}
          onChange={(e) => setProduct({ ...product, nombre: e.target.value })}
        />
        <div className="w-full">
          <label className="block text-sm font-medium" htmlFor="description">Descripcion</label>
          <textarea
            name="description"
            className="w-full mt-1 p-2 border rounded-xl border-gray-300 focus:border-[#48BD28] focus:outline-none"
            value={product.descripcion || ''}
            onChange={(e) => setProduct({ ...product, descripcion: e.target.value })}
          />
        </div>
        <div className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap">
          <Input
            label="Cantidad (kg)"
            type="number"
            name="quantity"
            placeholder="Ingrese la cantidad del producto"
            value={product.cantidad}
            onChange={(e) => setProduct({ ...product, cantidad: e.target.value })}
          />
          <Input
            label="Cantidad minima de compra (kg)"
            type="number"
            name="minimun_quantity"
            placeholder="Ingrese la cantidad minima de compra"
            value={product.cantidad_minima_compra}
            onChange={(e) => setProduct({ ...product, cantidad_minima_compra: e.target.value })}
          />
        </div>
        <LocationPicker setLocation={setLocation} />
        {error && !location && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
        <div className="flex w-full gap-8 justify-between sm:flex-nowrap flex-wrap">
          <Input
            label="Precio por unidad"
            type="number"
            name="price"
            placeholder="Ingrese el precio por unidad"
            value={product.precio}
            onChange={(e) => setProduct({ ...product, precio: e.target.value })}
          />
          <Input
            label="Descuento porcentual (Opcional)"
            type="number"
            name="discount"
            placeholder="Ingrese el descuento porcentual"
            value={product.descuento || ''}
            onChange={(e) => setProduct({ ...product, descuento: e.target.value })}
          />
        </div>
        <Input
          label="Imagen"
          type="file"
          name="image"
          value={product.imagen}
          placeholder="Ingrese la imagen del producto"
          onChange={(e) => { setProduct({ ...product, imagen: e.target.value }) }} // File input is handled in submit
        />
        <input
          type="submit"
          value="Crear Producto"
          className="w-full p-2 border rounded-xl border-gray-300 bg-[#48BD28] hover:bg-[#3da023] cursor-pointer text-white font-medium"
        />
      </form>
    </section>
  )
}