import { useEffect, useState, useRef } from "react";

class WS_Module {
  // useWebSocket.ts

  useWebSocket = (url: string, onMessage: (event: MessageEvent) => void) => {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      wsRef.current.onmessage = onMessage;

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    }, [url, onMessage]);

    const sendMessage = (message: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(message);
      } else {
        console.error("WebSocket is not open");
      }
    };

    return { sendMessage };
  };
}



export default WS_Module;