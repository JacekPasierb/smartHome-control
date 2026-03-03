import express from "express";
import cors from "cors";
import morgan from "morgan";
import {createServer} from "http";
import {Server} from "socket.io";

//initialize express app
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ok: true});
});

app.get("/api/home/123/state", (_req, res) => {
  res.json({
    homeId: "123",
    updatedAt: Date.now(),
    sensors: {
      temp_room: {
        name: "Pokój",
        value: 22.5,
        unit: "°C",
      },
    },
    security: {
      alarm: {
        armed: false,
        triggered: false,
      },
    },
    alerts: [],
  });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ WS connected:", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("❌ WS disconnected:", socket.id, "reason:", reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
