const API_URL = "http://localhost/10101";

export async function receiveBuyCode(
  codigo: string,
  token: string
): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/compra/state/${codigo}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en receiveBuyCode:", error);
    throw new Error("No se pudo conectar con el servidor.");
  }
}
