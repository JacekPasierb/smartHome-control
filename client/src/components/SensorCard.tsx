import type {Sensor} from "../types/home";

type SensorCardProps = {
  sensor: Sensor;
};

export function SensorCard({sensor}: SensorCardProps) {
  return (
    <div className="card">
      <div className="cardTitle">{sensor.name}</div>
      <div className="cardValue">
        {sensor.value} <span className="muted">{sensor.unit}</span>
      </div>
    </div>
  );
}
