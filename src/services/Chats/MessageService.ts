export class MessageService {
    static API_URL = 'http://localhost/10101';

    static async getMessages(id_chat: number): Promise<Message[]> {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    static async sendTextMessage(text: string, id_chat: number): Promise<Message> {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const data = result.data
            const message: Message = {
                id_mensaje: data._id_mensaje,
                contenido: data._contenido,
                fecha_envio: data._fecha_envio,
                id_chat: data._id_chat,
                id_user: data._id_user,
                tipo: data._tipo,
                editado: data._editado || 0
            };

            return message;
        } catch (error) {
            console.error('Error sending text message:', error);
            throw error;
        }
    }

    static async sendImageMessage(imageFile: File, id_chat: number): Promise<Message> {
        try {
            const formData = new FormData();
            formData.append('imagen', imageFile);

            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const data = result.data.data
            const message: Message = {
                id_mensaje: data._id_mensaje,
                contenido: data._contenido,
                fecha_envio: data._fecha_envio,
                id_chat: data._id_chat,
                id_user: data._id_user,
                tipo: data._tipo,
                editado: data._editado || 0
            };

            return message;
        } catch (error) {
            console.error('Error sending image message:', error);
            throw error;
        }
    }

    static async sendAudioMessage(audioBlob: Blob, id_chat: number): Promise<Message> {
        try {
            const audioFile = new File([audioBlob], 'audio_message.mp3', { type: 'audio/mpeg' });

            const formData = new FormData();
            formData.append('audio', audioFile);

            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/audio`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            const data = result.data.data
            const message: Message = {
                id_mensaje: data._id_mensaje,
                contenido: data._contenido,
                fecha_envio: data._fecha_envio,
                id_chat: data._id_chat,
                id_user: data._id_user,
                tipo: data._tipo,
                editado: data._editado || 0
            };

            return message;
        } catch (error) {
            console.error('Error sending audio message:', error);
            throw error;
        }
    }

    static async deleteMessage(id_message: number, id_chat: number): Promise<void> {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }

    static async editMessage(id_message: number, text: string, id_chat: number): Promise<Message> {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const data = result.data;
            const message: Message = {
                id_mensaje: data._id_mensaje,
                contenido: data._contenido,
                fecha_envio: data._fecha_envio,
                id_chat: data._id_chat,
                id_user: data._id_user,
                tipo: data._tipo,
                editado: data._editado || 0
            };

            return message;
        } catch (error) {
            console.error('Error editing message:', error);
            throw error;
        }
    }
}

export interface Message {
    id_mensaje: number;
    contenido: string;
    fecha_envio: string;
    id_user: number;
    id_chat: number;
    tipo: 'texto' | 'imagen' | 'audio';
    editado: number;
}