import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';
import { CreatePostDto } from './createPost.Dto';
import { Types, ObjectId } from 'mongoose';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, title, description, category, sharedUsers, mentions } =
      createPostDto;
    if (!userId) {
      throw new Error('Invalid iddd');
    }
    const post = new this.postModel({
      userId,
      title,
      description,
      category,
      sharedUsers,
      mentions,
    });
    await post.save();
    return { message: 'post add successfully', post };
  }

  async getOnePostByPostId(
    userId: Types.ObjectId,
    postId: Types.ObjectId,
    page: number,
    limit: number,
  ) {
    try {
      const posts = await this.postModel.aggregate([
        {
          $match: {
            $and: [
              { _id: postId },
              {
                $or: [
                  { userId: userId },
                  { category: 'public' },
                  {
                    $and: [{ category: 'private' }, { sharedUsers: userId }],
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
            totalComments: { $size: '$comments' },
            totalPages: {
              $ceil: {
                $divide: [{ $size: '$comments' }, { $toDouble: limit }],
              },
            },
            currentPage: page,
            comments: {
              $slice: ['$comments', (page - 1) * limit, limit * page],
            },
          },
        },
      ]);

      console.dir(posts, { depth: null });

      return { message: 'post add successfully', posts };
    } catch (error) {
      throw new Error('Failed to fetch post');
    }
  }

  async getAllPosts(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    searchedUserId: string,
    searchText: string,
  ) {
    try {
      const regex = new RegExp(searchText, 'i');
      const skip = (page - 1) * limit;

      const publicPost = {
        category: 'public',
      };

      const mentionMe = {
        category: 'private',
        $or: [
          { sharedUsers: new Types.ObjectId(userId) },
          { userId: new Types.ObjectId(userId) },
        ],
      };

      const orQuery = [publicPost];
      if (!searchedUserId) {
        orQuery.push(mentionMe);
      }
      if (searchedUserId) {
        const searchUserQuery = {
          category: 'private',
          sharedUsers: new Types.ObjectId(userId),
          $or: [
            { mentions: new Types.ObjectId(searchedUserId) },
            { 'comments.mentions': new Types.ObjectId(searchedUserId) },
            { userId: new Types.ObjectId(searchedUserId) },
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
              { 'comments.comment': regex },
            ],
          },
        },
        {
          $addFields: {
            matchedComment: {
              $filter: {
                input: '$comments',
                as: 'comment',
                cond: {
                  $or: [
                    { $eq: ['$$comment.mentions', searchedUserId] },
                    { $eq: ['$$comment.mentions', userId] },
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
                if: { $gt: [{ $size: '$matchedComment' }, 0] },
                then: { $arrayElemAt: ['$matchedComment', 0] },
                else: { $arrayElemAt: ['$comments', -1] },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            results: { $push: '$$ROOT' },
            lastComments: { $first: '$lastComment' },
          },
        },
        {
          $project: {
            _id: 0,
            totalPost: { $size: '$results' },
            totalPage: {
              $ceil: { $divide: [{ $size: '$results' }, { $toDouble: limit }] },
            },
            results: { $slice: ['$results', skip, { $toDouble: limit }] },
          },
        },
        {
          $unset: 'results.comments',
        },
      ];

      console.dir(pipeline, { depth: null });
      return this.postModel.aggregate(pipeline);
    } catch (error) {
      throw new Error('Failed to retrieve posts');
    }
  }
}
