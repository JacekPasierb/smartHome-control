import {useEffect, useState} from "react";
import {io} from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = import.meta.env.VITE_WS_URL;
export default function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/home/123/state`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const socket = io(WS_URL, {transports: ["websocket"]});

    socket.on("connect", () => {
      console.log("WS connected", socket.id);
    });

    socket.on("tick", (payload) => {
      console.log("tick", payload);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{padding: 20}}>
      <h1>SmartHome Control Center</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
