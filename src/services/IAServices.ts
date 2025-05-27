export class IAService {
    static API_URL = "https://senagrol.up.railway.app";

    static async getResponse(prompt: string): Promise<string> {
        try {
            const token = localStorage.getItem("token") || "";
            if (token) {
                return await this.getResponseUserRegistered(prompt, token);
            }
            const history = JSON.parse(sessionStorage.getItem("history") || "[]");
            const response = await fetch(`${this.API_URL}/IA/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt, history }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error al obtener la respuesta de la IA:", error);
            throw error;
        }
    }

    static async getResponseUserRegistered(prompt: string, token: string): Promise<string> {
        try {
            const history = JSON.parse(sessionStorage.getItem("history") || "[]");
            const response = await fetch(`${this.API_URL}/IA/registered_user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ prompt, history }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error al obtener la respuesta de la IA:", error);
            throw error;
        }
    }
}