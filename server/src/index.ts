import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ok: true});
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
