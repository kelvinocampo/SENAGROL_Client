import api from "../../config/api";

export class ChatService {

    static async getChats() {
        try {
            const response = await api.get('/chat/');
            const result = response.data;
            return result.data;
        } catch (error) {
            throw error;
        }
    }

    static async getChatById(id_chat: number) {
        try {
            const res = await api.get(`/chat/id/${id_chat}`);
            return res.data.chat;
        } catch (error) {
            return null;
        }
    }

    static async getChat(id_user2: number) {
        try {
            const getChat = await api.post(`/chat/${id_user2}`);
            const result = getChat.data;
            return { chat: result.chat, status: result.status, message: result.message };
        } catch (error) {
            throw error;
        }
    }

    static async deleteChat(id_chat: number) {
        try {
            const deleteChat = await api.delete(`/chat/${id_chat}`);
            return deleteChat.data;
        } catch (error) {
            throw error;
        }
    }

    static async blockChat(id_chat: number) {
        try {
            const blockChat = await api.patch(`/chat/block/${id_chat}`);
            return blockChat.data;
        } catch (error) {
            throw error;
        }
    }

    static async unblockChat(id_chat: number) {
        try {
            const unblockChat = await api.patch(`/chat/unblock/${id_chat}`);
            return unblockChat.data;
        } catch (error) {
            throw error;
        }
    }

    static async getUsers() {
        try {
            const getUsers = await api.get('/usuario/all');
            return getUsers.data.user;
        } catch (error) {
            throw error;
        }
    }

    static async createOrGetChatWithUser(id_user2: number) {
        try {
            const response = await api.post(`/chat/${id_user2}`);
            return response.data.chat;
        } catch (error) {
            throw error;
        }
    }
}