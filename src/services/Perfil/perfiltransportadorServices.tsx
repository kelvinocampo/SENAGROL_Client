import api from "../../config/api";

export const obtenerTransportadores = async () => {
  try {
    const response = await api.get("/transportador/");
    const data = response.data;
    if (data && data.transporters) {
      return data.transporters;
    } else {
      throw new Error("La estructura de datos no es la esperada.");
    }
  } catch (error) {
    console.error("Error al obtener transportadores:", error);
    throw error;
  }
};
