// services/Admin/UserManagementService.ts
export type UserRole = 'administrador' | 'comprador' | 'vendedor' | 'transportador';

export class UserManagementService {
  private static API_URL = 'http://senagrol.up.railway.app';

  static async getUsers() {
    const res = await fetch(`${this.API_URL}/admin/usuarios`, {
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

static async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${this.API_URL}/admin/usuarios/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || 'Error al eliminar usuario' };
  }

  return { success: true, message: data.message || 'Usuario eliminado correctamente.' };
}



  static async disableUser(id: number, role: UserRole) {
  const res = await fetch(`${this.API_URL}/admin/usuarios/${role}/${id}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    },
  });

  console.log(res);

  if (!res.ok) throw new Error('Error al desactivar usuario');
}


  static async activateUserRole(userId: number, role: UserRole) {
    let route = '';

    switch (role) {
      case 'vendedor':
        route = `${this.API_URL}/admin/approveRequestSeller`;
        break;
      case 'transportador':
        route = `${this.API_URL}/admin/approveRequestTransporter`;
        break;
      case 'administrador':
        route = `${this.API_URL}/admin/usuarios/${userId}`;
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