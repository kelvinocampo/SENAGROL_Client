// src/services/QRService.ts
import axios from "axios";

const API_URL = "http://localhost:10101/compra/code"; // sin ":id_compra"

export const QRService = {
  generateCode: async (id_compra: number, token: string | null): Promise<string> => {
    if (!token) throw new Error("No autenticado");

    const response = await axios.get(`${API_URL}/${id_compra}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.data.code;
  },
};
