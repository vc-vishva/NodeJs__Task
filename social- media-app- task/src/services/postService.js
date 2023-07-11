// import { object } from "joi";
import Post from "../models/posts.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

const createPost = async (
  userId,
  title,
  description,
  category,
  sharedUsers,
  mentions
) => {
  try {
    let sharedUserIds = [];
    if (category === "private" && sharedUsers && sharedUsers.length > 0) {
      sharedUserIds = sharedUsers;
    }

    const post = new Post({
      userId,
      title,
      description,
      category,
      sharedUsers: sharedUserIds,
      mentions,
    });

    await post.save();
    return post;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create post");
  }
};

const getOnePostByPostId = async (postId, userId, page, limit) => {
  try {
    const posts = await Post.aggregate([
      {
        $match: {
          $and: [
            { _id: postId },
            {
              $or: [
                { userId: new ObjectId(userId) },
                { category: "public" },
                {
                  $and: [
                    { category: "private" },
                    { sharedUsers: new ObjectId(userId) },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          description: 1,
          totalComments: { $size: "$comments" },
          totalPages: { $ceil: { $divide: [{ $size: "$comments" }, limit] } },
          currentPage: page,
          totalComments: 1,
          comments: {
            $slice: ["$comments", (page - 1) * limit, limit * page],
          },
        },
      },
    ]);

    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch post");
  }
};

///
const getAllPosts = async (userId, page, limit, searchedUserId, searchText) => {
  try {
    const regex = new RegExp(searchText, "i");
    const skip = (page - 1) * limit;

    let publicPost = {
      category: "public",
    };

    const mentionMe = {
      category: "private",
      $or: [{ sharedUsers: userId }, { userId: userId }],
    };

    const orQuery = [publicPost];
    if (!searchedUserId) {
      orQuery.push(mentionMe);
    }
    if (searchedUserId) {
      const searchUserQuery = {
        sharedUsers: userId,
        $or: [
          { mentions: searchedUserId },
          { "comments.mentions": searchedUserId },
          { userId: searchedUserId },
        ],
      };
      orQuery.push(searchUserQuery);
    }

    const pipeline = [
      {
        $match: {
          $or: orQuery,
        },
      },
      {
        $match: {
          $or: [
            { title: regex },
            { description: regex },
            { "comments.comment": regex },
          ],
        },
      },
      {
        $addFields: {
          matchedComment: {
            $filter: {
              input: "$comments",
              as: "comment",
              cond: {
                $or: [
                  { $eq: ["$$comment.mentions", searchedUserId] },
                  { $eq: ["$$comment.mentions", userId] },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          lastComment: {
            $cond: {
              if: { $gt: [{ $size: "$matchedComment" }, 0] },
              then: { $arrayElemAt: ["$matchedComment", 0] },
              else: { $arrayElemAt: ["$comments", -1] },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          results: { $push: "$$ROOT" },
          lastComments: { $first: "$lastComment" },
        },
      },
      {
        $project: {
          _id: 0,
          totalPost: { $size: "$results" },
          totalPage: { $ceil: { $divide: [{ $size: "$results" }, limit] } },
          results: { $slice: ["$results", skip, limit] },
        },
      },
      {
        $unset: "results.comments",
      },
    ];

    console.dir(pipeline, { depth: null });
    return Post.aggregate(pipeline);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to retrieve posts");
  }
};

export default {
  getOnePostByPostId,
  createPost,
  getAllPosts,
};
// export default createPost
