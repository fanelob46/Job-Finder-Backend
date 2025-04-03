import { Request, RequestHandler, Response } from "express";
import {
  deleteOneDoc,
  getAllDocs,
  getOneDoc,
  updateOneDoc,
} from "../service/crudHandlerFactor";
import User from "../models/user.model";
import { applyForJob, getUserApplications } from "../service/authService";
import { INTERNAL_SERVER_ERROR, OK } from "../../constants/http.codes";

export const getUser: RequestHandler = getOneDoc(User);
export const deleteUser: RequestHandler = deleteOneDoc(User);
export const updateUser: RequestHandler = updateOneDoc(User);
export const getAllUser: RequestHandler = getAllDocs(User);

// interface AuthRequest extends Request {
//   user?: {
//     _id: string; 
//   };
//   body: {
//     jobId: string; 
//   };
// }

export const applyForHandler = async (req: Request, res: Response) => {
  const { jobId } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" }); 
  }

  const result = await applyForJob(jobId, userId);

  if (result) {
    res.status(OK).json({
      message: "Successfully applied for a job",
    });
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "Failed to apply for a job",
    });
  }
};

export const getUserApplicationsHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" }); 
  }

  const result = await getUserApplications(userId.toString()); // Ensure userId is a string
  if (result) {
    res.status(OK).json({
      message: "Jobs applied For",
      data: result,
    });
  } else {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: "No jobs found",
    });
  }
};


