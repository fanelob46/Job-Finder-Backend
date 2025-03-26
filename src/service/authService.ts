import {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../../constants/http.codes";
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


