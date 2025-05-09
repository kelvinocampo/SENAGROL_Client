

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
}