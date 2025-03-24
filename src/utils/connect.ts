//this is config.db

import config from "config"
import { error } from "console";
import mongoose from "mongoose"

export const connectDb = async() => {
  try {
    const momgo_uri = config.get<string>("Mongo_Uri");
    const conn = await mongoose.connect(momgo_uri);

    console.log(`MongoDB Connected ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
}