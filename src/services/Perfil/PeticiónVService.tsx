
export const requestSeller = async (token: string) => {
    const response = await fetch("http://localhost/10101/vendedor/requestSeller", {
   method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}) 
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || "Error al solicitar ser vendedor.");
  }

  return data;
};