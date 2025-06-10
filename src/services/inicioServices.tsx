export class InicioService {
  private static API_URL = "http://localhost/10101";

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
  };

  static async register(name: string, username: string, email: string, password: string, phone: string, confirmPassword: string) {
    const response = await fetch(`${this.API_URL}/usuario/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, username, email, password, phone, confirmPassword })
    });

    const data = await response.json();
console.log(response,data);

    if (!response.ok) {
      throw new Error(data.message || data.error || "Tienes algún dato mal");
    }

    return data;
  }
}
