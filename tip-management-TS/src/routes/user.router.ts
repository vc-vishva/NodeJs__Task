import { Router } from "express";
import { validateUser } from "../validation/userValidation";
import * as userController from "../controller/userController";
import authMiddleware from "../middleware/verify";
const userRoutes = Router();

userRoutes.post("/signup", validateUser, userController.signup);
userRoutes.post("/login", userController.login);
userRoutes.put("/", authMiddleware, userController.changePassword);
userRoutes.put("/profile", authMiddleware, userController.ProfileEdit);
userRoutes.delete("/", authMiddleware, userController.deleteUser);

export default userRoutes;
