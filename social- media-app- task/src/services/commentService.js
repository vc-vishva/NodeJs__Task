// import Post from "../models/posts.js";

// const commentService = {
//   createComment: async (postId, comment, userId, mentions) => {
//     try {
//       const post = await Post.findById(postId);

//       if (!post) {
//         return {
//           success: false,
//           statusCode: 404,
//           message: "Post not found",
//         };
//       }

//       if (post.category === "private" && !post.sharedUsers.includes(userId)) {
//         return {
//           success: false,
//           statusCode: 401,
//           message: "Unauthorized to access comments",
//         };
//       }

//       const newComment = {
//         comment,
//         userId,
//         mentions,
//       };

//       post.comments.push(newComment);
//       await post.save();

//       return {
//         success: true,
//         comment: newComment,
//         statusCode: 201,
//       };
//     } catch (error) {
//       console.error(error);
//       return {
//         success: false,
//         statusCode: 500,
//         message: "Failed to create comment",
//       };
//     }
//   },
// };

// export default commentService;


//
import { Result } from "express-validator";
import Post from "../models/posts.js";
const commentService = {
  createComment: async (postId, comment, userId, mentions) => {
    try {
      // Find the post
      const post = await Post.findById(postId);

      if (!post) {
        return {
          success: false,
          statusCode: 404,
          message: "Post not found",
        };
      }

      // Perform your comment creation logic here

      // Return the result
      return {
        success: true,
        statusCode: 201,
        comment: comment, userId, mentions
         
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        statusCode: 500,
        message: "Failed to create comment",
      };
    }
  },
};

export default commentService;