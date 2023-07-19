import express from "express";

import userRoutes from "./users.router.js";
import postRoutes from "./posts.router.js";
import commentRoutes from "../routes/comment.router.js";
const router = express.Router();
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comment", commentRoutes);

export default router;
