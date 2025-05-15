// ProductManagementService.ts
export class ProductManagementService {
  private static API_URL = 'http://localhost:10101';

  static async getProducts() {
    const res = await fetch(`${this.API_URL}/admin/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!res.ok) throw new Error('Error al obtener productos');
    const result = await res.json();

    const raw: any[] = Array.isArray(result.product) ? result.product : [];

    const products = raw.map(p => ({
      id: p.id_product,
      nombre: p.nombre,
      descripcion: p.descripcion, 
      latitud: p.latitud,
      longitud: p.longitud,
      cantidad: p.cantidad, 
      cantidad_minima_compra: p.cantidad_minima_compra,
      imagen: p.imagen,
      precio_unidad: p.precio_unidad,
      despublicado: p.despublicado,
      id_vendedor: p.id_vendedor,
      nombre_vendedor: p.nombre_vendedor
    }));

    return { products };
  }

  static async unpublishProduct(id: number) {
    const res = await fetch(`${this.API_URL}/admin/products/unpublish/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al despublicar producto');
  }

  static async deleteProduct(id: number) {
    const res = await fetch(`${this.API_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
  }
}
