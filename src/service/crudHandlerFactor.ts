import asyncHandler from "express-async-handler";
import { NOT_FOUND, OK } from "../../constants/http.codes";
import { HttpError } from "../utils/HttpError";
import { Document, Model } from "mongoose";
import { Request, Response, NextFunction } from "express";

interface DocumentResult<T> {
  _doc?: T;
}

type DocumentType<T> = Document & T & DocumentResult<T>;

interface HandlerOptions {
  model: Model<DocumentType<any>>;
}

// Generic type for the document
type GenericDocument<T = any> = DocumentType<T>;


const deleteOneDoc = <T>(Model: Model<GenericDocument<T>>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }

    res.status(OK).json({
      status: "doc deleted successfully",
    });
  });


const updateOneDoc = <T>(Model: Model<GenericDocument<T>>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }

    res.status(OK).json({
      status: "doc updated successfully",
      data: {
        data: document,
      },
    });
  });


const getOneDoc = <T>(Model: Model<GenericDocument<T>>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new HttpError("No document found with that ID", NOT_FOUND));
    }

    res.status(OK).json({
      status: "success",
      id: req.params.id,
      data: doc,
    });
  });


const getAllDocs = <T>(Model: Model<GenericDocument<T>>) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const docs = await Model.find();

    res.status(OK).json({
      status: "success",
      result: docs.length,
      data: {
        data: docs,
      },
    });
  });

export { getAllDocs, updateOneDoc, deleteOneDoc, getOneDoc };
