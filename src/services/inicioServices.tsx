

export const login = async (identifier: string, password: string) => {
  const response = await fetch("http://localhost:10101/usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ identifier, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Tu usuario o contraseña son incorrectas");
  }

  return data; 
};
