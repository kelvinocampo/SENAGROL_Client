export const obtenerPerfilUsuario = async (token: string) => {
    try {
      const res = await fetch('https://senagrol.vercel.app/usuario/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Error al obtener perfil');
      }
  
      const data = await res.json();
     
      
   
      return data.user[0], data.user; 
    } catch (error) {
      console.error('Error en obtenerPerfilUsuario:', error);
      return null;
    }
  };
  