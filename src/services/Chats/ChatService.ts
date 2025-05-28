export class ChatService {
    static API_URL = 'http://localhost:10101';
    static async getChats() {
        try {
            const response = await fetch(`${this.API_URL}/chat/`, {
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

            const chats: any[] = result.data;
            console.log('chats', chats);

            return chats;
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }

    static async getChat(id_user2: number) {
        try {
            console.log(id_user2);
            
            const getChat = await fetch(`${this.API_URL}/chat/${id_user2}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!getChat) {
                throw new Error(`Error response: ${getChat}`);
            }
            const result: any = await getChat.json()
            console.log(result, getChat)
            return { chat: result.chat, status: result.status, message: result.message };
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }

    static async getUsers() {
        try {
            const getUsers = await fetch(`${this.API_URL}/usuario/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!getUsers) {
                throw new Error(`Error response: ${(getUsers)}`);
            }
            const result: any = await getUsers.json()

            return result.user;
        } catch (error) {
            console.error('Error fetching seller products:', error);
            throw error;
        }
    }
}