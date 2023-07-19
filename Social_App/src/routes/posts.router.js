import express from "express";
import postController from "../controllers/postController.js";
import { verify } from "jsonwebtoken";
import authMiddleware from "../Middlewares/authMiddleware.js";
import { validatePost } from "../Middlewares/postMiddleware.js";

const postRoutes = express.Router();

// Create a new post
postRoutes.post("/create", validatePost, postController.createPost);
postRoutes.get("/post/:Id", authMiddleware, postController.getOnePostByPostId);
postRoutes.get("/user", authMiddleware, postController.getAllPosts);

export default postRoutes;
