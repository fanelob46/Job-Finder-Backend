import { Types } from "mongoose";

export type SanitizedUser = {
  _id: Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  role: "admin" | "user";
  contact: string;
  location: string;
  jobs: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};
