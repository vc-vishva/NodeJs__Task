import User from "../models/users";
import { Express, Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
console.log(process.env.JWT_SECRET, "======");
import apiResponse from "../utils/response";
import { ObjectId } from "mongoose";

export interface test {
  id?: ObjectId | JwtPayload;
}

const authMiddleware = async (
  req: Request & test,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return apiResponse(res, 401, "Access denied. No token provided.");
    }
    const token = authHeader.split(" ")[1];
    console.log(token, "token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    if (typeof decoded == "object") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return apiResponse(res, 401, "not found");
      }
      console.log(decoded);

      req.id = decoded.id;
      next();
    }
  } catch (error) {
    console.log("error----------------------------", error);

    res.status(401).send({ error: error });
    return apiResponse(res, 401, "Unauthorized", [], [error]);
  }
};

export default authMiddleware;
