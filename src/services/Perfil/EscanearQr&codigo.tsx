import api from "../../config/api";

export async function receiveBuyCode(
  codigo: string,
  compraId?: number
): Promise<any> {
  try {
    const res = await api.patch(`/compra/state/${codigo}`, { compraId });
    return res.data;
  } catch (error) {
    console.error("Error en receiveBuyCode:", error);
    throw new Error("No se pudo conectar con el servidor.");
  }
}
