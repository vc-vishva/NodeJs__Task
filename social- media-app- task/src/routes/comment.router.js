import { Router } from "express";
import commentController from "../controllers/commentController.js";
import authMiddleware from '../Middlewares/authMiddleware.js';
import { validateCreateComment } from '../Middlewares/commentMiddleware.js';

const commentRoutes = Router();


commentRoutes.post("/:postId/comments", validateCreateComment, authMiddleware, commentController.createComments);
// postRoutes.get('/comments/:postId', postController.getCommentsByPostId);
// postRoutes.post('/comment/:postId' , authMiddleware, postController.createComments);



export default commentRoutes;