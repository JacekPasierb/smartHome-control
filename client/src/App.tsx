import {useEffect, useState} from "react";

import {SensorCard} from "./components/SensorCard";
import {SecurityCard} from "./components/SecurityCard";
import {AlertsFeed} from "./components/AlertsFeed";
import {LiveChart} from "./components/LiveChart";
import type {HomeId, HomeState, TemperatureSensorId} from "./types/home";
import {useHomeSocket} from "./hooks/useHomeSocket";

const API_URL = import.meta.env.VITE_API_URL as string;

export default function App() {
  const [homeId, setHomeId] = useState<HomeId>("123");
  const [data, setData] = useState<HomeState | null>(null);
  const [chartSensorId, setChartSensorId] =
    useState<TemperatureSensorId>("temp_room");

  useEffect(() => {
    fetch(`${API_URL}/api/home/${homeId}/state`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error);
  }, [homeId]);
  const {wsStatus} = useHomeSocket(
    homeId,
    (payload) => {
      setData(payload);
    },
    (payload) => {
      console.log("ALERT:", payload);
    }
  );
  const wsStatusColor = wsStatus === "online" ? "green" : wsStatus === "connecting" ? "gold" : "red";
  const wsStatusText = wsStatus === "online" ? "Online" : wsStatus === "connecting" ? "Connecting" : "Offline";
  if (!data) return <div style={{padding: 20}}>Loading...</div>;
  return (
    <div className="container">
      <h1>SmartHome Control Center</h1>
      <div style={{display:"flex", alignItems:"center", gap: 10, marginBottom: 16}}>
        <div style={{width:"10px", height:"10px", borderRadius:"999px", backgroundColor: wsStatusColor  } }></div>
        <span>{wsStatusText}</span>      
      </div>
      <div style={{marginBottom: 16}}>
        <button onClick={() => setHomeId("123")}>Home A</button>
        <button onClick={() => setHomeId("456")} style={{marginLeft: 10}}>
          Home B
        </button>
        <span style={{marginLeft: 12}}>Active: {homeId}</span>
      </div>

      <div className="grid">
        <div className="panel">
          <h2>Sensors</h2>

          <div className="cardsGrid">
            {Object.entries(data.sensors).map(([key, sensor]) => (
              <SensorCard key={key} sensor={sensor} />
            ))}
          </div>
        </div>

        <div style={{display: "grid", gap: 16}}>
          <div className="panel">
            <h2>Live chart</h2>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <button onClick={() => setChartSensorId("temp_fridge")}>
                Lodówka
              </button>
              <button onClick={() => setChartSensorId("temp_balcony")}>
                Balkon
              </button>
              <button onClick={() => setChartSensorId("temp_room")}>
                Pokój
              </button>
            </div>

            <LiveChart
              title={`Temperature • ${data.sensors[chartSensorId].name}`}
              value={data.sensors[chartSensorId].value}
            />
          </div>
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
