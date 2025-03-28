import mongoose, {  Schema, Document, Model } from "mongoose";


interface IJob extends Document {
  title: string;
  type: string;
  location: string;
  category: string;
  salary: number;
  desc: string;
  requirements?: string; 
  applications: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema: Schema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    salary: { type: Number, required: true },
    desc: { type: String, required: true },
    requirements: { type: String },
    applications: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);


const Jobs: Model<IJob> = mongoose.model<IJob>("Jobs", jobSchema);

export default Jobs;
