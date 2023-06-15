import express from "express";
import jwt from "jsonwebtoken";
const authRouter = express.Router();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Received token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id;
    console.log("Decoded userId:", req.userId);
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    res.status(401).send({ message: "Invalid token." });
  }
};

authRouter.use(verifyToken);

export default authRouter;
