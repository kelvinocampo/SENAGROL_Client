import api from "../config/api";

export const getCodigoCompra = async (id_compra: string) => {
  if (!id_compra) {
    throw new Error("ID de compra no válido.");
  }

  try {
    const response = await api.get(`/compra/code/${id_compra}`);

    if (response.data && response.data.code) {
      return response.data.code;
    } else {
      throw new Error("No se recibió un código válido.");
    }
  } catch (error: any) {
    console.error("Error al obtener el código:", error.response || error.message || error);
    throw new Error("No se pudo generar el código.");
  }
};
