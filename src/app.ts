import express from "express";
import { PORT } from "../constants/env.const";
import { ConnectDB } from "../config/db";
import authRouter from "./routes/authRoutes";

const app = express();

app.use(express.json());
// app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
function cookieParser(): any {
  throw new Error("Function not implemented.");
}

