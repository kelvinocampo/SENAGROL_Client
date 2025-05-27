export const getUserRole = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token');

  const res = await fetch('https://senagrol.vercel.app/usuario/role', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Error al obtener el rol');

  const data = await res.json();
  console.log("Respuesta del backend:", data);

  return data.roles?.toLowerCase(); // ✅ Cambiado de `role` a `roles`
};
