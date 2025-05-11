

export class ProductManagementService {
  private static API_URL = "http://localhost:10101";

  static async getBySeller() {
    try {
      const response = await fetch(`${this.API_URL}/producto/my_products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response) {
        throw new Error(`Error response: ${response}`);
      }
      const result: any = await response.json()
      console.log(result);

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

  static async deleteProduct(id_delete_product: number) {
    try {
      const response = await fetch(`${this.API_URL}/producto/delete/${id_delete_product}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response) {
        throw new Error(`Error response: ${response}`);
      }
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
      formData.append('Precio', productData.precio);
      formData.append('Description', productData.descripcion || ''); // Add description if needed
      formData.append('latitud', productData.latitud || ''); // From LocationPicker
      formData.append('longitud', productData.longitud || ''); // From LocationPicker
      formData.append('quantity', productData.cantidad);
      formData.append('MinimumQuantity', productData.cantidad_minima_compra);
      formData.append('Discount', productData.descuento || '0');
      if (imageFile) {
        formData.append('imagen', imageFile); // Append the image file
      }

      const response = await fetch(`${this.API_URL}/producto/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(
    id: number,
    productData: any,
    imageFile?: File | null
  ) {
    try {
      const formData = new FormData();

      // Agregar todos los datos del producto incluyendo la imagen actual
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });

      // Solo agregar la imagen si se proporciona un archivo nuevo
      if (imageFile) {
        formData.append('imagen', imageFile);
      }

      const response = await fetch(`${this.API_URL}/producto/edit/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating product');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
}