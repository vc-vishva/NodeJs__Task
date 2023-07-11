import User from "../models/users";
import { Express, Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import apiResponse from "../utils/response";
import { ObjectId } from "mongoose";

export interface authenticationId {
  id?: ObjectId | JwtPayload;
}

const authMiddleware = async (
  req: Request & authenticationId,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return apiResponse(res, 401, "Access denied. No token provided.");
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    if (typeof decoded == "object") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return apiResponse(res, 401, "not found");
      }

      req.id = decoded.id;
      next();
    }
  } catch (error) {
    return apiResponse(res, 401, "Unauthorized", [], [error]);
  }
};

export default authMiddleware;
