export const getUserRole = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No hay token');

  const res = await fetch('https://senagrol.up.railway.app/usuario/role', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Error al obtener el rol');

  const data = await res.json();

  return data.roles?.toLowerCase(); // ✅ Cambiado de `role` a `roles`
};
