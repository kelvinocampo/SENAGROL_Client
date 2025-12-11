import api from "../../config/api";

export class MessageService {

  /* ───────── Mensajes de texto ───────────────── */
  static async getMessages(id_chat: number): Promise<Message[]> {
    const res = await api.get(`/chat/${id_chat}`);
    return res.data.data ?? res.data;
  }

  static async sendTextMessage(text: string, id_chat: number): Promise<Message> {
    const res = await api.post(`/chat/${id_chat}/message/text`, { text });
    return res.data.data ?? res.data;
  }

  /* ───────── Mensajes con imagen ─────────────── */
  static async sendImageMessage(imageFile: File, id_chat: number): Promise<Message> {
    const form = new FormData();
    form.append('imagen', imageFile);

    const res = await api.post(`/chat/${id_chat}/message/image`, form);
    const data = res.data.data ?? res.data;

    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido: data._contenido ?? data.contenido,
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat: data._id_chat ?? data.id_chat,
      id_user: data._id_user ?? data.id_user,
      tipo: 'imagen',
      editado: 0,
    };
  }

  /* ───────── Mensajes con audio ──────────────── */
  static async sendAudioMessage(audioBlob: Blob, id_chat: number): Promise<Message> {
    const form = new FormData();
    form.append('audio', audioBlob, 'audio.webm');

    const res = await api.post(`/chat/${id_chat}/message/audio`, form);
    const data = res.data.data ?? res.data;

    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido: data._contenido ?? data.contenido,
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat: data._id_chat ?? data.id_chat,
      id_user: data._id_user ?? data.id_user,
      tipo: 'audio',
      editado: 0,
    };
  }

  /* ───────── Otros métodos ───────────────────── */
  static async deleteMessage(id_message: number, id_chat: number): Promise<void> {
    await api.delete(`/chat/${id_chat}/message/${id_message}`);
  }

  static async editMessage(id_message: number, text: string, id_chat: number): Promise<Message> {
    const res = await api.put(`/chat/${id_chat}/message/${id_message}`, { text });
    const data = res.data.data ?? res.data;

    return {
      id_mensaje: data._id_mensaje ?? data.id_mensaje,
      contenido: data._contenido ?? data.contenido,
      fecha_envio: data._fecha_envio ?? data.fecha_envio,
      id_chat: data._id_chat ?? data.id_chat,
      id_user: data._id_user ?? data.id_user,
      tipo: data._tipo ?? data.tipo ?? 'texto',
      editado: data._editado ?? data.editado ?? 1,
    };
  }
}

/* ───────── Interfaz Message ───────────────────── */
export interface Message {
  id_mensaje: number;
  contenido: string;
  fecha_envio: string;
  id_user: number;
  id_chat: number;
  tipo: 'texto' | 'imagen' | 'audio';
  editado: number;
  estado?: "enviando" | "enviado" | "error"; // Estado opcional
  tempId?: string; // ✅ nuevo
}
