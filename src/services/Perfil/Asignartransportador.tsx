export const asignarTransportador = async (
  id_compra: number,
  id_transportador: number,
  precio_transporte: number
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `https://senagrol.up.railway.app/compra/assign/${id_compra}/${id_transportador}`,
      {                             
        method: "PATCH",  
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          precio_transporte: precio_transporte,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al asignar transportador");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error al asignar transportador:", error);
    throw error;
  }
};
