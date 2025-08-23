export class ChatService {
    static API_URL = 'https://senagrol-server-1.onrender.com';
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

            

            return chats;
        } catch (error) {
            throw error;
        }
    }
static async getChatById(id_chat: number) {
    try {
        const res = await fetch(`${this.API_URL}/chat/id/${id_chat}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!res.ok) return null;

        const result = await res.json();
        return result.chat; // Asegúrate que el backend responda con { chat: { ... } }
    } catch (error) {
        return null;
    }
}

    static async getChat(id_user2: number) {
        try {
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
            return { chat: result.chat, status: result.status, message: result.message };
        } catch (error) {
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
            throw error;
        }
    }
    static async createOrGetChatWithUser(id_user2: number) {
    try {
      const response = await fetch(`${this.API_URL}/chat/${id_user2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error al crear o recuperar el chat');

      const result = await response.json();
      return result.chat; 
    } catch (error) {
      throw error;
    }
  }
}