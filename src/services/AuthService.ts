export class AuthService {
    static API_URL = 'https://senagrol.up.railway.app';
    static async getIDUser() {
        const token = localStorage.getItem('token');
        try {
            const result = await fetch(`${this.API_URL}/usuario/id`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await result.json();
            
            if (result.ok) {
                return data.id_usuario;
            } else {
                throw new Error(data.message || 'Failed to fetch user ID');
            }
        } catch (error) {
            console.error("Error fetching user ID:", error);
            throw error;
        }
    }
}