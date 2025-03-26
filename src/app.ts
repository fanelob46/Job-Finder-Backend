import express from "express";
import config from "config";
import { PORT } from "../constants/env.const";
import { ConnectDB } from "../config/db";

const app = express();

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
