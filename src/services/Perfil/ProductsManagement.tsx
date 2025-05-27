

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
      const response = await fetch(`${this.API_URL}/vendedor/my_sells`, {
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
      formData.append('Precio', productData.precio_unidad);
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
    imageFile?: File
  ) {
    const formData = new FormData();

    // Agregar campos como strings
    formData.append('nombre', productData.nombre);
    formData.append('descripcion', productData.descripcion);
    formData.append('cantidad', String(productData.cantidad));
    formData.append('cantidad_minima_compra', String(productData.cantidad_minima_compra));
    formData.append('precio_unidad', String(productData.precio_unidad));
    formData.append('descuento', productData.descuento ? String(productData.descuento) : '');
    formData.append('latitud', productData.latitud ? String(productData.latitud) : '');
    formData.append('longitud', productData.longitud ? String(productData.longitud) : '');
    formData.append('id_user', String(productData.id_user));

    // Manejo especial para la imagen
    if (imageFile) {
      formData.append('imagen', imageFile, imageFile.name); // Clave importante: 'imagen'
    } else if (productData.imagen) {
      // Si no hay archivo nuevo pero hay URL existente
      formData.append('imagen_url', productData.imagen);
    }


    const response = await fetch(`${this.API_URL}/producto/edit/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar');
    }

    return await response.json();
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
    const response = await fetch(`${this.API_URL}/producto/buy/${id_producto}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        id_user: compraData.id_user,
        cantidad: compraData.cantidad,
        latitud: compraData.latitud,
        longitud: compraData.longitud
      })
    });

    if (!response.ok) {
      const contentType = response.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al realizar la compra');
      } else {
        const text = await response.text();
        throw new Error(text || 'Error desconocido al realizar la compra');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('Error al realizar la compra:', error);
    throw error;
  }
}




}