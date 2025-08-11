// src/socket.ts
import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://code-battle-backend-vq5s.onrender.com",
  { withCredentials: true }
);
