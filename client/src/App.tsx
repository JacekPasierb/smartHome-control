import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import {SensorCard} from "./components/SensorCard";
import {SecurityCard} from "./components/SecurityCard";
import {AlertsFeed} from "./components/AlertsFeed";

const API_URL = import.meta.env.VITE_API_URL as string;
const WS_URL = import.meta.env.VITE_WS_URL as string;

export default function App() {
  const [homeId, setHomeId] = useState<"123" | "456">("123");
  const [data, setData] = useState<any>(null);

  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const prevHomeIdRef = useRef(homeId);

  // REST snapshot
  useEffect(() => {
    fetch(`${API_URL}/api/home/${homeId}/state`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error);
  }, [homeId]);

  // WebSocket connection
  useEffect(() => {
    const socket = io(WS_URL, {transports: ["websocket"]});
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("WS connected:", socket.id);

      socket.emit("subscribe:home", prevHomeIdRef.current);
    });

    socket.on("home:update", (payload) => {
      if (payload?.homeId === prevHomeIdRef.current) {
        setData(payload);
      }
    });

    socket.on("alert:new", (payload) => {
      console.log("ALERT:", payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // switch home
  useEffect(() => {
    const socket = socketRef.current;
    const prevHomeId = prevHomeIdRef.current;

    if (socket?.connected) {
      socket.emit("unsubscribe:home", prevHomeId);
      socket.emit("subscribe:home", homeId);
    }

    prevHomeIdRef.current = homeId;
  }, [homeId]);

  if (!data) return <div style={{padding: 20}}>Loading...</div>;

  return (
    <div className="container">
      <h1>SmartHome Control Center</h1>

      {/* HOME SWITCH */}
      <div style={{marginBottom: 16}}>
        <button onClick={() => setHomeId("123")}>Home A</button>
        <button onClick={() => setHomeId("456")} style={{marginLeft: 10}}>
          Home B
        </button>
        <span style={{marginLeft: 12}}>Active: {homeId}</span>
      </div>

      <div className="grid">
        {/* SENSORS */}
        <div className="panel">
          <h2>Sensors</h2>

          <div className="cardsGrid">
            {Object.entries(data.sensors).map(([key, sensor]: any) => (
              <SensorCard key={key} sensor={sensor} />
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{display: "grid", gap: 16}}>
          <div className="panel">
            <h2>Security</h2>

            <SecurityCard
              door={data.security.door_main}
              alarm={data.security.alarm}
            />
          </div>

          <div className="panel">
            <h2>Alerts</h2>

            <AlertsFeed alerts={data.alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
