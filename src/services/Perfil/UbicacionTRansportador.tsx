// src/services/ubicacionService.ts
export interface Ubicacion {
  latitud_comprador: string;
  longitud_comprador: string;
  latitud: string;
  longitud: string;
}

export interface RespuestaUbicacion {
  success: boolean;
  message: Ubicacion | string;
}

export const obtenerUbicacionCompra = async (
  id_compra: number,
  token: string
): Promise<RespuestaUbicacion> => {
  const url = new URL(`https://senagrol.up.railway.app/compra/getLocation/${id_compra}`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};