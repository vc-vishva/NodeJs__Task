import bcrypt from "bcrypt";
import User from "../models/users";
import { IUser } from "../types/type";
import { JwtPayload } from "jsonwebtoken";

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const createUser = async (
  f_name: string,
  l_name: string,
  email: string,
  password: string
) => {
  const user = new User({
    f_name: f_name,
    l_name: l_name,
    email: email,
    password: password,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return await user.save();
};
export const comparePasswords = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const getUserById = async (id?: string | JwtPayload) => {
  return await User.findById(id);
};

export const updateUser = async (user: IUser) => {
  return await user.save();
};

export const deleteUser = async (id?: string | JwtPayload) => {
  return await User.findByIdAndRemove(id);
};
