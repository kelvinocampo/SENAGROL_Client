import api from "../../config/api";

export const getCodigoCompra = async (id_compra: string) => {
  if (!id_compra) {
    throw new Error("ID de compra no válido.");
  }

  try {
    const response = await api.get(`/compra/code/${id_compra}`);
    return response.data.code;
  } catch (error: any) {
    console.error("Error al obtener el código:", error);
    throw new Error("No se pudo generar el código.");
  }
};
