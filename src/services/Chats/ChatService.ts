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
            console.error('Error fetching chats:', error);
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
            console.error('Error fetching chat:', error);
            throw error;
        }
    }

    static async deleteChat(id_chat: number) {
        try {
            const deleteChat = await fetch(`${this.API_URL}/chat/${id_chat}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!deleteChat) {
                throw new Error(`Error response: ${deleteChat}`);
            }
            const result: any = await deleteChat.json()
            return result;
        } catch (error) {
            console.error('Error deleting chat:', error);
            throw error;
        }
    }

    static async blockChat(id_chat: number) {
        try {
            const blockChat = await fetch(`${this.API_URL}/chat/block/${id_chat}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!blockChat) {
                throw new Error(`Error response: ${blockChat}`);
            }
            const result: any = await blockChat.json()
            return result;
        } catch (error) {
            console.error('Error blocking chat:', error);
            throw error;
        }
    }

    static async unblockChat(id_chat: number) {
        try {
            const unblockChat = await fetch(`${this.API_URL}/chat/unblock/${id_chat}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!unblockChat) {
                throw new Error(`Error response: ${unblockChat}`);
            }
            const result: any = await unblockChat.json()
            return result;
        } catch (error) {
            console.error('Error unblocking chat:', error);
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
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}