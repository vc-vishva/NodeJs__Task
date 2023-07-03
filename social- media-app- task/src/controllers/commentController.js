import express from "express";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import Post from "../models/posts.js";
import commentService from "../services/commentService.js";
// import { validateCreateComment } from '../Middlewares/commentMiddleware.js';

const commentController = {
  createComments: async (req, res) => {
    try {
      const { postId } = req.params;
      const { comment, userId, mentions } = req.body;

      // Find the post
      const post = await Post.findById(postId);

      if (!post) {
        return res
          .status(404)
          .json({ success: false, message: "Post not found" });
      }

      if (post.category === "private" && !post.sharedUsers.includes(userId)) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized to access comments" });
      }

      const newComment = {
        comment,
        userId,
        mentions,
      };

      post.comments.push(newComment);
      await post.save();

      res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create comment" });
    }
  },
};

export default commentController;
