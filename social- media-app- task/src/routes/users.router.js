import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from '../Middlewares/authMiddleware.js';
import validateUser from '../Middlewares/userMiddleware.js';
const userRoutes = Router();

userRoutes.post('/signup', validateUser, userController.signup);
userRoutes.post('/login',  userController.login);
userRoutes.put('/changepassword', authMiddleware, userController.changePassword);
userRoutes.put('/profile/:id',   authMiddleware, userController.changeInfo);
userRoutes.get('/:id', authMiddleware, userController.userProfile);





export default userRoutes;