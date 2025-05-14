export const register = async (name: string, username: string, email: string, password: string, phone: string) => {
  const response = await fetch("/usuario/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, username, email, password, phone })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Tienes algún dato mal");
  }

  return data;
};
