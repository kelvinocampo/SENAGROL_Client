export class InicioService {
  private static API_URL = "http://localhost:10101";

  static async login(identifier: string, password: string) {
    const response = await fetch(`${this.API_URL}/usuario/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ identifier, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Tu usuario o contraseña son incorrectas");
    }

    return data;
  }

  static async register(name: string, username: string, email: string, password: string, phone: string, confirmPassword: string) {
  const response = await fetch(`${this.API_URL}/usuario/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, username, email, password, phone, confirmPassword })
  });

  const data = await response.json();
  console.log(response, data);

  if (!response.ok) {
    // Creamos un error con un campo adicional para poder acceder a los datos
    const error: any = new Error("Error en el registro");
    error.errorInfo = data?.errorInfo || data?.message || "Tienes algún dato mal";
    throw error;
  }

  return data;
}

  static async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.API_URL}/usuario/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Error al enviar el correo de recuperación");
    }

    return {
      success: true,
      message: data.message || "Correo enviado correctamente."
    };
  }


 static async updatePassword(token: string, password: string, id_user: number): Promise<{ message: string }> {
  const response = await fetch(`${this.API_URL}/usuario/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id_user,
      password,
      confirmPassword: password, 
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'La nueva contraseña no cumple con los requisitos');
  }

  return { message: data.message || 'Contraseña actualizada con éxito.' };
}



}
