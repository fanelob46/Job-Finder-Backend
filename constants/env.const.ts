import dotenv from "dotenv";
dotenv.config();

export const MONGO_URI = process.env.MONGO_URI;
export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET;
