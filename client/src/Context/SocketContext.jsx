import React, { createContext, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import {useAuth} from "./AuthContext";

const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {transports: ["websocket"], autoConnect: false });

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => {
    const token = useAuth();
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
      socket.emit("register", token.token);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext );
};
