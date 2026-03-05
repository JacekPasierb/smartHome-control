type Sensor = {
  name: string;
  value: number;
  unit: string;
};

export function SensorCard({sensor}: {sensor: Sensor}) {
  return (
    <div className="card">
      <div className="cardTitle">{sensor.name}</div>
      <div className="cardValue">
        {sensor.value} <span className="muted">{sensor.unit}</span>
      </div>
    </div>
  );
}
