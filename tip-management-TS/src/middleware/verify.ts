import User from "../models/users";
import { Express, Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
console.log(process.env.JWT_SECRET, "======");

export interface test {
  id?: string | JwtPayload;
}

const authMiddleware = async (
  req: Request & test,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .send({ status: 401, Error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    console.log("token", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);

    if (typeof decoded == "object") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).send({ error: "not found" });
      }
      req.id = decoded.id;
      next();
    }
  } catch (error) {
    res.status(401).send({ error: "Unauthorized...." });
  }
};

export default authMiddleware;
