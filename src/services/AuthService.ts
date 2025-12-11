import api from '../config/api';

export class AuthService {
    static async getIDUser() {
        try {
            const response = await api.get('/usuario/id');
            return response.data.id_usuario;
        } catch (error) {
            console.error("Error fetching user ID:", error);
            throw error;
        }
    }
}