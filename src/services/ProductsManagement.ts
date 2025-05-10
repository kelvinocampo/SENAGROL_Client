

export class ProductManagementService {
  private static API_URL = "https://scaling-space-fishstick-g4qv4pj5j79w2wv9j-10101.app.github.dev";

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
    productId: number,
    productData: any,
    imageFile: File | undefined
  ) {
    try {
      const formData = new FormData();

      // Agregar todos los datos del producto a formData
      formData.append('Nombre', productData.nombre);
      formData.append('Precio', productData.precio_unidad);
      formData.append('Description', productData.descripcion || '');
      formData.append('latitud', productData.latitud?.toString() || '');
      formData.append('longitud', productData.longitud?.toString() || '');
      formData.append('quantity', productData.cantidad.toString());
      formData.append('MinimumQuantity', productData.cantidad_minima_compra.toString());
      formData.append('Discount', productData.descuento?.toString() || '0');

      if (imageFile) {
        formData.append('imagen', imageFile);
      }

      const response = await fetch(`${this.API_URL}/producto/edit/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
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