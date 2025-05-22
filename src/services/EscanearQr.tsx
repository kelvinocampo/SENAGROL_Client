const API_URL = "http://localhost:10101"; // Usa tu puerto real aquí


export async function receiveBuyCode(
  codigo: string,
  id_user: number,
  token: string
): Promise<any> {
  try {
    const res = await fetch(`${API_URL}/compra/state/${codigo}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_user }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error en receiveBuyCode:", error);
    throw new Error("No se pudo conectar con el servidor.");
  }
}
