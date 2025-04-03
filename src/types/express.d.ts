// import { Request } from "express";
// declare module 'express' {
//     interface Request{
//         user?:{_id:string}
// }}

import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}