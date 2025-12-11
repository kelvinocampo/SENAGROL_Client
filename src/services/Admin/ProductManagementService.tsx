// ProductManagementService.ts
import api from '../../config/api';

export class ProductManagementService {

  static async getProducts() {
    const res = await api.get('/admin/products');
    const result = res.data;

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
      fecha_publicacion: p.fecha_publicacion,
      eliminado: p.eliminado
    }));

    return { products };
  }

  static async unpublishProduct(id: number) {
    await api.patch(`/admin/products/unpublish/${id}`);
  }

  static async publish(id: number) {
    await api.patch(`/admin/products/publish/${id}`);
  }

  static async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const res = await api.delete(`/admin/products/delete/${id}`);
      return { success: true, message: res.data.message || 'Producto eliminado correctamente.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error al eliminar producto' };
    }
  }

}
