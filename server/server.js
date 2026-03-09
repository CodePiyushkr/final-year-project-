import express from "express";
import cors from "cors";
import generateRouter from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", generateRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Website Builder API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
