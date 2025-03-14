import { io } from "socket.io-client";

let socket;

export const connectSocket = (url = "https://backend.stage.cricap.com/") => {
  if (!socket || !socket.connected) {
    socket = io(url, {
      transports: ["websocket"], // Use WebSocket only
      reconnection: true, // Enable auto-reconnect
      reconnectionAttempts: 5, // Max retry attempts
      reconnectionDelay: 1000, // Delay between retries
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket disconnected manually");
  }
};
