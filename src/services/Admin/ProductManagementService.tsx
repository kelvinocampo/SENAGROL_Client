// ProductManagementService.ts
export class ProductManagementService {
  private static API_URL = 'http://localhost/10101';

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
    
     
    const raw: any[] = Array.isArray(result.products) ? result.products : [];

    const products = raw.map(p => ({
      id: p.id_producto,
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
      nombre_vendedor: p.nombre_vendedor,
      fecha_publicacion: p.fecha_publicacion
    }));
    
    
    return { products };
  }

  static async unpublishProduct(id: number) {
    const res = await fetch(`${this.API_URL}/admin/products/unpublish/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al despublicar producto');
  }
   static async publish(id: number) {
    const res = await fetch(`${this.API_URL}/admin/products/publish/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error publicar producto');
  }

static async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${this.API_URL}/admin/products/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || 'Error al eliminar producto' };
  }

  return { success: true, message: data.message || 'Producto eliminado correctamente.' };
}


}
