import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = import.meta.env.VITE_WS_URL as string;

export default function App() {
  const [homeId, setHomeId] = useState<"123" | "456">("123");
  const [data, setData] = useState<any>(null);

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const prevHomeIdRef = useRef<"123" | "456">(homeId);

  useEffect(() => {
    fetch(`${API_URL}/api/home/${homeId}/state`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, [homeId]);

  useEffect(() => {
    const socket = io(WS_URL, {transports: ["websocket"]});
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WS connected", socket.id);

      socket.emit("subscribe:home", prevHomeIdRef.current);
    });

    socket.on("home:update", (payload) => {
      if (payload?.homeId === prevHomeIdRef.current) {
        setData(payload);
      }
    });

    socket.on("alert:new", (payload) => {
      console.log("ALERT", payload);
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

  return (
    <div style={{padding: 20}}>
      <h1>SmartHome Control Center</h1>

      <div style={{marginBottom: 12, display: "flex", gap: 8}}>
        <button onClick={() => setHomeId("123")}>Home A (123)</button>
        <button onClick={() => setHomeId("456")}>Home B (456)</button>
        <strong>Active: {homeId}</strong>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
