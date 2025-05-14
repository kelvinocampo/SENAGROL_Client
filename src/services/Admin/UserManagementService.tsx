// services/Admin/UserManagementService.ts
export type UserRole = 'administrador' | 'comprador' | 'vendedor' | 'transportador';

export class UserManagementService {
  private static API_URL = 'https://senagrolserver-production.up.railway.app/admin';

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
      administrador: u.rol_administrador,
      comprador: u.rol_comprador,
      vendedor: u.rol_vendedor,
      transportador: u.rol_transportador
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

  static async disableUser(id: number, role: UserRole) {
    const res = await fetch(`${this.API_URL}/usuarios/${role}/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error('Error al desactivar usuario');
  }

static async activateUserRole(userId: number, role: UserRole) {
  let route = '';

  switch (role) {
    case 'vendedor':
      route = `${this.API_URL}/approveRequestSeller`;
      break;
    case 'transportador':
      route = `${this.API_URL}/approveRequestTransporter`;
      break;
    case 'administrador':
      route = `${this.API_URL}/usuarios/${userId}`;
      break;
    default:
      throw new Error('Rol no soportado para activación');
  }

  const res = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ userId }) 
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Error al activar el rol:', errorText);
    throw new Error('Error al activar el rol');
  }
}

}