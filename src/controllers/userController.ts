import { RequestHandler } from "express";
import { deleteOneDoc, getAllDocs, getOneDoc, updateOneDoc } from "../service/crudHandlerFactor";
import User from "../models/user.model";

export const getUser: RequestHandler = getOneDoc(User);
export const deleteUser: RequestHandler = deleteOneDoc(User);
export const updateUser: RequestHandler = updateOneDoc(User);
export const getAllUser: RequestHandler = getAllDocs(User);
