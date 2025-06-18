export class MessageService {
    static readonly API_URL = 'http://localhost:10101';

    private static async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.data; // Asume que el backend siempre envía { data: ... }
    }

    static async getMessages(id_chat: number): Promise<Message[]> {
        const response = await fetch(`${this.API_URL}/chat/${id_chat}`, {
            method: 'GET',
            headers: this.getHeaders()
        });
        return this.handleResponse<Message[]>(response);
    }

    static async sendTextMessage(text: string, id_chat: number): Promise<Message> {
        const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/text`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ text })
        });
        return this.handleResponse<Message>(response);
    }



   static async sendImageMessage(imageFile: File, id_chat: number): Promise<Message> {
    const formData = new FormData();
    formData.append('image', imageFile); // Cambiado de 'imagen' a 'image' (verifica qué espera tu backend)

    const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // No incluir 'Content-Type': el navegador lo establecerá automáticamente con el boundary correcto
        },
        body: formData
    });

    const result = await response.json();
    
    // Verifica la estructura real de la respuesta con console.log(result)
    const responseData = result.data || result; // Dependiendo de cómo responda tu backend
    
    return {
        id_mensaje: responseData._id_mensaje || responseData.id_mensaje,
        contenido: responseData._contenido || responseData.contenido,
        fecha_envio: responseData._fecha_envio || responseData.fecha_envio,
        id_chat: responseData._id_chat || responseData.id_chat,
        id_user: responseData._id_user || responseData.id_user,
        tipo: 'imagen',
        editado: 0
    };
}

    static async deleteMessage(id_message: number, id_chat: number): Promise<void> {
        const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });
        await this.handleResponse<void>(response);
    }

static async editMessage(id_message: number, text: string, id_chat: number): Promise<Message> {
    const response = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data; // Ajusta según la estructura real de tu backend

    // Asegúrate de mapear correctamente los campos
    return {
        id_mensaje: data._id_mensaje || data.id_mensaje,
        contenido: data._contenido || data.contenido,
        fecha_envio: data._fecha_envio || data.fecha_envio,
        id_chat: data._id_chat || data.id_chat,
        id_user: data._id_user || data.id_user,
        tipo: data._tipo || data.tipo || 'texto',
        editado: data._editado || data.editado || 1 // Marcamos como editado
    };
}

    private static getHeaders(json: boolean = true): HeadersInit {
        const headers: HeadersInit = {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        if (json) {
            headers['Content-Type'] = 'application/json';
        }
        return headers;
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