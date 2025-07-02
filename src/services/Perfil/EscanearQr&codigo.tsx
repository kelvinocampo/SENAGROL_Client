const API_URL = "https://senagrol.up.railway.app";

export async function receiveBuyCode(
  codigo: string,
  token: string,
  compraId?: number // ✅ Este tercer parámetro debe estar aquí
): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/compra/state/${codigo}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ compraId }), // ✅ Enviar el ID de la compra en el body
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en receiveBuyCode:", error);
    throw new Error("No se pudo conectar con el servidor.");
  }
}
