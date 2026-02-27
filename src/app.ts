import express from "express";
import cors from "cors";
import morgan from "morgan"

const app = express();

// Config
app.use(cors())
app.use(morgan("dev"));
app.use(express.json())

// Routes

export default app;