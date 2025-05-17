export const obtenerPerfilUsuario = async (token: string) => {
    try {
      const res = await fetch('http://localhost:10101/usuario/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Error al obtener perfil');
      }
  
      const data = await res.json();
      console.log("Datos del backend:", data);
      
      // Retorna el primer usuario dentro del array user
      return data.user[0], data.user; 
    } catch (error) {
      console.error('Error en obtenerPerfilUsuario:', error);
      return null;
    }
  };
  