import api from '../config/api';

export class IAService {
    static async getResponse(prompt: string): Promise<string> {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                return await this.getResponseUserRegistered(prompt);
            }
            const history = JSON.parse(sessionStorage.getItem("history") || "[]");
            const response = await api.post('/IA/', { prompt, history });

            return response.data.response;
        } catch (error) {
            console.error("Error al obtener la respuesta de la IA:", error);
            throw error;
        }
    }

    static async getResponseUserRegistered(prompt: string): Promise<string> {
        try {
            const history = JSON.parse(sessionStorage.getItem("history") || "[]");

            // Note: The interceptor already handles the token if it's in localStorage.

            const response = await api.post('/IA/registered_user', { prompt, history });
            return response.data.response;
        } catch (error) {
            console.error("Error al obtener la respuesta de la IA:", error);
            throw error;
        }
    }
}