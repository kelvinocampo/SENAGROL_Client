import api from '../../config/api';

export class SalesService {

  static async getAllAdmin() {
    try {
      const res = await api.get('/admin/sales');
      const result = res.data;

      const raw: any[] = Array.isArray(result.sales) ? result.sales : [];

      const sales = raw.map(s => ({
        id_compra: s.id_compra,
        estado: s.estado,
        precio_transporte: s.precio_transporte,
        precio_producto: s.precio_producto,
        cantidad: s.cantidad,
        fecha_compra: s.fecha_compra,
        fecha_entrega: s.fecha_entrega,

        producto_id: s.producto_id,
        producto_nombre: s.producto_nombre,

        vendedor_id: s.vendedor_id,
        vendedor_nombre: s.vendedor_nombre,

        comprador_id: s.comprador_id,
        comprador_nombre: s.comprador_nombre,

        transportador_id: s.transportador_id,
        transportador_nombre: s.transportador_nombre
      }));

      return { sales };
    } catch (error) {
      console.error("Error al obtener compras del administrador:", error);
      throw new Error('Error al obtener compras del administrador');
    }
  }
}
