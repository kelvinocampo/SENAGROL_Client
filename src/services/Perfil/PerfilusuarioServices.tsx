import api from "../../config/api";

export const obtenerPerfilUsuario = async () => {
  try {
    const res = await api.get('/usuario/');
    const data = res.data;

    // Original code returned tuple-like or two values with comma operator, which returns the last one?
    // "return data.user[0], data.user;" -> This returns data.user in JS.
    // But looking at types or usage, it might be expecting an object or array.
    // If the intention was just to return data.user, I will do that.
    // If it matches existing behavior: (a, b) evaluates a then b and returns b.
    return data.user;
  } catch (error) {
    console.error('Error en obtenerPerfilUsuario:', error);
    return null;
  }
};
