import axios from "axios";

export interface Venta {
  id_compra: string;
  fecha_compra: string;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_producto: number;
  precio_transporte: number;
  vendedor_nombre: string;
  transportador_nombre: string;
  estado: string;
}

export class VentasService {
  private static API_URL = " https://senagrol.up.railway.app";

  static async obtenerVentasPorUsuario(): Promise<Venta[]> {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error("Token no encontrado. Por favor inicia sesión nuevamente.");
      }

      const response = await axios.get(`${this.API_URL}/vendedor/my_sells`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log("Ventas obtenidas:", response.data.my_sells);

      return response.data.my_sells as Venta[];
    } catch (error: any) {
      console.error("Error en obtenerVentasPorUsuario:", error.response || error.message || error);
      throw new Error("Error al obtener las ventas del usuario.");
    }
  }
}
