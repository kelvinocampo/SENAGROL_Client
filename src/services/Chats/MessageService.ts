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
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    static async sendTextMessage(text: string, id_chat: number) {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    text: text
                })
            });

            if (!response) {
                throw new Error(`Error response: ${response}`);
            }
            const result: any = await response.json()

            const message: any[] = result.message;
            return message;
        } catch (error) {
            console.error('Error sending text message:', error);
            throw error;
        }
    }

    static async sendImageMessage(image: any, id_chat: number) {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    imagen: image
                })
            });

            if (!response) {
                throw new Error(`Error response: ${response}`);
            }
            const result: any = await response.json()

            const message: any[] = result.message;
            return message;
        } catch (error) {
            console.error('Error sending text message:', error);
            throw error;
        }
    }
    static async sendAudioMessage(audio: any, id_chat: number) {
        try {
            const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/audio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    audio: audio
                })
            });

            if (!response) {
                throw new Error(`Error response: ${response}`);
            }
            const result: any = await response.json()

            const message: any[] = result.message;
            return message;
        } catch (error) {
            console.error('Error sending audio message:', error);
            throw error;
        }
    }
}