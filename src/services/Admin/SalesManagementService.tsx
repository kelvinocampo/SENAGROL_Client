export class SalesService {
  private static API_URL = 'http://localhost/10101';

  static async getAllAdmin() {
    const res = await fetch(`${this.API_URL}/admin/sales`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) throw new Error('Error al obtener compras del administrador');

    const result = await res.json();

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
  }
}
