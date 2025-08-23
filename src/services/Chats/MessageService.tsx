export class MessageService {
  static readonly API_URL = 'https://senagrol-server-1.onrender.com';

  /* ───────── Helpers ─────────────────────────── */
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result.data ?? result;          // Ajusta según tu backend
  }

  private static getHeaders(json = true): HeadersInit {
    const headers: HeadersInit = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };
    if (json) headers['Content-Type'] = 'application/json';
    return headers;
  }

  /* ───────── Mensajes de texto ───────────────── */
  static async getMessages(id_chat: number): Promise<Message[]> {
    const res = await fetch(`${this.API_URL}/chat/${id_chat}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse<Message[]>(res);
  }

  static async sendTextMessage(text: string, id_chat: number): Promise<Message> {
    const res = await fetch(`${this.API_URL}/chat/${id_chat}/message/text`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
    return this.handleResponse<Message>(res);
  }

  /* ───────── Mensajes con imagen ─────────────── */
  static async sendImageMessage(imageFile: File, id_chat: number): Promise<Message> {
    const form = new FormData();
   form.append('imagen', imageFile);     // Ajusta el nombre si tu backend usa otro
    const res = await fetch(`${this.API_URL}/chat/${id_chat}/message/image`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: form,
    });

    const data = await this.handleResponse<any>(res);
    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido : data._contenido   ?? data.contenido,
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat   : data._id_chat     ?? data.id_chat,
      id_user   : data._id_user     ?? data.id_user,
      tipo      : 'imagen',
      editado   : 0,
    };
  }

  /* ───────── Mensajes con audio ──────────────── */
  static async sendAudioMessage(audioBlob: Blob, id_chat: number): Promise<Message> {
    const form = new FormData();
    form.append('audio', audioBlob, 'audio.webm');   // <‑‑ nombre/filename según tu backend

    const res = await fetch(`${this.API_URL}/chat/${id_chat}/message/audio`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: form,
    });

    const data = await this.handleResponse<any>(res);
    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido : data._contenido   ?? data.contenido,   // p. ej. URL donde queda el audio
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat   : data._id_chat     ?? data.id_chat,
      id_user   : data._id_user     ?? data.id_user,
      tipo      : 'audio',
      editado   : 0,
    };
  }

  /* ───────── Otros métodos ───────────────────── */
  static async deleteMessage(id_message: number, id_chat: number): Promise<void> {
    const res = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    await this.handleResponse<void>(res);
  }

  static async editMessage(id_message: number, text: string, id_chat: number): Promise<Message> {
    const res = await fetch(`${this.API_URL}/chat/${id_chat}/message/${id_message}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });

    const data = await this.handleResponse<any>(res);
    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido : data._contenido   ?? data.contenido,
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat   : data._id_chat     ?? data.id_chat,
      id_user   : data._id_user     ?? data.id_user,
      tipo      : data._tipo ?? data.tipo ?? 'texto',
      editado   : data._editado ?? data.editado ?? 1,
    };
  }
}

/* ───────── Interfaz Message ───────────────────── */
export interface Message {
  id_mensaje: number;
  contenido : string;
  fecha_envio: string;
  id_user   : number;
  id_chat   : number;
  tipo      : 'texto' | 'imagen' | 'audio';
  editado   : number;
  estado?: "enviando" | "enviado" | "error"; // Estado opcional
  tempId?: string; // ✅ nuevo
}
