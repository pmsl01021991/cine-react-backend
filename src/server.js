import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import reservasRouter from "./routes/reservas.js";
import contactoRouter from "./routes/contacto.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONT_DIR = path.join(__dirname, "..", "..");

const app = express();

// ✅ Cloud Run / proxy (arregla X-Forwarded-For con express-rate-limit)
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ IMPORTANTE: permite React (5173)
const origin = process.env.ALLOWED_ORIGIN || "http://localhost:5173";
app.use(cors({ origin }));

app.use(express.static(FRONT_DIR));

app.get("/", (_req, res) => {
  res.sendFile(path.join(FRONT_DIR, "index.html"));
});

app.use("/api", rateLimit({ windowMs: 60_000, max: 60 }));

// 🔹 AQUÍ SE MONTAN LAS RUTAS
app.use("/api/reservas", reservasRouter);
app.use("/api/auth", authRouter);
app.use("/api/contacto", contactoRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
});

