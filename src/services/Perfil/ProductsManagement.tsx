import api from "../../config/api";

export class ProductManagementService {

  static async getBySeller() {
    try {
      const response = await api.get('/producto/my_products');
      const result = response.data;
      const products: any[] = result.products;

      if (!Array.isArray(products)) {
        throw new Error('La respuesta no es un array de productos');
      }

      return products;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw error;
    }
  }

  static async getSells() {
    try {
      const response = await api.get('/vendedor/my_sells');
      const result = response.data;
      const sells: any[] = result.my_sells;

      if (!Array.isArray(sells)) {
        throw new Error('La respuesta no es un array de ventas');
      }

      return sells;
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw error;
    }
  }

  static async deleteProduct(id_delete_product: number) {
    try {
      await api.delete(`/producto/delete/${id_delete_product}`);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      throw error;
    }
  }

  static async createProduct(productData: any, imageFile: File | undefined) {
    try {
      const formData = new FormData();

      // Append all product data to formData
      formData.append('Nombre', productData.nombre);
      formData.append('Precio', productData.precio_unidad);
      formData.append('Description', productData.descripcion || '');
      formData.append('latitud', productData.latitud || '');
      formData.append('longitud', productData.longitud || '');
      formData.append('quantity', productData.cantidad);
      formData.append('MinimumQuantity', productData.cantidad_minima_compra);
      formData.append('Discount', productData.descuento || '0');
      if (imageFile) {
        formData.append('imagen', imageFile);
      }

      const response = await api.post('/producto/create', formData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new Error(error.response?.data?.error || 'Error creating product');
    }
  }

  static async updateProduct(
    id: number,
    productData: any,
    imageFile?: File
  ) {
    const formData = new FormData();

    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion);
    formData.append('cantidad', String(productData.cantidad));
    formData.append('cantidad_minima_compra', String(productData.cantidad_minima_compra));
    formData.append('precio_unidad', String(productData.precio_unidad));
    formData.append('descuento', productData.descuento ? String(productData.descuento) : '');
    formData.append('latitud', productData.latitud ? String(productData.latitud) : '');
    formData.append('longitud', productData.longitud ? String(productData.longitud) : '');
    formData.append('id_user', String(productData.id_user));

    if (imageFile) {
      formData.append('imagen', imageFile, imageFile.name);
    } else if (productData.imagen) {
      formData.append('imagen_url', productData.imagen);
    }

    try {
      const response = await api.put(`/producto/edit/${id}`, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar');
    }
  }

  static async buyProduct(
    id_producto: number,
    compraData: {
      id_user: number,
      cantidad: number,
      latitud: string,
      longitud: string
    }
  ) {
    try {
      const response = await api.post(`/producto/buy/${id_producto}`, {
        id_user: compraData.id_user,
        cantidad: compraData.cantidad,
        latitud: compraData.latitud,
        longitud: compraData.longitud
      });

      return response.data;
    } catch (error: any) {
      console.error('Error al realizar la compra:', error);
      throw new Error(error.response?.data?.error || error.message || 'Error al realizar la compra');
    }
  }
}