import type {Alarm, Door} from "../types/home";

type SecurityCardProps = {
  door: Door;
  alarm: Alarm;
};
export function SecurityCard({door, alarm}: SecurityCardProps) {
  return (
    <div className="card">
      <div className="cardTitle">Security</div>

      <div style={{marginTop: 10}}>
        <div className="row">
          <span className="muted">{door.name}</span>
          <strong>{door.state === "open" ? "🚪 Open" : "🔒 Closed"}</strong>
        </div>

        <div className="row" style={{marginTop: 8}}>
          <span className="muted">Alarm</span>
          <strong>{alarm.armed ? "🛡 Armed" : "🛑 Disarmed"}</strong>
        </div>

        {alarm.triggered && <div className="banner">🚨 Alarm triggered!</div>}
      </div>
    </div>
  );
}
