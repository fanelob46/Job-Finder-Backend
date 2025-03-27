import express from "express";
import { PORT } from "../constants/env.const";
import { ConnectDB } from "../config/db";
import authRouter from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleWare";

const app = express();

app.use(express.json());
 app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});

