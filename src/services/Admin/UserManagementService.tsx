// services/Admin/UserManagementService.ts
export class UserManagementService {
  private static API_URL = 'http://localhost:10101/admin';

   static async getUsers() {
    const res = await fetch(`${this.API_URL}/usuarios`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    const result = await res.json();

    const raw: any[] = Array.isArray(result.user) ? result.user : [];

    return raw.map(u => ({
      id: u.id_usuario,
      name: u.nombre,
      administrador: u.rol_administrador,    // Ej: "No disponible"
      comprador:     u.rol_comprador,         // Ej: "Inactivo"
      vendedor:     u.rol_vendedor,          // Ej: "Activo"
      transportador: u.rol_transportador     // Ej: "No disponible"
    }));
  }

  static async deleteUser(id: number) {
    const res = await fetch(`${this.API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al eliminar usuario');
  }

  static async disableUser(id: number, role: string) {
    const res = await fetch(`${this.API_URL}/usuarios/${role}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al desactivar usuario');
  }

  static async activateUserRole(id: number, role: 'vendedor' | 'transportador') {
    const route =
      role === 'vendedor'
        ? `${this.API_URL}/approveRequestSeller`
        : `${this.API_URL}/approveRequestTransporter`;

    const res = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Error al activar el rol');
  }
}
