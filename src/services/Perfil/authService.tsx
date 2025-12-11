import api from "../../config/api";

export const getUserRole = async () => {
  // api instance handles token automatically
  const res = await api.get('/usuario/role');
  const data = res.data;
  return data.roles?.toLowerCase();
};
