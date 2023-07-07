import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    f_name: { type: String, required: true },
    l_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "userDetails" }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
