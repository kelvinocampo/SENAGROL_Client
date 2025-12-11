
import api from '../config/api';

export interface Venta {
  id_compra: string;
  fecha_compra: string;
  fecha_entrega: string;
  producto_nombre: string;
  cantidad: number;
  precio_producto: number;
  descuento: number;
  precio_transporte: number;
  comprador_nombre: string;
  transportador_nombre: string;
  estado: string;
}

export class VentasService {
  static async obtenerVentasPorUsuario(): Promise<Venta[]> {
    try {
      const response = await api.get('/vendedor/my_sells');
      return response.data.my_sells as Venta[];
    } catch (error: any) {
      console.error("Error en obtenerVentasPorUsuario:", error.response || error.message || error);
      throw new Error("Error al obtener las ventas del usuario.");
    }
  }
}
