import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(url, {
      withCredentials: true,
      extraHeaders: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return socket;
};