import { INTERNAL_SERVER_ERROR } from "../../constants/http.codes";
import Jobs from "../models/job.model";
import { HttpError } from "../utils/HttpError.js";
import { Document } from "mongoose";

interface JobData {
  title: string;
  type: string;
  location: string;
  category: string;
  salary: number;
  desc: string;
  requirements?: string;
}

interface Applicant {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}



export const addJob = async (jobData: JobData) => {
  const { title, type, location, category, salary, desc, requirements } =
    jobData;

  const newJob = await Jobs.create({
    title,
    type,
    location,
    category,
    salary,
    desc,
    requirements,
  });

  return newJob;
};





