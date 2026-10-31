import { useEffect, useState } from "react";

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const Socket = new WebSocket(url);
    setWs(Socket);

    Socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    }

    return () => {
      Socket.close();
    }
  }, [url]);

  const sendMessage = (message) => {
    if (ws) {
      ws.send(message);
    };
  };

  return { messages, sendMessage };
};

export default useWebSocket;