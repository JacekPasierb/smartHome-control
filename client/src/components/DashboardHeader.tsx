import type {HomeId} from "../types/home";

type Props = {
  wsStatus: "connecting" | "online" | "offline";
  homeId: HomeId;
  setHomeId: (id: HomeId) => void;
};

export function DashboardHeader({wsStatus, homeId, setHomeId}: Props) {
  const wsStatusColor =
    wsStatus === "online"
      ? "green"
      : wsStatus === "connecting"
      ? "gold"
      : "red";

  const wsStatusText =
    wsStatus === "online"
      ? "Online"
      : wsStatus === "connecting"
      ? "Connecting"
      : "Offline";

  const activeStyle = {
    backgroundColor: "#007bff",
    color: "white",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: 16,
      }}
    >
      <h1>SmartHome Control Center</h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: 8}}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: wsStatusColor,
            }}
          />
          <span>{wsStatusText}</span>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: 10}}>
          <button
            onClick={() => setHomeId("123")}
            style={homeId === "123" ? activeStyle : undefined}
          >
            Home A
          </button>

          <button
            onClick={() => setHomeId("456")}
            style={homeId === "456" ? activeStyle : undefined}
          >
            Home B
          </button>

          <span style={{marginLeft: 8}}>Active: {homeId}</span>
        </div>
      </div>
    </div>
  );
}
