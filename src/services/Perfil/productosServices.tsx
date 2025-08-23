// src/services/productosServices.ts

const API_URL = "https://senagrol-server-1.onrender.com"; // Puerto correcto

export class ProductosService {
  // Obtener todos los productos
  static async getProducts() {
    try {
      const res = await fetch(`${API_URL}/producto/`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Error al obtener productos');
      }

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
        descuento: p.descuento,
        despublicado: p.despublicado,
        id_vendedor: p.id_vendedor,
        nombre_vendedor: p.nombre_vendedor,
        fecha_publicacion: p.fecha_publicacion
      }));

      return { products };
    } catch (error) {
      console.error('Error en ProductosService.getProducts:', error);
      return { products: [] };
    }
  }

  // Obtener productos con descuento
  static async getProductsWithDiscount() {
    try {
      const res = await fetch(`${API_URL}/producto/discount`, {
        method: 'GET',
      });

      if (!res.ok) {
        throw new Error('Error al obtener productos con descuento');
      }

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
        descuento: p.descuento,
        despublicado: p.despublicado,
        id_vendedor: p.id_vendedor,
        nombre_vendedor: p.nombre_vendedor,
        fecha_publicacion: p.fecha_publicacion
      }));

      return { products };
    } catch (error) {
      console.error('Error en ProductosService.getProductsWithDiscount:', error);
      return { products: [] };
    }
  }
}
