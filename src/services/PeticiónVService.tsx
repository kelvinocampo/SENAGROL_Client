    export const login = async () => {
    const response = await fetch("/vendedor/requestSeller", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({})
         
    });
      
    const data = await response.json();
      
    if (!response.ok) {
    throw new Error(data.message || data.error || "");
    }
      
    return data; 
    };
      