import { ObjectId } from "mongoose";
import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../../constants/http.codes";
import Jobs from "../models/job.model";
import User, { UserDocument, UserRole } from "../models/user.model";
import { HttpError } from "../utils/HttpError";

interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  location: string;
  contact: string;
  role?: UserRole;
}

interface Credentials {
  email: string;
  password: string;
}

interface UpdateData {
  userId: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  location?: string;
  contact?: string;
  role?: UserRole;
  password?: string;
  oldPassword?: string;
}

interface ApplicationResult {
  success: boolean;
  message: string;
  data?: any;
}

interface ApplyForJobParams {
  jobId: string;
  userId: string;
}

interface ApplyForJobResponse {
  success: boolean;
  message: string;
}

interface Job {
  _id: ObjectId | any;
  applications: ObjectId[]; // Or string[], depending on how you store user IDs
  // ... other job properties
}

export const registerUser = async (
  userData: UserData
): Promise<UserDocument> => {
  const { email } = userData;

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new HttpError("Email already exists", CONFLICT);
  }

  const newUser = await User.create(userData);
  return newUser;
};

export const loginUser = async (
  credentials: Credentials
): Promise<UserDocument> => {
  const { email, password } = credentials;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new HttpError("Invalid login details", UNAUTHORIZED);
  }

  return user;
};

export const updateProfile = async (
  updateData: UpdateData
): Promise<Omit<UserDocument, "password">> => {
  const {
    userId,
    firstname,
    lastname,
    email,
    location,
    contact,
    role,
    password,
    oldPassword,
  } = updateData;

  // Include password in the query since we might need it for validation
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new HttpError("User not found", NOT_FOUND);
  }

  // Update basic fields
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new HttpError("Email already in use", CONFLICT);
    }
    user.email = email;
  }

  if (location) user.location = location;
  if (contact) user.contact = contact;
  if (role) user.role = role;

  // Handle password update
  if (password) {
    if (!oldPassword) {
      throw new HttpError(
        "Old password is required to update password",
        BAD_REQUEST
      );
    }

    const isPasswordValid = await user.matchPassword(oldPassword);
    if (!isPasswordValid) {
      throw new HttpError("Old password is incorrect", UNAUTHORIZED);
    }

    user.password = password;
  }

  const updatedUser = await user.save();

  // Convert to plain object and remove password
  const userObject = updatedUser.toObject();
  // delete userObject.password;

  // Explicitly type the return value
  return userObject as Omit<UserDocument, "password">;
};

export const applyForJob = async (
  jobId: string,
  userId: string
): Promise<{ success: boolean; message: string }> => {
 
  const alreadyApplied = await Jobs.findOne({
    _id: jobId,
    applications: userId,
  });

  if (alreadyApplied) {
    throw new HttpError("You have already applied for this job", CONFLICT);
  }

  // Add the user to the job's applications
  const job = await Jobs.findByIdAndUpdate(
    jobId,
    { $push: { applications: userId } },
    { new: true }
  );

  if (!job) {
    throw new HttpError("Job not found", NOT_FOUND);
  }

  return {
    success: true,
    message: "Application submitted successfully",
  };
};

export const getUserApplications = async (
  userId: string
): Promise<{ success: boolean; message: string; data: Job[] }> => {
  
    //Find jobs the user has applied for
    const jobs = await Jobs.find({ applications: userId }).populate({
      path: "applications",
      select: "firstname lastname email",
    });

    // Check if jobs were found
    if (!jobs || jobs.length === 0) {
      throw new HttpError("No applications found", NOT_FOUND);
    }

    // Return the result
    return {
      success: true,
      message: "Jobs user has applied for",
      data: jobs,
    };
  
};
