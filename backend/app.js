import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes/index.js";
import path from 'path';
import { fileURLToPath } from "url";

const app = express();


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true
}));

app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api", routes);
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;