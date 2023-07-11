import express from "express";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import postService from "../services/postService.js";
import Post from "../models/posts.js";

const postController = {
  createPost: async (req, res) => {
    try {
      const { userId, title, description, category, sharedUsers, mentions } =
        req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "userId is required" });
      }

      const post = await postService.createPost(
        userId,
        title,
        description,
        category,
        sharedUsers,
        mentions
      );

      res.status(201).json({ success: true, post });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to create post" });
    }
  },

  getOnePostByPostId: async (req, res) => {
    try {
      const { Id } = req.params;
      const postId = new ObjectId(Id);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const userId = req.user.id;

      const post = await postService.getOnePostByPostId(
        postId,
        userId,
        page,
        limit
      );

      res.status(200).json({ status: 200, message: "success", post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Failed to fetch post" });
    }
  },

  // getAllPosts: async (req, res) => {
  //   try {
  //     const userId = req.params.Id;
  //     const page = parseInt(req.query.page);
  //     const limit = parseInt(req.query.limit);
  //     const searchText = req.query.search || "";
  //     // const mentionUserId = req.body.mentionUserId;

  //     const posts = await postService.getAllPosts(
  //       userId,
  //       page,
  //       limit,
  //       searchText
  //     );

  //     if (posts.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "No posts found for the user",
  //       });
  //     }

  //     const totalPosts = posts.length;
  //     const totalPages = Math.ceil(totalPosts / limit);
  //     const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  //     res.status(200).json({
  //       success: true,
  //       currentPage: page,
  //       totalPosts,
  //       totalPages,
  //       posts: paginatedPosts,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Failed to retrieve posts" });
  //   }
  // },

  // getSearchUserPost : async (req, res) =>{
  //   try {
  //     const userId = req.params.Id;
  //     const searchId = req.params.searchId;
  //     const page = parseInt(req.query.page);
  //     const limit = parseInt(req.query.limit);
  //     const searchText = req.query.search || "";

  //     const posts = await postService.getAllPosts(
  //       userId,
  //       searchId,
  //       page,
  //       limit,
  //       searchText
  //     );

  //     if (posts.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "No posts found for the user",
  //       });
  //     }

  //     const totalPosts = posts.length;
  //     const totalPages = Math.ceil(totalPosts / limit);
  //     const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

  //     res.status(200).json({
  //       success: true,
  //       currentPage: page,
  //       totalPosts,
  //       totalPages,
  //       posts: paginatedPosts,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res
  //       .status(500)
  //       .json({ success: false, message: "Failed to retrieve posts" });
  //   }
  // },

  //*********** */

  getAllPosts: async (req, res) => {
    try {
      const userId = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchedUserId = req.query.searchedUserId || "";
      const searchText = req.query.searchText || "";

      console.log(userId, "useridddddddddddddddddddddd");
      console.log(searchedUserId, "searchiddddddddddddd");
      console.log("req user - - - - - - -  ", req.user._id);
      console.log(searchText, "searchtext");
      const posts = await postService.getAllPosts(
        userId,
        +page,
        +limit,
        searchedUserId,
        searchText
      );

      if (posts.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No posts found for the user",
        });
      }

      // const totalPosts = posts.length;
      // const totalPages = Math.ceil(totalPosts / limit);
      // const paginatedPosts = posts.slice((page - 1) * limit, page * limit);

      res.status(200).json({
        posts,
        success: true,
        // currentPage: page,
        // totalPosts,
        // totalPages,
        // posts: paginatedPosts,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to retrieve posts" });
    }
  },
};

export default postController;

//***************** */
