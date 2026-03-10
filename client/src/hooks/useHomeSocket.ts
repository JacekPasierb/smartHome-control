import {useEffect, useRef, useState} from "react";
import type {AlertNewPayload, HomeId, HomeUpdatePayload} from "../types/home";
import {io, type Socket} from "socket.io-client";
import type {ClientToServerEvents, ServerToClientEvents} from "../types/socket";

const WS_URL = import.meta.env.VITE_WS_URL as string;
type WsStatus = "connecting" | "online" | "offline";

export function useHomeSocket(
  homeId: HomeId,
  onHomeUpdate: (payload: HomeUpdatePayload) => void,
  onAlertNew: (payload: AlertNewPayload) => void
) {
  const [wsStatus, setWsStatus] = useState<WsStatus>("connecting");

  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const prevHomeIdRef = useRef(homeId);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WS connected:", socket.id);
      setWsStatus("online");
     socket.emit("subscribe:home", prevHomeIdRef.current);
    });

    socket.on("disconnect", () => {
      setWsStatus("offline");
    });

    socket.on("home:update", (payload) => {
      onHomeUpdate(payload);
    });

    socket.on("alert:new", (payload) => {
      onAlertNew(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    const prevHomeId = prevHomeIdRef.current;

    if (socket?.connected) {
      socket.emit("unsubscribe:home", prevHomeId);
      socket.emit("subscribe:home", homeId);
    }

    prevHomeIdRef.current = homeId;
  }, [homeId]);

  return {wsStatus};
}
