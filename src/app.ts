import express from "express";
import { PORT } from "../constants/env.const";
import { ConnectDB } from "../config/db";
import authRouter from "./routes/authRoutes";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleWare";
import jobRouter from "./routes/jobRoutes";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,DELETE,PUT",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/jobs", jobRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
