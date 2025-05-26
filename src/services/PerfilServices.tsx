export class ProductManagementService {
  private static API_URL = "http://localhost:10101";

  static async getBySeller() {
    try {
      const response = await fetch(`${this.API_URL}/comprador/buys`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log('Respuesta de la API:', result); 
  
      if (Array.isArray(result.buys)) {
        return result.buys;
      } else {
        throw new Error('La respuesta no contiene un array de compras válido.');
      }
    } catch (error) {
      console.error('Error al obtener las compras del comprador:', error);
      throw error;
    }
  }
}  
