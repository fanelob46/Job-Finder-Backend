
import { CREATED } from "../../constants/http.codes";
import Jobs from "../models/job.model";
import asyncHandler from "express-async-handler"

import { Request, Response, NextFunction, RequestHandler } from "express";
import { addJob } from "../service/jobService";
import { deleteOneDoc, getAllDocs, getOneDoc, updateOneDoc } from "../service/crudHandlerFactor";


export const getJob : RequestHandler = getOneDoc(Jobs)
export const deleteJob: RequestHandler = deleteOneDoc(Jobs);
export const updateJob: RequestHandler = updateOneDoc(Jobs);
export const getAllJobs: RequestHandler = getAllDocs(Jobs);

interface JobRequestBody {
  title: string;
  type: string;
  location: string;
  category: string;
  salary: number;
  desc: string;
  requirements?: string;
}

export const addJobHandler = asyncHandler(
  async (
    req: Request<{}, {}, JobRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    
      const jobData = await addJob(req.body);
      const data = new Jobs(jobData);

      res.status(CREATED).json({
        message: "Job Created Successfully",
        data: data,
      });
    
  }
);

