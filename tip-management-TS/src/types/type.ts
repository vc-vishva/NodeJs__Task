import { Document } from "mongoose";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export interface IPlace extends Document {
  placeName: string;
  billAmount: number;
  tipAmount: number;
  createdAt: Date;
  updatedAt: Date;
  user_id: string;
}

export interface IUser extends Document {
  f_name: string;
  l_name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
