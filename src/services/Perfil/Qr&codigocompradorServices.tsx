import axios from "axios";

export const getCodigoCompra = async (id_compra: string, token: string | null) => {
  if (!id_compra) {
    throw new Error("ID de compra no válido.");
  }

  try {
    const response = await axios.get(
      `https://senagrol-server-1.onrender.com/compra/code/${id_compra}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.code;  
  } catch (error: any) {
    console.error("Error al obtener el código:", error);
    throw new Error("No se pudo generar el código.");
  }
};
