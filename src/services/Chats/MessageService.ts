export class MessageService {
    static API_URL = 'http://localhost:10101';
    static async getMessages(id_chat: number) {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response) {
                throw new Error(`Error response: ${response}`);
            }
            const result: any = await response.json()

            const messages: any[] = result.data;
            return messages;
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }
}