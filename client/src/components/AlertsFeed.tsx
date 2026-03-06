import type {Alert} from "../types/home";
type AlertsFeedProps = {
  alerts: Alert[];
};
export function AlertsFeed({alerts}: AlertsFeedProps) {
  if (!alerts.length) return <div className="muted">No alerts</div>;

  return (
    <div className="alerts">
      {alerts.map((a) => (
        <div key={a.id} className={`alert alert-${a.severity}`}>
          <div className="alertMsg">{a.message}</div>
          <div className="alertTime">
            {new Date(a.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
}
