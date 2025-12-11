import api from "../../config/api";

export class InicioService {

  static async login(identifier: string, password: string) {
    try {
      const response = await api.post("/usuario/login", { identifier, password });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || "Tu usuario o contraseña son incorrectas");
    }
  }

  static async register(name: string, username: string, email: string, password: string, phone: string, confirmPassword: string) {
    try {
      const response = await api.post("/usuario/register", { name, username, email, password, phone, confirmPassword });
      return response.data;
    } catch (error: any) {
      const err: any = new Error("Error en el registro");
      err.errorInfo = error.response?.data?.errorInfo || error.response?.data?.message || "Tienes algún dato mal";
      throw err;
    }
  }

  static async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post("/usuario/recover", { email });
      return {
        success: true,
        message: response.data.message || "Correo enviado correctamente."
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || "Error al enviar el correo de recuperación");
    }
  }

  static async updatePassword(password: string, id_user: number): Promise<{ message: string }> {
    try {
      const response = await api.patch("/usuario/password", {
        id_user,
        password,
        confirmPassword: password,
      });
      return { message: response.data.message || 'Contraseña actualizada con éxito.' };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'La nueva contraseña no cumple con los requisitos');
    }
  }

}
