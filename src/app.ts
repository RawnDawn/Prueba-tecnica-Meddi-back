import express from "express";
import cors from "cors";
import morgan from "morgan"
import taskRoutes from "@/routes/task.routes"

const app = express();

// Config
app.use(cors())
app.use(morgan("dev"));
app.use(express.json())

// Routes
app.use("/tasks", taskRoutes);

export default app;