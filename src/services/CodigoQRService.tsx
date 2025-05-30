import axios from "axios";

export const getCodigoCompra = async (id_compra: string, token: string | null) => {
  if (!id_compra) {
    throw new Error("ID de compra no válido.");
  }

  if (!token) {
    throw new Error("Token no proporcionado.");
  }

  try {
    const response = await axios.get(
      `http://localhost:10101.app/compra/code/${id_compra}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    

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
