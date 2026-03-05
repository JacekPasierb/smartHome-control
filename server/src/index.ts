import express from "express";
import cors from "cors";
import morgan from "morgan";
import {createServer} from "http";
import {Server} from "socket.io";

const app = express();
const PORT = 4000;

const ts = Date.now();

const homes: Record<string, any> = {
  "123": {
    homeId: "123",
    updatedAt: ts,
    sensors: {
      temp_fridge: {name: "Lodówka", value: 4.2, unit: "°C"},
      temp_balcony: {name: "Balkon", value: -1.3, unit: "°C"},
      temp_room: {name: "Pokój", value: 21.5, unit: "°C"},
      humidity_room: {name: "Wilgotność", value: 45, unit: "%"},
      power_total: {name: "Pobór mocy", value: 320, unit: "W"},
    },
    security: {
      door_main: {name: "Drzwi wejściowe", state: "closed"},
      alarm: {armed: false, triggered: false},
    },
    alerts: [],
  },
  "456": {
    homeId: "456",
    updatedAt: ts,
    sensors: {
      temp_fridge: {name: "Lodówka", value: 5.1, unit: "°C"},
      temp_balcony: {name: "Balkon", value: 2.4, unit: "°C"},
      temp_room: {name: "Pokój", value: 19.3, unit: "°C"},
      humidity_room: {name: "Wilgotność", value: 52, unit: "%"},
      power_total: {name: "Pobór mocy", value: 410, unit: "W"},
    },
    security: {
      door_main: {name: "Drzwi wejściowe", state: "closed"},
      alarm: {armed: false, triggered: false},
    },
    alerts: [],
  },
};

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ok: true});
});

app.get("/api/home/:id/state", (_req, res) => {
  const {id} = _req.params;
  res.json(homes[id] ?? homes["123"]);
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

  socket.on("subscribe:home", (homeId: string) => {
    socket.join(`home:${homeId}`);
    console.log(`➡️ ${socket.id} joined room home:${homeId}`);

    socket.emit("home:update", homes[homeId] ?? homes["123"]);
  });

  socket.on("unsubscribe:home", (homeId: string) => {
    socket.leave(`home:${homeId}`);
    console.log(`⬅️ ${socket.id} left room home:${homeId}`);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ WS disconnected:", socket.id, "reason:", reason);
  });
});

setInterval(() => {
  Object.values(homes).forEach((home: any) => {
    home.sensors.temp_fridge.value = Number(
      (2 + Math.random() * 10).toFixed(1)
    );
    home.sensors.temp_balcony.value = Number(
      (-10 + Math.random() * 20).toFixed(1)
    );
    home.sensors.temp_room.value = Number((18 + Math.random() * 8).toFixed(1));
    home.sensors.humidity_room.value = Math.round(35 + Math.random() * 30);
    home.sensors.power_total.value = Math.round(200 + Math.random() * 2300);

    home.updatedAt = Date.now();

    io.to(`home:${home.homeId}`).emit("home:update", home);
  });
}, 2000);

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
