// src/services/qrService.ts
import axios from "axios";

const API_URL = "http://localhost:3000"; // Ajusta según tu backend

export const fetchPurchaseCode = async (id_compra: number, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/code/${id_compra}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al obtener código de compra:", error);
    throw error;
  }
};

export const sendScannedCode = async (codigo: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/receive-code`,
      { codigo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("❌ Error al enviar código escaneado:", error);
    throw error;
  }
};
