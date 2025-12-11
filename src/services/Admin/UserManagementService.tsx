import api from '../../config/api';

export type UserRole = 'administrador' | 'comprador' | 'vendedor' | 'transportador';

export class UserManagementService {

  static async getUsers() {
    const res = await api.get('/admin/usuarios');
    const result = res.data;

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
    try {
      const res = await api.delete(`/admin/usuarios/${id}`);
      return { success: true, message: res.data.message || 'Usuario eliminado correctamente.' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Error al eliminar usuario' };
    }
  }

  static async disableUser(id: number, role: UserRole) {
    await api.patch(`/admin/usuarios/${role}/${id}`);
  }

  static async activateUserRole(userId: number, role: UserRole) {
    let route = '';

    switch (role) {
      case 'vendedor':
        route = '/admin/approveRequestSeller';
        break;
      case 'transportador':
        route = '/admin/approveRequestTransporter';
        break;
      case 'administrador':
        route = `/admin/usuarios/${userId}`;
        break;
      default:
        throw new Error('Rol no soportado para activación');
    }

    try {
      await api.post(route, { userId });
    } catch (error: any) {
      console.error('Error al activar el rol:', error.response?.data || error.message);
      throw new Error('Error al activar el rol');
    }
  }

}