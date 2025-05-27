export const obtenerTransportadores = async () => {
  try {
    const response = await fetch("https://senagrol.up.railway.app/transportador/");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
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
