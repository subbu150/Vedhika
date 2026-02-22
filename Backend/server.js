import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { apiLimiter } from "./middleware/rateLimit.js";


dotenv.config();
connectDB();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://vedhika-1.onrender.com"
  ],
  credentials: true
}));
app.use(morgan("dev"));
app.use(apiLimiter);

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
// health route
app.get("/", (req, res) => {
  res.send("🚀 API running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
