import mongoose, { Schema, Types, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export type UserRole = "admin" | "user";

interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  contact: string;
  location: string;
  jobs: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends IUser, Document {
  _id: Types.ObjectId;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {}

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
  },
  {
    timestamps: true,
   
  }
);

UserSchema.pre<UserDocument>("save", async function (next) {
  // Type 'this' as UserDocument
  const user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.matchPassword = async function (
  this: UserDocument,
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password).catch(() => false);
};

const User = mongoose.model<UserDocument, UserModel>("User", UserSchema);
export default User;
