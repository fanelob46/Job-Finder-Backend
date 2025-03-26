import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt"

export interface UserDocument extends mongoose.Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "admin" | "user";
  contact: string;
  location: string;
  jobs: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
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
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    jobs: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function(next) {
let user = this as UserDocument;

if (!user.isModified("password")) {
  return next();
}

const salt = await bcrypt.genSalt(10);

const hash = await bcrypt.hashSync(user.password, salt);

user.password = hash;

return next();
})

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt
    .compare(enteredPassword, user.password)
    .catch((e) => false);
};

const User = mongoose.model("User", UserSchema);

export default User;
