import api from "../../config/api";

export class ProductManagementService {

  static async getBySeller() {
    try {
      const response = await api.get('/comprador/buys');
      const result = response.data;

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
