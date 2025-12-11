import api from "../../config/api";

export const asignarTransportador = async (
  id_compra: number,
  id_transportador: number,
  precio_transporte: number
) => {
  try {
    const response = await api.patch(
      `/compra/assign/${id_compra}/${id_transportador}`,
      {
        precio_transporte: precio_transporte,
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error al asignar transportador:", error);
    throw error;
  }
};
